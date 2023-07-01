import { Routes, Route } from "react-router-dom";
import BlogDashboard from "./pages/BlogDashboard";
import LoginForm from "./pages/LoginForm";
import CatchAll from "./pages/CatchAll";
import { AuthContext } from "./context/AuthContext";
import { useState, useEffect } from "react";
import NavDrawer from "./components/NavDrawer";
// import BlogContext from "./context/BlogContext";
// import { Blog } from "./types/Types";
import BlogView from "./pages/BlogView";
import ReorderableTextareaList from "./pages/ReorderableTextareaList";
// import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("email"));
  }, []);
  return (

        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <NavDrawer />
        <div className="px-5 md:px-0">

          <Routes>
            {isLoggedIn ? (
              <Route
                path="/admin/blog/dashboard"
                element={isLoggedIn ? <BlogDashboard /> : <CatchAll />}
              />
            ) : null}
            <Route path="/admin" element={<LoginForm />} />
            <Route path="/admin/blog/:blogId" element={<BlogView />} />
            <Route path="/drag/" element={<ReorderableTextareaList />} />
            <Route path="/admin/*" element={<CatchAll />} />
          </Routes>
        </div>
        </AuthContext.Provider>

  );
}

export default App;
