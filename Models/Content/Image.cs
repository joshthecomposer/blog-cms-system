#pragma warning disable CS8618
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using MyApp.Interfaces;

namespace MyApp.Models.Content;
public class Image : BaseEntity, IDisplayable
{
    [Key]
    public int ImageId { get; set; }
    public int DisplayOrder { get; set; }
	public string? Url { get; set; }
	public string? Caption { get; set; }

	public int BlogId { get; set; }
    [JsonIgnore]
    public Blog? Blog { get; set; }
}
