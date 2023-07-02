import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLoginRequest } from "../utils/apiRequests";
import useLocalStorage from "../hooks/useLocalStorage";
// interface LoginFormProps {
//   error: string
//   setError:string
// }

const LoginForm = () => {
  const [errors, setErrors] = useState({
    email: [],
    password: [],
  });
  const navigate = useNavigate();

  const [loginUser, setLoginUser] = useState({
    email: "",
    password: "",
  });
  //@ts-ignore
  const [blogs, setBlogs] = useLocalStorage("blogs", []);
  //@ts-ignore
  const [credentials, setCredentials] = useLocalStorage("credentials", {});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginUser({ ...loginUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res: any = await adminLoginRequest(loginUser);
      setCredentials({
        jwt: res.accessToken,
        rft: res.refreshToken,
        adminId: res.adminId,
        name: res.name,
        email: res.email
      })
      setBlogs(res.blogs);
      navigate("/admin/blog/dashboard");
    } catch (err: any) {
      console.log(err);
      setErrors({
        email: err.data.errors.Email,
        password: err.data.errors.Password,
      });
    }
  };

  return (
    <div className="flex items-center justify-center fixed inset-0 z-50">
      <div className="bg-blue-950 relative">
        <div className="flex flex-col justify-center items-center login font-oswald gap-4 py-6">
          <div className="fixed top-10 px-2 bg-red-500 rounded-lg text-neutral-100 text-2xl">
            {errors.email
              ? errors.email.map((v, i) => <p key={i}>{v}</p>)
              : null}
            {errors.password
              ? errors.password.map((v, i) => <p key={i}>{v}</p>)
              : null}
          </div>
          <h1 className="font-oswald uppercase text-4xl text-neutral-100  font-semibold uppercase">
            Login
          </h1>
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg bg-opacity-30 px-5 flex flex-col gap-4"
          >
            <div className="flex flex-wrap -mx-3 gap-3">
              <div className="flex flex-col gap-2 w-full px-3">
                <label className="flex gap-3 uppercase tracking-wide text-neutral-100 text-xs font-bold ">
                  Email
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-2 px-4  leading-tight focus:outline-none focus:bg-white"
                  type="text"
                  placeholder="example@email.com"
                  name="email"
                  value={loginUser.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              <div className="flex w-full">
                <div className="flex flex-col gap-2 w-full px-3">
                  <label className="flex gap-3 uppercase tracking-wide text-neutral-100 text-xs font-bold ">
                    Password
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-2 px-4  leading-tight focus:outline-none focus:bg-white"
                    type="password"
                    placeholder="********"
                    name="password"
                    value={loginUser.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="bg-indigo-700 hover:bg-indigo-500 text-neutral-100 font-bold py-2 px-4 rounded w-full shadow-lg"
            >
              Submit
            </button>
          </form>
          <p className="text-neutral-100 text-sm my-3">
            Wanted to Sign up instead?{" "}
            <span className="underline italic">Go here.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
