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
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  },
};

//TODO: Just send the JWT , not the adminID and all that in the body. Just the blog and the JWT. Then if jwt is expired, refresh.

export const adminLoginRequest = async (loginUser: LoginUser) => {
  return apiClient
    .post("/admin/login", loginUser)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data.errors;
    });
};

export const initializeNewBlog = async (initBlog: InitBlog) => {
  const adminId = localStorage.getItem("adminId");
  if (adminId == null) throw Error("Illegal");

  initBlog.adminId = parseInt(adminId);

  return apiClient
    .post("/blog", initBlog, config)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });
};

export const deleteTextBlock = async (textBlockId: number, blogId: number) => {
  return apiClient
    .delete(`/content/text/${textBlockId}/${blogId}`)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data.errors;
    });
};
