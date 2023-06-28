using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApp.Models.Content;
using MyApp.Data;
using MyApp.DTOs;

namespace MyApp.Controllers;
[ApiController]
[Route("api/blog")]
public class BlogController : Controller
{
    private readonly DBContext _db;

    public BlogController(DBContext context)
    {
        _db = context;
    }

    [HttpPost]
    public async Task<ActionResult<Blog>> InitializeBlog(Blog newBlog)
    {
        if (ModelState.IsValid)
        {
            await _db.Blogs.AddAsync(newBlog);
            await _db.SaveChangesAsync();

			return CreatedAtAction(nameof(GetOne), new { blogId = newBlog.BlogId }, newBlog);
        }
        return BadRequest();
    }

    [HttpGet("{blogId}")]
    public async Task<ActionResult<Blog>> GetOne(int blogId)
    {
        var blog = await _db.Blogs.FindAsync(blogId);
        if (blog == null)
        {
            return BadRequest("Resource not found.");
        }
        return blog;
    }

    [HttpDelete("{blogId}")]
    public async Task<ActionResult<Blog>> DeleteById(int blogId)
    {
        var blog = await _db.Blogs.FindAsync(blogId);
        if(blog != null)
        {
            var deleted = _db.Blogs.Remove(blog);
            await _db.SaveChangesAsync();
            return Ok(blog);
        }
        return BadRequest("Resource not found");
    }

    [HttpGet("media/text/{adminId}")]
    public async Task<ActionResult<List<BlogWithOrderedContentDto>>> GetAllBlogsWithContentByAdminId(int adminId)
    {
		var blogs = await _db.Blogs
			.Where(b => b.AdminId == adminId)
			.Include(b => b.Images)
			.Include(b => b.TextBlocks)
			.Include(b=>b.Tweets)
			.ToListAsync();

		var processedBlogs = blogs.Select(b => new BlogWithOrderedContentDto(b)).ToList();

		return processedBlogs;
	}

}
