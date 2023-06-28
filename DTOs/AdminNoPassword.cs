using MyApp.Models.Auth;

namespace MyApp.DTOs;
public class AdminNoPasswordDto
{
    public int AdminId { get; set; }
    public string Name { get; set;}
    public string Email { get; set; }

    public AdminNoPasswordDto(Admin admin)
    {
        AdminId = admin.AdminId;
        Name = admin.Name;
        Email = admin.Email;
    }
}
