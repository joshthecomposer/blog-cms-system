using MyApp.Models.Content;
using MyApp.Models.Auth;

namespace MyApp.DTOs;
public class AdminWithTokensDto
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }

    public int AdminId { get; set; }
    public string Name { get; set;}
    public string Email { get; set; }

    public List<Blog>? Blogs { get; set; } = new();

    public AdminWithTokensDto(Admin user, string token, string rfToken)
    {
        AccessToken = token;
        RefreshToken = rfToken;
        AdminId = user.AdminId;
        Name = user.Name;
        Email = user.Email;

        Blogs = user.Blogs.ToList();
    }
}
