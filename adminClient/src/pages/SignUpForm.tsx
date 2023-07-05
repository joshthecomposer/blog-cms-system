import { useState, ChangeEvent, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { adminSignupRequest } from '../utils/apiRequests';
import useLocalStorage from '../hooks/useLocalStorage';

const SignUpForm = () => {
  //@ts-ignore
  const [errors, setErrors] = useState({
    name: [],
    email: [],
    password: [],
    confirm: []
  });
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    confirm: ""
  })
  //@ts-ignore
  const [blogs, setBlogs] = useLocalStorage("blogs", []);
  //@ts-ignore
  const [credentials, setCredentials] = useLocalStorage("credentials", {});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await adminSignupRequest(newUser);
      navigate("/admin");
    } catch (err: any) {
      console.log(err);
      setErrors({
        name: err.data.errors.Name,
        email: err.data.errors.Email,
        password: err.data.errors.Password,
        confirm: err.data.errors.Password,
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center text-center login font-oswald p-2 gap-4 fixed inset-0 z-30">
      <div className="bg-blue-950 relative py-6">
      <div className="absolute top-0 left-50 text-center w-full px-2 bg-red-500 z-50 rounded-lg text-neutral-100 text-base">
            {errors.email
              ? errors.email.map((v, i) => <p key={i}>{v}</p>)
              : null}
            {errors.password
              ? errors.password.map((v, i) => <p key={i}>{v}</p>)
              : null}
          </div>
                <h1 className="font-oswald uppercase text-4xl text-neutral-100  font-semibold uppercase">Register</h1>
                <form onSubmit={handleSubmit} className="w-full max-w-lg bg-opacity-30 rounded shadow-lg px-5 flex flex-col gap-4">
                    <div className="flex flex-wrap -mx-3 gap-3">
                        <div className="flex w-full">
                            <div className="flex flex-col gap-2 w-full px-3 ">
                                <label className="flex block uppercase tracking-wide text-neutral-100 text-xs font-bold  gap-3">
                                    Name
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white"
                                    type="text"
                                    placeholder="Jane Doe"
                                    name="name"
                                    value={newUser.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 w-full px-3">
                            <label className="flex gap-3 uppercase tracking-wide text-neutral-100 text-xs font-bold ">
                                Email
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-2 px-4  leading-tight focus:outline-none focus:bg-white"
                                type="text"
                                placeholder="example@email.com"
                                name="email"
                                value={newUser.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex w-full">
                            <div className="flex flex-col gap-2 w-1/2 px-3">
                                <label className="flex gap-3 uppercase tracking-wide text-neutral-100 text-xs font-bold ">
                                    Password
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-2 px-4  leading-tight focus:outline-none focus:bg-white"
                                    type="password"
                                    placeholder="********"
                                    name="password"
                                    value={newUser.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col gap-2 w-1/2 px-3">
                                <label className="flex gap-3 uppercase tracking-wide text-neutral-100 text-xs font-bold ">
                                    Confirm
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-2 px-4  leading-tight focus:outline-none focus:bg-white"
                                    type="password"
                                    placeholder="********"
                                    name="confirm"
                                    value={newUser.confirm}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="bg-indigo-700 hover:bg-indigo-500 text-neutral-100 font-bold py-2 px-4 rounded w-full shadow-lg">Submit</button>
                </form>
                <p className="text-neutral-100 text-sm my-3">Wanted to Login instead? <Link className="underline italic" to="/admin">Go here.</Link></p>
      </div>
            </div>
  )
}

export default SignUpForm
