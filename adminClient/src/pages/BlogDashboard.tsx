import { Blog } from "../types/Types";
// import { Link } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import NewBlogForm from "../components/NewBlogForm";
import { tryDeleteBlog, tryRefresh } from "../utils/apiRequests";

const BlogDashboard = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useLocalStorage("blogs", []);

  const [currentBlog, setCurrentBlog] = useLocalStorage("currentBlog", {});

  const [credentials, setCredentials] = useLocalStorage("credentials", {});

  const handleCurrentBlog = (blogId: number) => {
    if (parseInt(currentBlog.blogId) === blogId) {
      navigate("/admin/blog/" + blogId);
    } else {
      const newBlog = blogs.find((b: Blog) => b.blogId === blogId);
      if (newBlog) {
        setCurrentBlog(newBlog);
        navigate("/admin/blog/" + newBlog.blogId);
      } else {
        console.error("No blog found with id ", blogId)
      }
    }
  };

  const handleBlogDelete =  async (blog:Blog)  => {
    try {
      const res = await tryDeleteBlog(blog, credentials.jwt)
      const filtered = blogs.filter((b: Blog) => b.blogId !== blog.blogId)
      console.log(res)
      setBlogs( [...filtered] );
    } catch (error) {
      try {
        const res = await tryRefresh({ accessToken: credentials.jwt, refreshToken: credentials.rft });
        const newCredentials = res;
        setCredentials(newCredentials);
        try {
          const res = await tryDeleteBlog(blog, newCredentials.jwt)
          const filtered = blogs.filter((b: Blog) => b.blogId !== blog.blogId)
          console.log(filtered)
          console.log(res);
          setBlogs( [...filtered] );
        } catch (error) {
          console.log("Refresh request worked but uncaught error.")
        }
      } catch (error) {
        console.log("error with refresh request")
      }
    }
  }

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
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleCurrentBlog(b.blogId)}
                      className="bg-indigo-500 text-indigo-50 rounded w-[80px]"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleBlogDelete(b)}
                      className="bg-red-500 text-red-50 rounded w-[80px]"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            <tr>
              <td className="border-y text-xl p-5 w-full">
                  <NewBlogForm />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BlogDashboard;
