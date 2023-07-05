import { useNavigate, Link } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
const NavDrawer = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    setCredentials({});
    navigate("/admin");
  };
  //@ts-ignore
  const [credentials, setCredentials] = useLocalStorage("credentials", {})
  return (
    <>
      <nav className="bg-blue-950 text-blue-100 relative fixed top-0 right-0 z-40 text-xl gap-10 px-10 py-5 items-center font-oswald flex relative w-full z-10">
        <h2 className="text-5xl bold">
          BlogCMS<span className="text-sm italic">Admin</span>
        </h2>
        {credentials && Object.keys(credentials).length > 0? (
          <div className="flex justify-between w-full">
            <div className="flex gap-4 underline">
              {/* <a href="/">Public Site</a> */}
              <Link to="/admin/blog/dashboard">Blog Dashboard</Link>
            </div>
            <div className="flex gap-5">
              <p>Logged in as: {credentials.name}</p>
              <p
                onClick={handleLogout}
                className="hover:cursor-pointer underline"
              >
                Logout
              </p>
            </div>
          </div>
        ) :
        <div className="flex gap-3">
          <Link className="text-2xl" to="/admin">Login</Link>
          <Link className="text-2xl" to="/admin/signup">Signup</Link>
        </div>
        }
      </nav>
    </>
  );
};

export default NavDrawer;
