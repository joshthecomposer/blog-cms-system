using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

using MyApp.Models.Auth;
using MyApp.Data;
using MyApp.DTOs;

namespace MyApp.Controllers;
[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly DBContext db;
    private readonly IConfiguration _config;
    public AdminController(DBContext context, IConfiguration config)
    {
        db = context;
        _config = config;
    }

    //============REGISTER AND CONFIRM CREATED USER=============

    [HttpPost("register")]
    public async Task<ActionResult<Admin>> Create([FromBody] Admin newAdmin)
    {
        Dictionary<string, List<string>> errors = new Dictionary<string, List<string>>
        {
            {"Email", new List<string> { "Email already registered" }},
            {"Password", new List<string>()}
        };
        if (ModelState.IsValid)
        {
            var emailExists = await db.Admins.Where(a => a.Email == newAdmin.Email).FirstOrDefaultAsync();
            if (emailExists != null)
            {
                return BadRequest(new { errors });
            }
            PasswordHasher<Admin> hasher = new PasswordHasher<Admin>();
            newAdmin.Password = hasher.HashPassword(newAdmin, newAdmin.Password);
            db.Add(newAdmin);
            await db.SaveChangesAsync();
            return CreatedAtAction(
                nameof(GetCreatedAdminAsync),
                new { id = newAdmin.AdminId },
                new AdminNoPasswordDto(newAdmin)
            );
        }
        return BadRequest(ModelState);
    }

    [ApiExplorerSettings(IgnoreApi = true)]
    [ActionName(nameof(GetCreatedAdminAsync))]
    public async Task<ActionResult<Admin>> GetCreatedAdminAsync(int id)
    {
        Admin? admin = await db.Admins.FindAsync(id);
        if (admin != null)
        {
            return admin;
        }
        return BadRequest("Something went wrong when attempting to save the user in the database.");
    }

    //=====================================================
    //====================LOGIN USER=======================

    [HttpPost("login")]
    public async Task<ActionResult<AdminWithSortedBlogsDto>> Login(LoginAdmin loginAdmin)
    {
        Dictionary<string, List<string>> errors = new Dictionary<string, List<string>>
        {
            {"Email", new List<string> { "Invalid email/password." }},
            {"Password", new List<string>()}
        };
        if (ModelState.IsValid)
        {
            var check = await db.Admins.Where(u => u.Email == loginAdmin.Email).FirstOrDefaultAsync();
            if (check ==null)
            {
                return BadRequest(new { errors });
            }

            PasswordHasher<LoginAdmin> hasher = new PasswordHasher<LoginAdmin>();
            PasswordVerificationResult hashCheck = hasher.VerifyHashedPassword(loginAdmin, check.Password, loginAdmin.Password);
            if (hashCheck == 0)
            {
                return BadRequest(new { errors });
            }
            List<RefreshToken> rfsToDelete = db.RefreshTokens.Where(r => r.AdminId == check.AdminId).ToList();
            db.RefreshTokens.RemoveRange(rfsToDelete);
            RefreshToken newRefreshToken = GenerateRefreshToken(check.AdminId);
            db.RefreshTokens.Add(newRefreshToken);
            await db.SaveChangesAsync();
            string token = GenerateAccessToken(check.AdminId);

			var fullUserToReturn = await GetAdminWithAllBlogsWithContentByAdminId(check.AdminId, token, newRefreshToken.Value);
            if (fullUserToReturn != null)
            {
                return fullUserToReturn;
            }
        }
        return BadRequest(ModelState);

    }
    [HttpGet("blog/media/text{adminId}")]
    public async Task<ActionResult<AdminWithSortedBlogsDto>> GetAdminWithAllBlogsWithContentByAdminId(int adminId, string jwt, string rft)
    {

		var admin = await db.Admins
			.Where(a => a.AdminId == adminId)
			.Include(a => a.Blogs)
				.ThenInclude(b => b.Images)
			.Include(a => a.Blogs)
				.ThenInclude(b => b.TextBlocks)
			.Include(a=>a.Blogs)
				.ThenInclude(b=>b.Tweets)
			.FirstOrDefaultAsync();

        if (admin == null)
        {
			return null!;
		}
		var processedBlogs = admin.Blogs.Select(b => new BlogWithOrderedContentDto(b)).ToList();

		var adminPayload = new AdminWithSortedBlogsDto(admin, processedBlogs);
		adminPayload.AccessToken = jwt;
		adminPayload.RefreshToken = rft;

		return adminPayload;
	}
    //=============================================================
    //=========JWT GENERATION VALIDATION AND REFRESH===============

    private string GenerateAccessToken(int adminId)
    {
        JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
        string? encKey = _config["AppSecrets:JWTSecret"];
        byte[] key = Encoding.ASCII.GetBytes(encKey!);
        SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name, Convert.ToString(adminId))
            }),
            Expires = DateTime.UtcNow.AddMinutes(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha256Signature)
        };
        SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private bool ValidateRefreshToken(Admin admin, string refreshToken)
    {
        RefreshToken? refreshTokenAdmin = db.RefreshTokens.Where(rt => rt.Value == refreshToken)
                                            .OrderByDescending(rt => rt.ExpiryDate)
                                            .FirstOrDefault();
        if (refreshTokenAdmin != null && refreshTokenAdmin.AdminId == admin.AdminId && refreshTokenAdmin.ExpiryDate > DateTime.UtcNow)
        {
            return true;
        }
        return false;
    }
    private RefreshToken GenerateRefreshToken(int userId)
    {
        RefreshToken rt = new();

        byte[] rn = new byte[32];
        using (RandomNumberGenerator rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(rn);
            rt.Value = Convert.ToBase64String(rn);
        }
        rt.AdminId = userId;
        rt.ExpiryDate = DateTime.UtcNow.AddMonths(1);
        return rt;
    }

    [HttpPost("tokens/refresh")]
    public async Task<ActionResult<RefreshRequest>> DoRefreshToken([FromBody] RefreshRequest refreshRequest)
    {
        if (ModelState.IsValid)
        {
            string accessToken = refreshRequest.AccessToken;
            string refreshToken = refreshRequest.RefreshToken;

            var principal = GetPrincipalFromExpiredToken(accessToken, _config["AppSecrets:JWTSecret"]!);
            if (principal == null)
            {
                return BadRequest("Invalid access token or refresh token");
            }
			int id = Int32.Parse(principal.Identity!.Name!);
            var admin = await db.Admins.Where(u => u.AdminId == id).FirstOrDefaultAsync();

            if (admin == null)
            {
                return BadRequest("User not found for this token.");
            }

            RefreshToken? refreshTokenAdmin = db.RefreshTokens.Where(rt => rt.Value == refreshToken)
                                                            .OrderByDescending(rt => rt.ExpiryDate)
                                                            .FirstOrDefault();
            if (refreshTokenAdmin != null && refreshTokenAdmin.AdminId == admin.AdminId && refreshTokenAdmin.ExpiryDate > DateTime.UtcNow)
            {
                var newToken = GenerateAccessToken(admin.AdminId);
				var newRefreshToken = GenerateRefreshToken(id);
				var rfsToDelete = await db.RefreshTokens.Where(r=>r.AdminId == id).ToListAsync();
				db.RemoveRange(rfsToDelete);
				await db.RefreshTokens.AddAsync(newRefreshToken);
				await db.SaveChangesAsync();
				RefreshRequest result = new(newToken, newRefreshToken.Value);
                return result;
            }
        }
        return BadRequest("Invalid refresh request.");
    }

    public static ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token, string jwtSecret)
    {

		var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateLifetime = false
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
        if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
		{
            throw new SecurityTokenException("Invalid token");
		}

        return principal;
    }

    public static bool VerifyClaim(AuthenticationHeaderValue input, int id)
    {
        JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
        string? credentials = input.Parameter;
		Console.WriteLine("RUNNING REGULAR VERIFY CLAIM FUNCTION WITH TOKEN " + id);
		Claim? verifiedClaim = handler.ReadJwtToken(credentials).Claims.Where(c => c.Value == id.ToString()).FirstOrDefault();
		return verifiedClaim != null;
    }
    public static bool VerifyClaim(string input, int id)
    {
        JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
        string? credentials = input;
        Console.WriteLine("RUNNING OVERLOADED VERIFY CLAIM FUNCTION WITH TOKEN", input);
        Claim? verifiedClaim = handler.ReadJwtToken(credentials).Claims.Where(c => c.Value == id.ToString()).FirstOrDefault();
        return verifiedClaim == null ? false : true;
    }
	// public static int GetClaimFromToken(AuthenticationHeaderValue input)
	// {
	// 	JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
	// 	string? credentials = input.Parameter;
	// 	if (credentials==null || credentials==string.Empty){ return -1; }
	// 	var verifiedClaim = handler.ReadJwtToken(credentials).Claims
	// 		.Select(c => c.Value).FirstOrDefault();
	// 	if (verifiedClaim == null || credentials==string.Empty) { return -1; };

	// 	return Int32.Parse(verifiedClaim);
	// }

    //==================================================
}
