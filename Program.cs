using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Http;
using System.Text;

using MyApp.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("appsettings.secrets.json", optional: true, reloadOnChange: true);

var connectionString =
		$"Host={builder.Configuration["AppSecrets:HOST"]};Port={builder.Configuration["AppSecrets:PORT"]};Database={builder.Configuration["AppSecrets:DB"]};Username={builder.Configuration["AppSecrets:USER"]};Password={builder.Configuration["AppSecrets:PASS"]}";

var jwtSecret = builder.Configuration["AppSecrets:JWTSecret"];

var key = Encoding.ASCII.GetBytes(jwtSecret!);
// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddSession();

builder.Services.AddDbContext<DBContext>(options =>
{
	options.UseNpgsql(connectionString);
});

builder.Services.AddAuthentication(options =>
{
	options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
	options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
	.AddJwtBearer("Bearer", options =>
	{
		options.RequireHttpsMetadata = true;
		options.SaveToken = true;
		options.TokenValidationParameters = new TokenValidationParameters
		{
			ValidateIssuerSigningKey = true,
			IssuerSigningKey = new SymmetricSecurityKey(key),
			ValidateIssuer = false,
			ValidateAudience = false,
			ValidateLifetime = true,
			ClockSkew = TimeSpan.Zero
		};
	});
// Enable CORS
builder.Services.AddCors();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
	app.UseExceptionHandler("/Home/Error");
	// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
	app.UseHsts();
}

// app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseSession();

app.UseCors("AllowOrigins");

app.UseAuthorization();

// app.MapControllerRoute(
// 	name: "default",
// 	pattern: "/",
// 	defaults: new { controller = "Public", action = "Index" }
// );

app.MapControllerRoute(
	name: "admin",
	pattern: "{*url}",
	defaults: new { controller = "Public", action = "Admin" }
);

// app.MapControllerRoute(
//     name: "CatchAll",
//     pattern: "{*url}",
//     defaults: new { controller = "Public", action = "CatchRoute" }
// );

app.Run();
