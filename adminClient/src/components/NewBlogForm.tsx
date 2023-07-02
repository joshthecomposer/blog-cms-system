import useLocalStorage from "../hooks/useLocalStorage";
import { initializeNewBlog, tryRefresh } from "../utils/apiRequests";
import { BlogReq, Blog } from "../types/Types";
import { useState , ChangeEvent, useEffect} from 'react'


const NewBlogForm = () => {
  const [blogs, setBlogs] = useLocalStorage("blogs", [])
  const [credentials, setCredentials] = useLocalStorage("credentials", {});
  const [newBlog, setNewBlog] = useState<BlogReq>({
    adminId: 0,
    title: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      console.log(credentials.jwt)
      const res = await initializeNewBlog(newBlog, credentials.jwt);
      console.log(res)
      const updatedBlogs = [...blogs, res];
      setBlogs(updatedBlogs);
      const resetNew = { ...newBlog, title: "" }
      setNewBlog(resetNew);
    } catch (err : any) {
      if (err.response != null && err.response.status == 401) {
        try {
          console.log("attempting refresh..")
          const res = await tryRefresh({ accessToken: credentials.jwt, refreshToken: credentials.rft});
          console.log(res);
          const newCredentials = { ...credentials, jwt: res.accessToken, rft: res.refreshToken }
          try {
            const res = await initializeNewBlog(newBlog, newCredentials.jwt);
            const updatedBlogs = [...blogs, res];
            setBlogs(updatedBlogs);
            const resetNew = { ...newBlog, title: "" };
            setNewBlog({...resetNew});
            setCredentials({...newCredentials});
          } catch (err) {
            console.log(`Error after refresh request: ${err}`);
          }

        } catch (err) {
          console.log(`Error after refresh request: ${err}`)
        }
      }
      console.log(err);
    }
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
    console.log(newBlog);
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
