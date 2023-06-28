import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useBlogs } from "../hooks/useBlogs";
const NavDrawer = () => {
  const { setBlogs } = useBlogs();
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const handleLogout = () => {
    localStorage.clear();
    setBlogs([]);
    setIsLoggedIn(false);
    navigate("/admin");
  };
  return (
    <>
      <nav className="bg-sky-900 text-sky-100 text-xl gap-10 px-10 py-5 items-center font-oswald lg:flex hidden relative z-10">
        <h2 className="text-5xl bold">
          TolkienWithFriends<span className="text-sm italic">Admin</span>
        </h2>
        {isLoggedIn ? (
          <div className="flex justify-between w-full">
            <div className="flex gap-4 underline">
              <a href="/">Public Site</a>
              <Link to="/admin/blog/dashboard">Blog Dashboard</Link>
            </div>
            <div className="flex gap-5">
              <p>Logged in as: {localStorage.getItem("name")}</p>
              <p
                onClick={handleLogout}
                className="hover:cursor-pointer underline"
              >
                Logout
              </p>
            </div>
          </div>
        ) : null}
      </nav>
    </>
  );
};

export default NavDrawer;
