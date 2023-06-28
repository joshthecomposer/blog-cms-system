#pragma warning disable CS8618
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using MyApp.Interfaces;

namespace MyApp.Models.Content;
public class Tweet : BaseEntity, IDisplayable
{
	[Key]
	public int TweetId { get; set; }
	public string Signature { get; set; }

	public int DisplayOrder { get; set; }

	public int BlogId { get; set; }
	[JsonIgnore]
	public Blog? Blog { get; set; }
}
