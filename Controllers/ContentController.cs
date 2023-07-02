using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using MyApp.Models.Content;
using MyApp.Data;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json.Serialization;
using MyApp.DTOs;
using MyApp.Interfaces;

namespace MyApp.Controllers;
[Authorize]
[ApiController]
[Route("api/content")]
public class ContentController : ControllerBase
{

	// Create JsonSerializerOptions with ReferenceHandler.Preserve
	private readonly DBContext _db;
	private readonly IConfiguration _config;
	public ContentController(DBContext context, IConfiguration config)
	{
		_config = config;
		_db = context;
	}

	[HttpPost("text")]
	public async Task<ActionResult<BlogWithOrderedContentDto>> CreateTextBlock([FromBody] TextBlock newText)
	{
		try
		{
			if (ModelState.IsValid)
			{
				var authHeader = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);

				var token = authHeader.Parameter;

				if(string.IsNullOrEmpty(token))
				{
					return BadRequest("Token was null or empty");
				}
				var principal = AdminController.GetPrincipalFromExpiredToken(token, _config["AppSecrets:JWTSecret"]!);
				if (principal?.Identity?.Name == null)
				{
					return Unauthorized("Principal was null or name was null");
				}
				if (!int.TryParse(principal.Identity.Name, out int id))
				{
					return BadRequest("Identity name was not a valid integer.");
				}

				bool check = await _db.Blogs.Where(b => b.AdminId == id).AnyAsync();

				if (check == false) { return Unauthorized("No blogs matched this adminId"); };

				newText.DisplayOrder = await GetNewOrderForDb(newText.DisplayOrder, newText.BlogId);

				await _db.TextBlocks.AddAsync(newText);
				await _db.SaveChangesAsync();

				var blog = await _db.Blogs.Where(b => b.BlogId == newText.BlogId && b.AdminId == id).FirstOrDefaultAsync();
				if (blog != null)
				{
					return new BlogWithOrderedContentDto(blog);
				}
			}
			return BadRequest("Model was not valid.");
		}
		catch (FormatException)
		{
			return BadRequest("Authorization header format was invalid");
		}
		catch (Exception e)
		{

			return BadRequest(e.Message);

		}

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
		int maxDisplayOrder = displayables.Select(d => d.DisplayOrder).DefaultIfEmpty(0).Max();

		Console.WriteLine(JsonSerializer.Serialize(displayables));
		int original = input;
		int nextValueAboveInput = 0;
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
		Console.WriteLine(displayables);

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

	[HttpPut("text")]
	public async Task<ActionResult<BlogWithOrderedContentDto>> UpdateTextBlockContent([FromBody] DisplayableDto displayable)
	{

		var oldTextBlock = await _db.TextBlocks.Where(t => t.TextBlockId == displayable.DisplayableId).FirstOrDefaultAsync();
		if (oldTextBlock != null)
		{
			oldTextBlock.Content = displayable.Content!;
			await _db.SaveChangesAsync();
		}
		var blog = await _db.Blogs
			.Include(b => b.TextBlocks)
			.Include(b => b.Images)
			.Include(b => b.Tweets)
			.Where(b => b.BlogId == displayable.BlogId)
			.FirstOrDefaultAsync();
		if (blog != null)
		{
			return new BlogWithOrderedContentDto(blog);
		}
		return BadRequest();
	}

	[HttpDelete("text")]
	public async Task<ActionResult<BlogWithOrderedContentDto>> DeleteTextBlockById([FromBody] DisplayableDto input)
	{
		var blog = await _db.Blogs
		.Include(b => b.TextBlocks)
		.Include(b => b.Images)
		.Include(b => b.Tweets)
		.SingleOrDefaultAsync(b => b.BlogId == input.BlogId);
		if (blog != null)
		{
			var textToDelete = blog.TextBlocks.Where(t => t.TextBlockId == input.DisplayableId).SingleOrDefault();
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

	[HttpPut("reorder")]
	public async Task<ActionResult<BlogWithOrderedContentDto>> ReorderBlogContent(DisplayableDto input)
	{
		if (ModelState.IsValid)
		{
			try
			{
				var headerValue = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
				var token = headerValue?.Parameter;
				if (string.IsNullOrEmpty(token))
				{
					return Unauthorized("Token was null or empty");
				}
				var principal = AdminController.GetPrincipalFromExpiredToken(token, _config["AppSecrets:JWTSecret"]!);
				if (principal?.Identity?.Name == null)
				{
					return Unauthorized("Principal was null or name was null");
				}
				if (!int.TryParse(principal.Identity.Name, out int id))
				{
					return BadRequest("Identity name was not a valid integer");
				}
				bool check = await _db.Blogs.Where(b => b.BlogId == input.BlogId && b.AdminId == id).AnyAsync();
				if (!check) { return Unauthorized("Requested Resource was not found or did not match claim ID"); }
				switch (input.DataType)
				{
					case "TextBlock":
						var oldTB = await _db.TextBlocks.Where(t => t.TextBlockId == input.DisplayableId).FirstOrDefaultAsync();
						if (oldTB == null) { return NotFound(); }
						oldTB.DisplayOrder = await GetNewOrderForDb(input.DisplayOrder, input.BlogId);
						break;
					case "Image":
						var oldI = await _db.Images.Where(t => t.ImageId == input.DisplayableId).FirstOrDefaultAsync();
						if (oldI == null) { return NotFound(); }
						oldI.DisplayOrder = await GetNewOrderForDb(input.DisplayOrder, input.BlogId);
						break;
				}
				await _db.SaveChangesAsync();
				var blog = await _db.Blogs.Where(b => b.BlogId == input.BlogId)
					.Include(b => b.TextBlocks)
					.Include(b => b.Images)
					.FirstOrDefaultAsync();
				if (blog == null)
				{
					return NotFound();
				}
				return new BlogWithOrderedContentDto(blog);
			}
			catch (FormatException)
			{
				return BadRequest("Authorization header format was invalid");
			}
			catch (Exception e)
			{
				return BadRequest("Something went wrong " + e.Message);
			}
		}
		return BadRequest("Modelstate was invalid");
	}
}
