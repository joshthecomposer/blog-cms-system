#pragma warning disable CS8618
using Microsoft.EntityFrameworkCore;
using MyApp.Models.Auth;
using MyApp.Models.Content;

namespace MyApp.Data;

public class DBContext : DbContext
{
    public DBContext(DbContextOptions options) : base(options) { }

    public DbSet<Admin> Admins { get; set; }
    public DbSet<Blog> Blogs { get; set; }
    public DbSet<Image> Images { get; set; }
    public DbSet<TextBlock> TextBlocks { get; set; }
    public DbSet<Tweet> Tweets { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Seed();
    }
}
