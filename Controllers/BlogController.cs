using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using MyApp.Models.Content;
using System.Text.Json;
using MyApp.Data;
using MyApp.DTOs;

namespace MyApp.Controllers;
[Authorize]
[ApiController]
[Route("api/blog")]
public class BlogController : Controller
{
	private readonly DBContext _db;
	private readonly IConfiguration _config;

	public BlogController(DBContext context, IConfiguration config)
	{
		_config = config;
		_db = context;
	}

	[HttpPost]
	public async Task<ActionResult<Blog>> InitializeBlog(Blog newBlog)
	{
		try
		{
			var headerValue = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
			if (ModelState.IsValid)
			{
				var token = headerValue?.Parameter;
				if (string.IsNullOrEmpty(token))
				{
					return Unauthorized("Token was null or empty");
				}
				var principal = AdminController.GetPrincipalFromExpiredToken(token, _config["AppSecrets:JWTSecret"]!);
				if (principal?.Identity?.Name == null)
				{
					return Unauthorized("Principal was null or name was null");
				}
				if (!int.TryParse(principal.Identity.Name, out int id))
				{
					return BadRequest("Identity name was not a valid integer");
				}
				newBlog.AdminId = id;
				await _db.Blogs.AddAsync(newBlog);
				await _db.SaveChangesAsync();

				return CreatedAtAction(nameof(GetOne), new { blogId = newBlog.BlogId }, new BlogWithOrderedContentDto(newBlog));
			}
			return BadRequest("Model was not valid.");
		}
		catch (FormatException)
		{
			return BadRequest("Authorization header format was invalid");
		}
		catch (Exception e)
		{
			// Ideally, log the exception here.
			return BadRequest("Something went wrong: " + e.Message);
		}
	}

	[HttpGet("{blogId}")]
	public async Task<ActionResult<Blog>> GetOne(int blogId)
	{
		try
		{
			var headerValue = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
			var token = headerValue?.Parameter;
			if (string.IsNullOrEmpty(token))
			{
				return Unauthorized("Token was null or empty");
			}
			var principal = AdminController.GetPrincipalFromExpiredToken(token, _config["AppSecrets:JWTSecret"]!);
			if (principal?.Identity?.Name == null)
			{
				return Unauthorized("Principal was null or name was null");
			}
			if (principal?.Identity?.Name == null)
			{
				return Unauthorized("Principal was null or name was null");
			}
			if (!int.TryParse(principal.Identity.Name, out int id))
			{
				return BadRequest("Identity name was not a valid integer");
			}
			var blog = await _db.Blogs.FindAsync(blogId);
			if (blog == null)
			{
				return BadRequest("Resource not found.");
			}
			if (id != blog.AdminId)
			{
				return Unauthorized("provided adminId has no claim to this blog");
			}
			return blog;
		}
		catch (FormatException)
		{
			return BadRequest("Authorization header format was invalid");
		}
		catch (Exception e)
		{
			return BadRequest("Something went wrong " + e.Message);
		}
	}

	[HttpDelete("{blogId}")]
	public async Task<ActionResult<Blog>> DeleteById(int blogId)
	{
		var blog = await _db.Blogs.FindAsync(blogId);
		try
		{
			var headerValue = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
			var token = headerValue?.Parameter;
			if (string.IsNullOrEmpty(token))
			{
				return Unauthorized("Token was null or empty");
			}
			var principal = AdminController.GetPrincipalFromExpiredToken(token, _config["AppSecrets:JWTSecret"]!);
			if (principal?.Identity?.Name == null)
			{
				return Unauthorized("Principal was null or name was null");
			}
			if (principal?.Identity?.Name == null)
			{
				return Unauthorized("Principal was null or name was null");
			}
			if (!int.TryParse(principal.Identity.Name, out int id))
			{
				return BadRequest("Identity name was not a valid integer");
			}
			if (blog != null && id == blog.AdminId)
			{
				var deleted = _db.Blogs.Remove(blog);
				await _db.SaveChangesAsync();
				return Ok(blog);
			}
			return BadRequest("Resource not found");
		}
		catch (FormatException)
		{
			return BadRequest("Authorization header format was invalid");
		}
		catch (Exception e)
		{
			return BadRequest("Something went wrong " + e.Message);
		}
	}

	[HttpGet("media/text")]
	public async Task<ActionResult<List<BlogWithOrderedContentDto>>> GetAllBlogsWithContentByAdminId()
	{
		try
		{
			var headerValue = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
			var token = headerValue?.Parameter;
			if (string.IsNullOrEmpty(token))
			{
				return Unauthorized("Token was null or empty");
			}
			var principal = AdminController.GetPrincipalFromExpiredToken(token, _config["AppSecrets:JWTSecret"]!);
			if (principal?.Identity?.Name == null)
			{
				return Unauthorized("Principal was null or name was null");
			}
			if (principal?.Identity?.Name == null)
			{
				return Unauthorized("Principal was null or name was null");
			}
			if (!int.TryParse(principal.Identity.Name, out int id))
			{
				return BadRequest("Identity name was not a valid integer");
			}
			var blogs = await _db.Blogs
				.Where(b => b.AdminId == id)
				.Include(b => b.Images)
				.Include(b => b.TextBlocks)
				.Include(b => b.Tweets)
				.ToListAsync();

			var processedBlogs = blogs.Select(b => new BlogWithOrderedContentDto(b)).ToList();

			return processedBlogs;
		}
		catch (FormatException)
		{
			return BadRequest("Authorization header format was invalid");
		}
		catch (Exception e)
		{
			return BadRequest("Something went wrong " + e.Message);
		}
	}

}
