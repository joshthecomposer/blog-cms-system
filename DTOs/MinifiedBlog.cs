using MyApp.Models;
using MyApp.Models.Content;

namespace MyApp.DTOs;
public class MinifiedBlogDto : BaseEntity
{
  public int BlogId { get; set; }
  public string Title { get; set; }
  public int AdminId { get; set; }

  public bool Released { get; set; } = false;

  public MinifiedBlogDto(Blog blog)
  {
        BlogId = blog.BlogId;
        Title = blog.Title;
        AdminId = blog.AdminId;
        Released = blog.Released;

        CreatedAt = blog.CreatedAt;
        UpdatedAt = blog.UpdatedAt;
    }
}
