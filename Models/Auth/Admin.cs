#pragma warning disable CS8618
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyApp.Models.Content;

namespace MyApp.Models.Auth;
public class Admin : BaseEntity
{
    [Key]
    public int AdminId { get; set; }
    [Required]
    [MinLength(2)]
    public string Name { get; set;}
    [EmailAddress]
    public string Email { get; set; }
    [MinLength(8)]
    public string Password { get; set; }

    public ICollection<Blog> Blogs { get; set; } = new List<Blog>();
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}
