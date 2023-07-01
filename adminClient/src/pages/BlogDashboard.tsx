import { useState, ChangeEvent, useEffect } from "react";
import { Blog, BlogReq } from "../types/Types";
import { initializeNewBlog } from "../utils/apiRequests";
// import { Link } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import NewBlogForm from "../components/NewBlogForm";

const BlogDashboard = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useLocalStorage("blogs", []);
  //@ts-ignore
  const [currentBlog, setCurrentBlog] = useLocalStorage("currentBlog", {});


  //TODO: make a custom alert box instead
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

  // useEffect(() => {
  //   let sortedBlogs: Blog[] = blogs.sort((a: Blog, b: Blog) =>
  //     a.blogId > b.blogId ? 1 : b.blogId > a.blogId ? -1 : 0
  //   );

  //   setBlogs(sortedBlogs);
  // }, []);

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
