import axios from "axios";
import {Blog, Displayable, TextBlock } from "../types/Types";

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



export const adminLoginRequest = async (loginUser: LoginUser) => {
  return apiClient
    .post("/admin/login", loginUser)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data.errors;
    });
};

export const initializeNewBlog = async (initBlog: InitBlog) => {
  const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`
  },
};
  console.log(config)
  return apiClient
    .post("/blog", initBlog, config)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data.errors;
    });
};

export const tryCreateTextBlock = async (textBlock: TextBlock) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    },
  };
  return apiClient
    .post(`/content/text`, textBlock, config)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data.errors;
    });
}

export const deleteTextBlock = async (textBlock: Displayable) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    },
  };
  return apiClient
    .delete(`/content/text`, {...config, data: textBlock})
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data.errors;
    });
};

export const tryUpdateTextBlock = async (textBlock: Displayable) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    },
  };
  return apiClient
    .put(`/content/text`, textBlock, config)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.status;
    })
}

export const tryUpdateBlog = async (blog: Blog) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    },
  };
  return apiClient
    .put(`/blog`, blog, config)
    .then((res) => res.data)
    .catch((err) => {throw err.response.status})
}

export const tryUpdateDraggedDtoOrder = async (displayable: Displayable) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    },
  };
  return apiClient
    .put(`/content/reorder`, displayable, config)
    .then((res) => res.data)
    .catch((err)=>{throw err.response.status})
}
