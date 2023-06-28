#pragma warning disable CS8618
namespace MyApp.DTOs;
public class MediaDto
{
    public int MediaId { get; set; }
    public string? Url { get; set; }
    public string Type { get; set; }
    public string? Caption { get; set; }
    public int DisplayOrder { get; set; }
}
