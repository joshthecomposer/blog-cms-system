import axios from "axios";

interface LoginUser {
  email: string;
  password: string;
}

interface InitBlog {
  adminId: number;
  title: string;
}
// interface NewUser {
//   firstName: string
//   lastName: string
//   email: string
//   password:string
// }

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const adminLoginRequest = async (loginUser: LoginUser) => {
  return apiClient
    .post("/admin/login", loginUser)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data.errors;
    });
};

export const initializeNewBlog = async (initBlog: InitBlog) => {
  return apiClient
    .post("/blog", initBlog)
    .then((res) => res.data)
    .catch((err) => {
      throw err.rsponse.data.errors;
    });
};
