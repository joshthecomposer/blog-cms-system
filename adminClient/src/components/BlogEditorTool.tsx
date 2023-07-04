import { BiX, BiEdit } from "react-icons/bi";
import { useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { Blog, TextBlock, Tweet } from "../types/Types";
import { tryCreateTextBlock, tryCreateTweetEmbed, tryRefresh, tryUploadImage } from "../utils/apiRequests";

interface BlogEditorProps {
  currentBlog: Blog;
  setCurrentBlog: Function;
}

const BlogEditorTool = (props: BlogEditorProps) => {
  const { currentBlog, setCurrentBlog } = props;
  const [blogs, setBlogs] = useLocalStorage("blogs", []);
  const [editorShowing, setEditorShowing] = useState<boolean>(false);
  const [credentials, setCredentials] = useLocalStorage("credentials", {})
  const [newTweet, setNewTweet] = useState<Tweet>({
    blogId: currentBlog.blogId,
    signature: "",
    displayOrder: 0,
  })

  const addTextBlock = async (contentType: string) => {
    let newDisplayOrder: number = 1;
    if (currentBlog.displayables.length > 0) {
      newDisplayOrder =
        currentBlog.displayables[currentBlog.displayables.length - 1]
          .displayOrder + 1;
    }
    let newText: TextBlock = {
      content: "...",
      blogId: currentBlog.blogId,
      displayOrder: newDisplayOrder,
      textType: contentType,
    };

    try {
      const res = await tryCreateTextBlock(newText, credentials.jwt);
      const blog = res;
      setCurrentBlog(blog);
      const filtered = blogs.filter(
        (b: Blog) => b.blogId !== currentBlog.blogId
      );
      setBlogs([...filtered, blog]);
    } catch (err) {
      try {
        const res = await tryRefresh({
          accessToken: credentials.jwt,
          refreshToken: credentials.rft,
        });
        const newCredentials = {
          ...credentials,
          jwt: res.accessToken,
          rft: res.refreshToken,
        };
        try {
          const res = await tryCreateTextBlock(newText, newCredentials.jwt);
          const blog = res;
          setCurrentBlog(blog);
          const filtered = blogs.filter(
            (b: Blog) => b.blogId !== currentBlog.blogId
          );
          setBlogs([...filtered, blog]);
          setCredentials({ ...newCredentials });
        } catch (err) {
          console.log("refresh successfull but unknown error.");
        }
      } catch (err) {
        console.log("error refreshing...");
      }
    }
  };

  const handleEmbedTweet = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let newDisplayOrder: number = 1;
    if (currentBlog.displayables.length > 0) {
      newDisplayOrder =
        currentBlog.displayables[currentBlog.displayables.length - 1]
          .displayOrder + 1;
    }
    let payload = { ...newTweet, displayorder: newDisplayOrder };
    try {
      const res = await tryCreateTweetEmbed(payload, credentials.jwt)
      const blog = res;
      const filtered = blogs.filter(
        (b: Blog) => b.blogId !== currentBlog.blogId
      );
      setBlogs([...filtered, blog]);
      setCurrentBlog(blog);

    } catch (err) {
      try {
        const res = await tryRefresh({
          accessToken: credentials.jwt,
          refreshToken: credentials.rft,
        });
        const newCredentials = {
          ...credentials,
          jwt: res.accessToken,
          rft: res.refreshToken,
        };
        try {
          const res = await tryCreateTweetEmbed(payload, newCredentials.jwt)
          const blog = res;
          const filtered = blogs.filter(
            (b: Blog) => b.blogId !== currentBlog.blogId
          );
          setBlogs([...filtered, blog]);
          setCurrentBlog(blog);
          setCredentials({ ...newCredentials });
        } catch (err) {
          console.log("refresh successfull but unknown error.");
        }
      } catch (err) {
        console.log("error refreshing...");
      }

    }
  }
  const handleImageUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let newDisplayOrder: number = 1;
    if (currentBlog.displayables.length > 0) {
      newDisplayOrder =
        currentBlog.displayables[currentBlog.displayables.length - 1]
          .displayOrder + 1;
    }
    const input = event.currentTarget.elements.namedItem('input-file-id') as HTMLInputElement

    const file = input.files?.[0]

    if (!file) {
      console.error("no file selected")
      return
    }

    const formData = new FormData();

    formData.append('file', file, file.name)
    formData.append('blogId', currentBlog.blogId.toString())
    formData.append('displayOrder', newDisplayOrder.toString());

    try {
      const res = await tryUploadImage(formData, credentials.jwt);
      const updatedBlog = res;
      setCurrentBlog(updatedBlog);
      const filtered = blogs.filter(
        (b: Blog) => b.blogId !== currentBlog.blogId
      );
      setBlogs([...filtered, updatedBlog]);
    } catch (error) {
      console.log(error)
    }

  }

  const handleTweetChange = (e: any) => {
    setNewTweet({ ...newTweet, signature: e.target.value });
  }

  const toggleEditor = () => {
    return setEditorShowing(!editorShowing);
  };

  useEffect(() => {}, [currentBlog]);

  return (
    <div className="fixed right-0 top-50 z-[999] bg-white">
      {editorShowing ? (
        <button className="absolute right-2 top-2 w-[50px] h-[50px]">
          <BiX className="w-full h-full" onClick={toggleEditor} />
        </button>
      ) : (
        <button className="absolute right-2 top-2 w-[50px] h-[50px]">
          <BiEdit
            className="w-full h-full bg-white bg-opacity-80  rounded"
            onClick={toggleEditor}
          />
        </button>
      )}
      <div
        style={{ display: editorShowing ? "flex" : "none" }}
        className=" flex flex-col rounded shadow-lg py-5 px-10 gap-5"
      >
        <h3 className="text-3xl text-neutral-700">Add Content</h3>
        <hr />
        <h3
          onClick={() => addTextBlock("header")}
          className="text-3xl font-bold w-full border-[1px] rounded hover:bg-neutral-100 hover:cursor-pointer"
        >
          &lt;h3&gt;Header&lt;/h3&gt;
        </h3>
        <p
          onClick={() => addTextBlock("paragraph")}
          className="text-[20px] w-full border-[1px] rounded hover:bg-neutral-100 hover:cursor-pointer"
        >
          &lt;p&gt;Paragraph&lt;/p&gt;
        </p>
        <form onSubmit={handleEmbedTweet} className="border-[1px] rounded shadow-sm py-3 px-2">
          <div className="flex flex-col gap-2">
            <label>Embed a tweet:</label>
            <input
              className="border-[1px] rounded"
              type="text"
              placeholder="past tweet id..."
              value={newTweet.signature}
              onChange={handleTweetChange}
            />
            <button className="bg-indigo-500 rounded text-indigo-100">
              Embed
            </button>
          </div>
        </form>
        <form
          className="border-[1px] rounded shadow-sm py-3 px-2"
          encType="multipart/form-data"
          onSubmit={handleImageUpload}
        >
          <div className="flex flex-col gap-2">
            <label>Upload an Image:</label>
            <input
              id="input-file-id"
              className="border-[1px] rounded"
              type="file"
              placeholder="past tweet id..."
            />
            <button className="bg-emerald-500 rounded text-indigo-100">
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogEditorTool;
