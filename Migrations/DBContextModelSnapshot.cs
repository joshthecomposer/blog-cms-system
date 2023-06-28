﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MyApp.Data;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MyApp.Migrations
{
    [DbContext(typeof(DBContext))]
    partial class DBContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("MyApp.Models.Auth.Admin", b =>
                {
                    b.Property<int>("AdminId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("AdminId"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("AdminId");

                    b.ToTable("Admins");

                    b.HasData(
                        new
                        {
                            AdminId = 1,
                            CreatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 862, DateTimeKind.Utc).AddTicks(880),
                            Email = "bugs@acme.com",
                            Name = "Bugs Bunny",
                            Password = "AQAAAAIAAYagAAAAEEtK4Q9KRWNOMTrAgD/U4uPtmF1T0/ZUqHE1EWrvcgm0nPuONySqcU+fCna1hXsCjg==",
                            UpdatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 862, DateTimeKind.Utc).AddTicks(884)
                        });
                });

            modelBuilder.Entity("MyApp.Models.Auth.RefreshToken", b =>
                {
                    b.Property<int>("RefreshTokenId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("RefreshTokenId"));

                    b.Property<int>("AdminId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("ExpiryDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Value")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("RefreshTokenId");

                    b.HasIndex("AdminId");

                    b.ToTable("RefreshTokens");
                });

            modelBuilder.Entity("MyApp.Models.Content.Blog", b =>
                {
                    b.Property<int>("BlogId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("BlogId"));

                    b.Property<int>("AdminId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("Released")
                        .HasColumnType("boolean");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("BlogId");

                    b.HasIndex("AdminId");

                    b.ToTable("Blogs");

                    b.HasData(
                        new
                        {
                            BlogId = 1,
                            AdminId = 1,
                            CreatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4067),
                            Released = false,
                            Title = "The Eagles' Role in Middle-earth: Why the Ring Couldn't Be Taken to Mordor",
                            UpdatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4070)
                        },
                        new
                        {
                            BlogId = 2,
                            AdminId = 1,
                            CreatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4076),
                            Released = false,
                            Title = "The Hobbits Are Eating",
                            UpdatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4077)
                        },
                        new
                        {
                            BlogId = 3,
                            AdminId = 1,
                            CreatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4078),
                            Released = false,
                            Title = "Gandalf does Gandalf Things",
                            UpdatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4079)
                        },
                        new
                        {
                            BlogId = 4,
                            AdminId = 1,
                            CreatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4080),
                            Released = false,
                            Title = "Some other blog",
                            UpdatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4080)
                        },
                        new
                        {
                            BlogId = 5,
                            AdminId = 1,
                            CreatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4081),
                            Released = false,
                            Title = "Bloggy bloggy blog",
                            UpdatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4081)
                        });
                });

            modelBuilder.Entity("MyApp.Models.Content.Image", b =>
                {
                    b.Property<int>("ImageId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ImageId"));

                    b.Property<int>("BlogId")
                        .HasColumnType("integer");

                    b.Property<string>("Caption")
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("DisplayOrder")
                        .HasColumnType("integer");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Url")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("ImageId");

                    b.HasIndex("BlogId");

                    b.ToTable("Images");

                    b.HasData(
                        new
                        {
                            ImageId = 1,
                            BlogId = 1,
                            CreatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4126),
                            DisplayOrder = 10,
                            UpdatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4126),
                            Url = "https://www.eagles.org/wp-content/uploads/2020/07/MG_7021-176-scaled.jpg"
                        });
                });

            modelBuilder.Entity("MyApp.Models.Content.TextBlock", b =>
                {
                    b.Property<int>("TextBlockId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("TextBlockId"));

                    b.Property<int>("BlogId")
                        .HasColumnType("integer");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("DisplayOrder")
                        .HasColumnType("integer");

                    b.Property<string>("TextType")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("TextBlockId");

                    b.HasIndex("BlogId");

                    b.ToTable("TextBlocks");

                    b.HasData(
                        new
                        {
                            TextBlockId = 1,
                            BlogId = 1,
                            Content = "Introduction",
                            CreatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4148),
                            DisplayOrder = 20,
                            TextType = "header",
                            UpdatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4149)
                        },
                        new
                        {
                            TextBlockId = 2,
                            BlogId = 1,
                            Content = "In J.R.R. Tolkien's epic fantasy masterpiece, \"The Lord of the Rings,\" the journey to destroy the One Ring and defeat the Dark Lord Sauron is a perilous undertaking. Throughout the story, readers often wonder why the characters didn't simply enlist the aid of the mighty eagles to transport the Ring to Mount Doom and bypass many of the dangers. In this blog post, we will explore the reasons why the eagles couldn't be the straightforward solution to the quest and delve into the deeper implications of their role in Middle-earth.",
                            CreatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4152),
                            DisplayOrder = 30,
                            TextType = "paragraph",
                            UpdatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4152)
                        },
                        new
                        {
                            TextBlockId = 3,
                            BlogId = 1,
                            Content = "The Eagles' Nature and Loyalties:",
                            CreatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4154),
                            DisplayOrder = 40,
                            TextType = "header",
                            UpdatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4154)
                        },
                        new
                        {
                            TextBlockId = 4,
                            BlogId = 1,
                            Content = "The eagles, led by Gwaihir and their lord Thorondor, are noble creatures with their own motivations and allegiances. They are not mere transportation devices but highly intelligent beings with their own concerns and priorities. Their primary role is to serve as messengers and scouts rather than a means of transportation for the characters' convenience.",
                            CreatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4155),
                            DisplayOrder = 60,
                            TextType = "paragraph",
                            UpdatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4155)
                        },
                        new
                        {
                            TextBlockId = 5,
                            BlogId = 1,
                            Content = "The Corruption of the Ring:",
                            CreatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4156),
                            DisplayOrder = 70,
                            TextType = "header",
                            UpdatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4156)
                        },
                        new
                        {
                            TextBlockId = 6,
                            BlogId = 1,
                            Content = "The One Ring possesses immense power and an inherent corrupting influence. Anyone who bears the Ring is susceptible to its allure and can become corrupted by its malevolent forces. While the eagles are mighty and noble, they too would be vulnerable to the Ring's seduction and potentially fall under its control. The risk of the Ring exerting its power over the eagles could lead to disastrous consequences for Middle-earth.",
                            CreatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4158),
                            DisplayOrder = 70,
                            TextType = "paragraph",
                            UpdatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4158)
                        });
                });

            modelBuilder.Entity("MyApp.Models.Content.Tweet", b =>
                {
                    b.Property<int>("TweetId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("TweetId"));

                    b.Property<int>("BlogId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("DisplayOrder")
                        .HasColumnType("integer");

                    b.Property<string>("Signature")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("TweetId");

                    b.HasIndex("BlogId");

                    b.ToTable("Tweets");

                    b.HasData(
                        new
                        {
                            TweetId = 1,
                            BlogId = 1,
                            CreatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4173),
                            DisplayOrder = 50,
                            Signature = "463440424141459456",
                            UpdatedAt = new DateTime(2023, 6, 28, 21, 31, 39, 933, DateTimeKind.Utc).AddTicks(4173)
                        });
                });

            modelBuilder.Entity("MyApp.Models.Auth.RefreshToken", b =>
                {
                    b.HasOne("MyApp.Models.Auth.Admin", "Admin")
                        .WithMany("RefreshTokens")
                        .HasForeignKey("AdminId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Admin");
                });

            modelBuilder.Entity("MyApp.Models.Content.Blog", b =>
                {
                    b.HasOne("MyApp.Models.Auth.Admin", null)
                        .WithMany("Blogs")
                        .HasForeignKey("AdminId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("MyApp.Models.Content.Image", b =>
                {
                    b.HasOne("MyApp.Models.Content.Blog", "Blog")
                        .WithMany("Images")
                        .HasForeignKey("BlogId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Blog");
                });

            modelBuilder.Entity("MyApp.Models.Content.TextBlock", b =>
                {
                    b.HasOne("MyApp.Models.Content.Blog", "Blog")
                        .WithMany("TextBlocks")
                        .HasForeignKey("BlogId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Blog");
                });

            modelBuilder.Entity("MyApp.Models.Content.Tweet", b =>
                {
                    b.HasOne("MyApp.Models.Content.Blog", "Blog")
                        .WithMany("Tweets")
                        .HasForeignKey("BlogId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Blog");
                });

            modelBuilder.Entity("MyApp.Models.Auth.Admin", b =>
                {
                    b.Navigation("Blogs");

                    b.Navigation("RefreshTokens");
                });

            modelBuilder.Entity("MyApp.Models.Content.Blog", b =>
                {
                    b.Navigation("Images");

                    b.Navigation("TextBlocks");

                    b.Navigation("Tweets");
                });
#pragma warning restore 612, 618
        }
    }
}
