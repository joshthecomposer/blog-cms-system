using MyApp.Models.Content;
namespace MyApp.DTOs;
public class BlogWithOrderedContentDto
{
	public int BlogId { get; set; }
	public string Title { get; set; }
	public int AdminId { get; set; }

	public bool Released { get; set; }

	public List<DisplayableDto> Displayables { get; set; } = new();

	public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public BlogWithOrderedContentDto(Blog blog)
    {
		Displayables = blog.Images
			.Select(m => new DisplayableDto(m))
			.Concat(blog.TextBlocks.Select(t => new DisplayableDto(t)))
			.Concat(blog.Tweets.Select(t=>new DisplayableDto(t)))
            .OrderBy(d=>d.DisplayOrder)
			.ToList();
		BlogId = blog.BlogId;
		Title = blog.Title;
		// AdminId = blog.AdminId;
		Released = blog.Released;
		CreatedAt = blog.CreatedAt;
		UpdatedAt = blog.UpdatedAt;
	}
}
