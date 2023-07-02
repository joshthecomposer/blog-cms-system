import { Routes, Route } from "react-router-dom";
import BlogDashboard from "./pages/BlogDashboard";
import LoginForm from "./pages/LoginForm";
import CatchAll from "./pages/CatchAll";
import NavDrawer from "./components/NavDrawer";
// import BlogContext from "./context/BlogContext";
// import { Blog } from "./types/Types";
import BlogView from "./pages/BlogView";
import ReorderableTextareaList from "./pages/ReorderableTextareaList";
import useLocalStorage from "./hooks/useLocalStorage";
// import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  //@ts-ignore
  const [credentials, setCredentials] = useLocalStorage("credentials", {});
  return (
        <>
        <NavDrawer />
        <div className="px-5 md:px-0">

          <Routes>
            {credentials && Object.keys(credentials).length > 0 ? (
              <Route
                path="/admin/blog/dashboard"
                element={<BlogDashboard />}
              />
            ) : null}
            <Route path="/admin" element={<LoginForm />} />
            <Route path="/admin/blog/:blogId" element={<BlogView />} />
            <Route path="/drag/" element={<ReorderableTextareaList />} />
            <Route path="/admin/*" element={<CatchAll />} />
          </Routes>
        </div>
        </>

  );
}

export default App;
