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
      <nav className="bg-sky-900 text-sky-100 text-xl gap-10 px-10 py-5 items-center font-oswald lg:flex hidden relative z-10">
        <h2 className="text-5xl bold">
          TolkienWithFriends<span className="text-sm italic">Admin</span>
        </h2>
        {credentials && Object.keys(credentials).length > 0? (
          <div className="flex justify-between w-full">
            <div className="flex gap-4 underline">
              <a href="/">Public Site</a>
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
        ) : null}
      </nav>
    </>
  );
};

export default NavDrawer;
