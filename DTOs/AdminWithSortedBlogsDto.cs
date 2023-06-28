using MyApp.Models.Auth;
namespace MyApp.DTOs;
public class AdminWithSortedBlogsDto
{
    public string? AccessToken { get; set; }
    public string? RefreshToken { get; set; }

	public int AdminId { get; set; }
    public string Name { get; set;}
    public string Email { get; set; }

    public List<BlogWithOrderedContentDto> Blogs { get; set; } = new();

    public AdminWithSortedBlogsDto(Admin admin, List<BlogWithOrderedContentDto> blogs)
    {
		AdminId = admin.AdminId;
		Name = admin.Name;
		Email = admin.Email;

		Blogs = blogs;
	}
}
