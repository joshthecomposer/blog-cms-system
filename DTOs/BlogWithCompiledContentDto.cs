using MyApp.Models.Content;
namespace MyApp.DTOs;
public class BlogWithCompiledContentDto
{
	public int BlogId { get; set; }
	public string Title { get; set; }
	public int AdminId { get; set; }

	public bool Released { get; set; }
    public string? CompiledContent { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public BlogWithCompiledContentDto(Blog blog)
    {
		BlogId = blog.BlogId;
		Title = blog.Title;
        CompiledContent = blog.CompiledContent;
        Released = blog.Released;
		CreatedAt = blog.CreatedAt;
		UpdatedAt = blog.UpdatedAt;
	}
}
