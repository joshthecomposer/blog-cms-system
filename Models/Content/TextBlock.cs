#pragma warning disable CS8618
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using MyApp.Interfaces;

namespace MyApp.Models.Content;
public class TextBlock : BaseEntity, IDisplayable
{
    [Key]
    public int TextBlockId { get; set; }
    [Required, MinLength(2, ErrorMessage ="At least 2 characters.")]
    public string Content { get; set; }
    public int DisplayOrder { get; set; }
    public string TextType { get; set; } = "paragraph";

    public int BlogId { get; set; }
    [JsonIgnore]
    public Blog? Blog { get; set; }
}
