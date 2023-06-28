using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace MyApp.Controllers;
public class PublicController : Controller
{
	public ViewResult Index()
	{
		return View();
	}

	public ViewResult Admin()
	{
		string? clientIp = HttpContext.Connection.RemoteIpAddress?.ToString();
		if (clientIp != null || clientIp != string.Empty)
		{
			Console.WriteLine(clientIp);
		}
		return View();
	}

	public ViewResult CatchRoute()
	{
		return View();
	}
}
