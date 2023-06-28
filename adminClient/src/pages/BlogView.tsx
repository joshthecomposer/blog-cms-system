import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Blog } from "../types/Types";
import { TwitterTweetEmbed } from "react-twitter-embed";
import AutoGrowingTextarea from "../components/AutoGrowingTextarea";
import BlogEditorTool from "../components/BlogEditorTool";
import useLocalStorage from "../hooks/useLocalStorage";

const BlogView = () => {
  const [currentBlog, setCurrentBlog] = useState<Blog>({
    blogId: 0,
    title: "",
    adminId: 0,
    released: false,
    displayables: [],
    createdAt: "",
    updatedAt: "",
  });

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
  const [blogs, setBlogs] = useLocalStorage("blogs", []);

  const navigate = useNavigate();
  const { blogId } = useParams();

  useEffect(() => {
    if (blogs && blogId) {
      console.log(blogs);
      let oneBlog: Blog = blogs.filter((b: Blog) => b.blogId === parseInt(blogId))[0]
      console.log(oneBlog)
        setCurrentBlog(oneBlog);
    } else {
      navigate("/admin/blog/dashboard");
    }
  }, [setCurrentBlog]);
  //md:w-2/3 2xl:w-1/3
  return (
    <>
      <BlogEditorTool />

    <div className="self-center items-center flex flex-col m-auto py-10 w-full md:px-0 md:w-2/3 2xl:w-1/3 relative z-[1]">
      <h1 className="text-3xl text-center sm:text-4xl 2xl:text-5xl font-bel w-full">
        {currentBlog.title}
      </h1>
      <hr className="my-10 w-full self-center" />
      <div className="flex flex-col gap-5 relative">
        {currentBlog.displayables &&
          currentBlog.displayables.length > 0 &&
          currentBlog.displayables.map((c, i) => {
            switch (c.dataType) {
              case "TextBlock":
                switch (c.textType) {
                  case "header":
                    return (
                      <div key={i}>
                        <AutoGrowingTextarea
                          value={c.content}
                          textType={"header"}
                          displayableId={c.displayableId}
                          setCurrentBlog={setCurrentBlog}
                          currentBlog={currentBlog}
                        />
                      </div>
                    );
                  case "paragraph":
                    return (
                      <div key={i}>
                        <AutoGrowingTextarea
                          value={c.content}
                          textType={"paragraph"}
                          displayableId={c.displayableId}
                          setCurrentBlog={setCurrentBlog}
                          currentBlog={currentBlog}
                        />
                      </div>
                    );
                  case "quote":
                    return null;
                  default:
                    return null;
                }
              case "Image":
                return (
                  <img
                    key={i}
                    className="w-full self-center relative"
                    src={c.url}
                    alt=""
                  />
                );
              default:
                return null;
              case "Tweet":
                return c.signature ? (
                  <div key={i} className="w-full">
                    <TwitterTweetEmbed tweetId={c.signature} />
                  </div>
                ) : null;
            }
          })}
      </div>
      </div>

    </>
  );
};

// return c.textType == "header" ? (
//   <AutoGrowingTextarea value={c.content} textType={"header"} />
// ) : (
//   <AutoGrowingTextarea value={c.content} textType={"paragraph"} />
// );


export default BlogView;
