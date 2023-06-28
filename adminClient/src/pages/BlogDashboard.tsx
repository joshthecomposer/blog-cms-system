import { useBlogs } from "../hooks/useBlogs";
import { useEffect, useState, ChangeEvent } from "react";
import { BlogReq } from "../types/Types";
import { initializeNewBlog } from "../utils/apiRequests";
import { Link } from "react-router-dom";

const BlogDashboard = () => {
  const { blogs, setBlogs } = useBlogs();
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
      localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
      setNewBlog({ ...newBlog, title: "" });
    } catch (err: any) {}
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewBlog({ ...newBlog, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const storedBlogs = localStorage.getItem("blogs");
    if (storedBlogs) {
      setBlogs(JSON.parse(storedBlogs));
    }
    const adminId = localStorage.getItem("adminId");
    if (adminId) {
      setNewBlog({ ...newBlog, adminId: parseInt(adminId) });
    }
  }, [setBlogs]);

  return (
    <>
      <h1 className="text-5xl text-center py-3">Blog Editor</h1>
      <div className="flex flex-col items-center">
        <table className="w-full border-collapse md:w-2/3">
          <tbody>
            {blogs.map((b, i) => (
              <tr key={i}>
                <td className="border-y text-xl p-5 w-full flex justify-between">
                  <p className="w-full">{b.title}</p>
                  <Link to={"/admin/blog/" + b.blogId}>
                    <button className="bg-indigo-500 text-indigo-100 rounded w-[80px]">
                      View
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
            <tr>
              <td className="border-y text-xl p-5 w-full">
                <form
                  className="flex justify-between w-full"
                  onSubmit={handleSubmit}
                >
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
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BlogDashboard;
