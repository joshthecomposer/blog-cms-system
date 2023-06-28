#pragma warning disable CS8618
using System.ComponentModel.DataAnnotations;

namespace MyApp.Models.Auth;
public class RefreshToken : BaseEntity
{
    [Key]
    public int RefreshTokenId { get; set; }

    public string Value { get; set; }
    public DateTime ExpiryDate { get; set; }

    //Foreign Keys
    public int AdminId { get; set; }
    //Entity Relationships
    public Admin? Admin { get; set; }
}
