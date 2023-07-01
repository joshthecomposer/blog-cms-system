import useLocalStorage from "../hooks/useLocalStorage";
import { initializeNewBlog } from "../utils/apiRequests";
import { BlogReq, Blog } from "../types/Types";
import { useState , ChangeEvent, useEffect} from 'react'


const NewBlogForm = () => {
  const [blogs, setBlogs] = useLocalStorage("blogs", [])
  const [newBlog, setNewBlog] = useState<BlogReq>({
    adminId: 0,
    title: "",
  });


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res: any = await initializeNewBlog(newBlog);
      const updatedBlogs = [...blogs, res];
      setBlogs(updatedBlogs);
      setNewBlog({ ...newBlog, title: "" });
    } catch (err: any) {}
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewBlog({ ...newBlog, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    let id = localStorage.getItem("adminId");
    if (id) {
      setNewBlog({ ...newBlog, adminId: parseInt(id) });
    }
    let sortedBlogs: Blog[] = blogs.sort((a: Blog, b: Blog) =>
    a.blogId > b.blogId ? 1 : b.blogId > a.blogId ? -1 : 0
  );
  setBlogs(sortedBlogs);
  }, [])

  return (
    <form className="flex justify-between w-full" onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={newBlog.title}
        onChange={handleChange}
        placeholder="New blog title..."
        className="text-xl w-full"
      />
      <button className="bg-emerald-500 text-indigo-100 rounded w-[80px]">
        New
      </button>
    </form>
  );
};

export default NewBlogForm;
