using MyApp.Models.Content;
using System.Text.Json.Serialization;
namespace MyApp.DTOs;
public class DisplayableDto
{
	public int DisplayableId { get; set; }
	public int DisplayOrder { get; set; }
	public string DataType { get; set; } = "TextBlock";
	public int BlogId { get; set; }

	//Media specific properties.
	public string? Url { get; set; }
	public string? Caption { get; set; }

	//Text specific properties.
	public string? TextType { get; set; }
	public string? Content { get; set; }

	//Tweet specific properties
	public string? Signature { get; set; }

	[JsonConstructor]
	public DisplayableDto() { }

	public DisplayableDto(TextBlock textBlock)
	{
		DisplayableId = textBlock.TextBlockId;
		DisplayOrder = textBlock.DisplayOrder;
		DataType = "TextBlock";
		BlogId = textBlock.BlogId;

		Content = textBlock.Content;
		TextType = textBlock.TextType;
	}

	public DisplayableDto(Image image)
	{
		DisplayableId = image.ImageId;
		DisplayOrder = image.DisplayOrder;
		DataType = "Image";
		BlogId = image.BlogId;

		Url = image.Url;
		Caption = image.Caption;
	}

	public DisplayableDto(Tweet tweet)
	{
		DisplayableId = tweet.TweetId;
		DisplayOrder = tweet.DisplayOrder;
		DataType = "Tweet";
		BlogId = tweet.BlogId;

		Signature = tweet.Signature;
	}
}
