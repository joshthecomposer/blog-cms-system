#pragma warning disable CS8618
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Models.Content;
public class Blog : BaseEntity
{
  [Key]
  public int BlogId { get; set; }
  [Required]
  public string Title { get; set; }
  [Required]
  public int AdminId { get; set; }

  public bool Released { get; set; } = false;

  public ICollection<Image> Images { get; set; } = new List<Image>();
  public ICollection<TextBlock> TextBlocks { get; set; } = new List<TextBlock>();
  public ICollection<Tweet> Tweets { get; set; } = new List<Tweet>();
}
