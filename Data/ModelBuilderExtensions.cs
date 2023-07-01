using Microsoft.EntityFrameworkCore;
using MyApp.Models.Content;
using MyApp.Models.Auth;
using Microsoft.AspNetCore.Identity;
// using Bogus;

namespace MyApp.Data;
public static class ModelBuilderExtensions
{
    public static void Seed(this ModelBuilder modelBuilder)
    {
        // var faker = new Faker("en");

        // Admin[] admins = new Admin[20];

        // for (int i = 0; i < 20; i++)
        // {
        //     admins[i] = new Admin { AdminId = i + 1, Name = faker.Name.FullName(), Email = faker.Internet.Email() };
        // }
        PasswordHasher<Admin> hasher = new PasswordHasher<Admin>();

        Admin admin1 = new Admin { AdminId = 1, Name = "Bugs Bunny", Email = "bugs@acme.com", Password = "99999999" };
        admin1.Password = hasher.HashPassword(admin1, admin1.Password);
        modelBuilder.Entity<Admin>().HasData(admin1);

        var blogs = new List<Blog>
        {
            new Blog { BlogId = 1, Title = "The Eagles' Role in Middle-earth: Why the Ring Couldn't Be Taken to Mordor", AdminId = 1 },
            new Blog { BlogId = 2, Title = "The Hobbits Are Eating", AdminId = 1 },
            new Blog { BlogId = 3, Title = "Gandalf does Gandalf Things", AdminId = 1 },
            new Blog { BlogId = 4, Title = "Some other blog", AdminId = 1 },
            new Blog { BlogId = 5, Title = "Bloggy bloggy blog", AdminId = 1 },
        };

        modelBuilder.Entity<Blog>().HasData(blogs);

        Image md1 = new Image
        {
            ImageId = 1,
            Url = "https://www.eagles.org/wp-content/uploads/2020/07/MG_7021-176-scaled.jpg",
            BlogId = 1,
            DisplayOrder = 10,
        };
        modelBuilder.Entity<Image>().HasData(md1);

		TextBlock[] textBlocks =
        {
            new TextBlock
            {
                TextBlockId = 1,
                Content = "Introduction",
                DisplayOrder = 20,
                TextType = "header",
                BlogId = 1
            },
            new TextBlock
            {
                TextBlockId = 2,
                Content = "In J.R.R. Tolkien's epic fantasy masterpiece, \"The Lord of the Rings,\" the journey to destroy the One Ring and defeat the Dark Lord Sauron is a perilous undertaking. Throughout the story, readers often wonder why the characters didn't simply enlist the aid of the mighty eagles to transport the Ring to Mount Doom and bypass many of the dangers. In this blog post, we will explore the reasons why the eagles couldn't be the straightforward solution to the quest and delve into the deeper implications of their role in Middle-earth.",
                DisplayOrder = 30,
                TextType = "paragraph",
                BlogId = 1
            },
            new TextBlock
            {
                TextBlockId = 3,
                Content = "The Eagles' Nature and Loyalties:",
                DisplayOrder = 40,
                TextType = "header",
                BlogId = 1
            },
            new TextBlock
            {
                TextBlockId = 4,
                Content = "The eagles, led by Gwaihir and their lord Thorondor, are noble creatures with their own motivations and allegiances. They are not mere transportation devices but highly intelligent beings with their own concerns and priorities. Their primary role is to serve as messengers and scouts rather than a means of transportation for the characters' convenience.",
                DisplayOrder = 50,
                TextType = "paragraph",
                BlogId = 1
            },
			new TextBlock
			{
                TextBlockId = 5,
                Content = "The Corruption of the Ring:",
                DisplayOrder = 60,
                TextType = "header",
                BlogId = 1
            },
			new TextBlock
			{
                TextBlockId = 6,
                Content = "The One Ring possesses immense power and an inherent corrupting influence. Anyone who bears the Ring is susceptible to its allure and can become corrupted by its malevolent forces. While the eagles are mighty and noble, they too would be vulnerable to the Ring's seduction and potentially fall under its control. The risk of the Ring exerting its power over the eagles could lead to disastrous consequences for Middle-earth.",
                DisplayOrder = 70,
                TextType = "paragraph",
                BlogId = 1
            },
        };
		modelBuilder.Entity<TextBlock>().HasData(textBlocks);

		Tweet tweet = new Tweet { TweetId = 1, Signature = "463440424141459456", DisplayOrder = 50, BlogId =1 };
		modelBuilder.Entity<Tweet>().HasData(tweet);
	}
}
