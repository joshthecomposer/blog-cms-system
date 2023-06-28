#pragma warning disable CS8618
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Models.Auth;
public class LoginAdmin
{
    [EmailAddress]
    public string Email { get; set; }
    [Required]
    public string Password { get; set; }
}
