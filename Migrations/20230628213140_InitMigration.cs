using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MyApp.Migrations
{
    /// <inheritdoc />
    public partial class InitMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Admins",
                columns: table => new
                {
                    AdminId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Password = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admins", x => x.AdminId);
                });

            migrationBuilder.CreateTable(
                name: "Blogs",
                columns: table => new
                {
                    BlogId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    AdminId = table.Column<int>(type: "integer", nullable: false),
                    Released = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Blogs", x => x.BlogId);
                    table.ForeignKey(
                        name: "FK_Blogs_Admins_AdminId",
                        column: x => x.AdminId,
                        principalTable: "Admins",
                        principalColumn: "AdminId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RefreshTokens",
                columns: table => new
                {
                    RefreshTokenId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Value = table.Column<string>(type: "text", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AdminId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshTokens", x => x.RefreshTokenId);
                    table.ForeignKey(
                        name: "FK_RefreshTokens_Admins_AdminId",
                        column: x => x.AdminId,
                        principalTable: "Admins",
                        principalColumn: "AdminId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Images",
                columns: table => new
                {
                    ImageId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    Url = table.Column<string>(type: "text", nullable: false),
                    Caption = table.Column<string>(type: "text", nullable: true),
                    BlogId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Images", x => x.ImageId);
                    table.ForeignKey(
                        name: "FK_Images_Blogs_BlogId",
                        column: x => x.BlogId,
                        principalTable: "Blogs",
                        principalColumn: "BlogId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TextBlocks",
                columns: table => new
                {
                    TextBlockId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Content = table.Column<string>(type: "text", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    TextType = table.Column<string>(type: "text", nullable: false),
                    BlogId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TextBlocks", x => x.TextBlockId);
                    table.ForeignKey(
                        name: "FK_TextBlocks_Blogs_BlogId",
                        column: x => x.BlogId,
                        principalTable: "Blogs",
                        principalColumn: "BlogId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tweets",
                columns: table => new
                {
                    TweetId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Signature = table.Column<string>(type: "text", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    BlogId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tweets", x => x.TweetId);
                    table.ForeignKey(
                        name: "FK_Tweets_Blogs_BlogId",
                        column: x => x.BlogId,
                        principalTable: "Blogs",
                        principalColumn: "BlogId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Admins",
                columns: new[] { "AdminId", "CreatedAt", "Email", "Name", "Password", "UpdatedAt" },
                values: new object[] { 1, new DateTime(2023, 6, 28, 21, 31, 39, 862, DateTimeKind.Utc).AddTicks(880), "bugs@acme.com", "Bugs Bunny", "AQAAAAIAAYagAAAAEEtK4Q9KRWNOMTrAgD/U4uPtmF1T0/ZUqHE1EWrvcgm0nPuONySqcU+fCna1hXsCjg==", new DateTime(2023, 6, 28, 21, 31, 39, 862, DateTimeKind.Utc).AddTicks(884) });

            migrationBuilder.InsertData(
                table: "Blogs",
                columns: new[] { "BlogId", "AdminId", "CreatedAt", "Released", "Title", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, 1, new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4067), false, "The Eagles' Role in Middle-earth: Why the Ring Couldn't Be Taken to Mordor", new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4070) },
                    { 2, 1, new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4076), false, "The Hobbits Are Eating", new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4077) },
                    { 3, 1, new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4078), false, "Gandalf does Gandalf Things", new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4079) },
                    { 4, 1, new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4080), false, "Some other blog", new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4080) },
                    { 5, 1, new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4081), false, "Bloggy bloggy blog", new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4081) }
                });

            migrationBuilder.InsertData(
                table: "Images",
                columns: new[] { "ImageId", "BlogId", "Caption", "CreatedAt", "DisplayOrder", "UpdatedAt", "Url" },
                values: new object[] { 1, 1, null, new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4126), 10, new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4126), "https://www.eagles.org/wp-content/uploads/2020/07/MG_7021-176-scaled.jpg" });

            migrationBuilder.InsertData(
                table: "TextBlocks",
                columns: new[] { "TextBlockId", "BlogId", "Content", "CreatedAt", "DisplayOrder", "TextType", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, 1, "Introduction", new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4148), 20, "header", new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4149) },
                    { 2, 1, "In J.R.R. Tolkien's epic fantasy masterpiece, \"The Lord of the Rings,\" the journey to destroy the One Ring and defeat the Dark Lord Sauron is a perilous undertaking. Throughout the story, readers often wonder why the characters didn't simply enlist the aid of the mighty eagles to transport the Ring to Mount Doom and bypass many of the dangers. In this blog post, we will explore the reasons why the eagles couldn't be the straightforward solution to the quest and delve into the deeper implications of their role in Middle-earth.", new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4152), 30, "paragraph", new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4152) },
                    { 3, 1, "The Eagles' Nature and Loyalties:", new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4154), 40, "header", new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4154) },
                    { 4, 1, "The eagles, led by Gwaihir and their lord Thorondor, are noble creatures with their own motivations and allegiances. They are not mere transportation devices but highly intelligent beings with their own concerns and priorities. Their primary role is to serve as messengers and scouts rather than a means of transportation for the characters' convenience.", new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4155), 60, "paragraph", new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4155) },
                    { 5, 1, "The Corruption of the Ring:", new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4156), 70, "header", new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4156) },
                    { 6, 1, "The One Ring possesses immense power and an inherent corrupting influence. Anyone who bears the Ring is susceptible to its allure and can become corrupted by its malevolent forces. While the eagles are mighty and noble, they too would be vulnerable to the Ring's seduction and potentially fall under its control. The risk of the Ring exerting its power over the eagles could lead to disastrous consequences for Middle-earth.", new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4158), 70, "paragraph", new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4158) }
                });

            migrationBuilder.InsertData(
                table: "Tweets",
                columns: new[] { "TweetId", "BlogId", "CreatedAt", "DisplayOrder", "Signature", "UpdatedAt" },
                values: new object[] { 1, 1, new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4173), 50, "463440424141459456", new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4173) });

            migrationBuilder.CreateIndex(
                name: "IX_Blogs_AdminId",
                table: "Blogs",
                column: "AdminId");

            migrationBuilder.CreateIndex(
                name: "IX_Images_BlogId",
                table: "Images",
                column: "BlogId");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_AdminId",
                table: "RefreshTokens",
                column: "AdminId");

            migrationBuilder.CreateIndex(
                name: "IX_TextBlocks_BlogId",
                table: "TextBlocks",
                column: "BlogId");

            migrationBuilder.CreateIndex(
                name: "IX_Tweets_BlogId",
                table: "Tweets",
                column: "BlogId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Images");

            migrationBuilder.DropTable(
                name: "RefreshTokens");

            migrationBuilder.DropTable(
                name: "TextBlocks");

            migrationBuilder.DropTable(
                name: "Tweets");

            migrationBuilder.DropTable(
                name: "Blogs");

            migrationBuilder.DropTable(
                name: "Admins");
        }
    }
}
