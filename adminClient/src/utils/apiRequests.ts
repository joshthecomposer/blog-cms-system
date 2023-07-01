import axios from "axios";
import {Displayable, TextBlock } from "../types/Types";

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
    Authorization: `Bearer ${localStorage.getItem("jwt")}`
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
  //TODO: This sends json token, no adminId. Parse the adminID on the token.
  return apiClient
    .post("/blog", initBlog, config)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });
};

export const tryCreateTextBlock = async (textBlock: TextBlock) => {
  return apiClient
    .post(`/content/text`, textBlock)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data.errors;
    });
}

export const deleteTextBlock = async (textBlock: Displayable) => {
  return apiClient
    .delete(`/content/text`, {data: textBlock})
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data.errors;
    });
};

export const tryUpdateBlog = async (textBlock:Displayable) => {
  return apiClient
    .put(`/content/text`, textBlock)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.status;
    })
}
