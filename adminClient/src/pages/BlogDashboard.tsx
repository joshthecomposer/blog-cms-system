import { useState, ChangeEvent, useEffect } from "react";
import { Blog, BlogReq } from "../types/Types";
import { initializeNewBlog } from "../utils/apiRequests";
// import { Link } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

const BlogDashboard = () => {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useLocalStorage("blogs", []);
  const [currentBlog, setCurrentBlog] = useLocalStorage("currentBlog", {});

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

  const handleCurrentBlog = (blogId: number) => {
    const check = localStorage.getItem("currentBlog");
    if (parseInt(currentBlog.blogId) !== blogId && check) {
      confirm("Are you surrrrrrre?")
    };
    const newBlog = blogs.filter((b: Blog) => b.blogId === blogId)[0];
    setCurrentBlog(newBlog);
    navigate("/admin/blog/" + currentBlog.blogId)
  }

  useEffect(() => {
    let sortedBlogs: Blog[] = blogs.sort((a: Blog, b: Blog) =>
      a.blogId > b.blogId ? 1 : b.blogId > a.blogId ? -1 : 0
    );
    let id = localStorage.getItem("adminId");
    if (id)
    {
      setNewBlog({ ...newBlog, adminId:parseInt(id)})
      }
    console.log(sortedBlogs);
    setBlogs(sortedBlogs);
  }, []);

  return (
    <>
      <h1 className="text-5xl text-center py-3">Blog Editor</h1>
      <div className="flex flex-col items-center">
        <table className="w-full border-collapse md:w-2/3">
          <tbody>
            {blogs.map((b: Blog, i: number) => (
              <tr key={i}>
                <td className="border-y text-xl p-5 w-full flex justify-between">
                  <p className="w-full">{b.title}</p>
                  <div>
                    <button
                      onClick={() => handleCurrentBlog(b.blogId)}
                      className="bg-indigo-500 text-indigo-100 rounded w-[80px]"
                    >
                      View
                    </button>
                  </div>
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
