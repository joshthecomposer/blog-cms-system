using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using MyApp.Models.Content;
using MyApp.Data;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using MyApp.DTOs;
using MyApp.Interfaces;

namespace MyApp.Controllers;
[ApiController]
[Route("api/content")]
public class ContentController : ControllerBase
{

	// Create JsonSerializerOptions with ReferenceHandler.Preserve
	private readonly DBContext _db;

	public ContentController(DBContext context)
	{
		_db = context;
	}

	[HttpPost("text")]
	public async Task<ActionResult<TextBlock>> CreateTextBlock(TextBlock newText)
	{
		if (ModelState.IsValid)
		{
			newText.DisplayOrder = await GetNewOrderForDb(newText.DisplayOrder, newText.BlogId);

			await _db.TextBlocks.AddAsync(newText);
			await _db.SaveChangesAsync();
			return CreatedAtAction(nameof(GetTextById), new { id = newText.TextBlockId }, newText);
		}
		return BadRequest(ModelState);
	}

	public async Task<int> GetNewOrderForDb(int input, int blogId)
	{
		//TODO: Combine these into one query for the blog and then do the stuff with them to limit the amount of queries.
		var textBlocks = await _db.TextBlocks
				.Where(t => t.BlogId == blogId)
				.Select(t => (IDisplayable)t)
				.ToListAsync();

		var media = await _db.Images
				.Where(m => m.BlogId == blogId)
				.Select(m => (IDisplayable)m)
				.ToListAsync();

		List<IDisplayable> displayables = textBlocks.Concat(media).OrderBy(d => d.DisplayOrder).ToList();

		int maxDisplayOrder = displayables.Select(d => d.DisplayOrder).DefaultIfEmpty(0).Max(); ;

		int original = input;
		int nextValueAboveInput = 20;
		int cursorPosition = 1;

		if (!displayables.Any()) { return 10; }

		if (original > maxDisplayOrder) { return maxDisplayOrder + 10; }

		if (displayables.Any())
		{
			for (int i = 0; i < displayables.Count; i++)
			{
				if (displayables[i].DisplayOrder > original)
				{
					nextValueAboveInput = displayables[i].DisplayOrder;
					cursorPosition = i;
					break;
				}
			}

			input = ((input + 9) / 10) * 10;

			for (int i = cursorPosition; i < displayables.Count; i++)
			{
				if (displayables[i].DisplayOrder < original) { continue; };
				displayables[i].DisplayOrder += 10;
			}
		}

		await _db.SaveChangesAsync();
		return input;
	}

	[HttpGet("text/{id}")]
	public async Task<ActionResult<TextBlock>> GetTextById(int id)
	{
		var text = await _db.TextBlocks.FindAsync(id);
		if (text == null)
		{
			return BadRequest("Resource not found.");
		}
		return text;
	}

	//TODO: split this to where if there is a file it uploads otherwise it just saves a url.
	[HttpPost("media")]
	public async Task<ActionResult<Image>> HandleImageUpload(IFormFile file, [FromForm] Image newMedia)
	{
		if (file != null && file.Length > 0 && ModelState.IsValid)
		{
			string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
			string filePath = Path.Combine("wwwroot/uploads/", fileName);
			Console.WriteLine(filePath + " is the file path");
			try
			{
				using (var stream = new FileStream(filePath, FileMode.Create))
				{
					await file.CopyToAsync(stream);
				}
			}
			catch (Exception e)
			{
				return BadRequest(e.Message);
			}
			newMedia.Url = filePath;
			newMedia.DisplayOrder = await GetNewOrderForDb(newMedia.DisplayOrder, newMedia.BlogId);
			await _db.AddAsync(newMedia);
			await _db.SaveChangesAsync();
			return CreatedAtAction(nameof(GetImageById), new { id = newMedia.ImageId }, newMedia);
		}
		return BadRequest();
	}

	[HttpGet("media/{mediaId}")]
	public async Task<ActionResult<Image>> GetImageById(int mediaId)
	{
		var media = await _db.Images.FindAsync(mediaId);
		if (media == null)
		{
			return BadRequest(new { Message = "Resource not found." });
		}
		return media;
	}

	[HttpGet("media/text/{blogId}")]
	public async Task<ActionResult<List<DisplayableDto>>> GetMediaAndTextByBlogId(int blogId)
	{

		//TODO: Combine this into one query, and look elsewhere for more to combine.
		var blog = await _db.Blogs
			.Where(b => b.BlogId == blogId)
			.Include(b => b.TextBlocks)
			.Include(b => b.Images)
			.FirstOrDefaultAsync();

		if (blog == null)
		{
			return BadRequest();
		}

		var displayables = blog.Images
			.Select(m => new DisplayableDto(m))
			.Concat(blog.TextBlocks
				.Select(t => new DisplayableDto(t)))
			.OrderBy(d => d.DisplayOrder)
			.ToList();

		return displayables;
	}

	[HttpDelete("text/{textBlockId}/{blogId}")]
	public async Task<ActionResult<BlogWithOrderedContentDto>> DeleteTextBlockById(int blogId, int textBlockId)
	{
		var blog = await _db.Blogs
		.Include(b => b.TextBlocks)
		.Include(b=>b.Images)
		.Include(b=>b.Tweets)
		.SingleOrDefaultAsync(b => b.BlogId == blogId);
		if (blog != null)
		{
			var textToDelete = blog.TextBlocks.Where(t => t.TextBlockId == textBlockId).SingleOrDefault();
			if (textToDelete != null)
			{
				_db.TextBlocks.Remove(textToDelete);
				blog.TextBlocks.Remove(textToDelete);
				await _db.SaveChangesAsync();
				return new BlogWithOrderedContentDto(blog);
			}

		}
		return BadRequest("TextBlock not found");
	}
}
