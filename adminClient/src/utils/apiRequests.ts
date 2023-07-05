import axios from "axios";
import {Blog, Displayable, RefReq, TextBlock, Tweet } from "../types/Types";

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

const formClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "multipart/form-data"
  },
});



export const adminLoginRequest = async (loginUser: LoginUser) => {
  return apiClient
    .post("/admin/login", loginUser)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response;
    });
};

export const tryRefresh = async (refreshRequest : RefReq) => {
  return apiClient
    .post("/admin/tokens/refresh", refreshRequest)
    .then((res) => res.data)
    .catch((err) => { throw err.response; })
}

export const initializeNewBlog = async (initBlog: InitBlog, jwt:string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${jwt}`
    },
  }
  try {
    const res = await apiClient.post("/blog", initBlog, config)
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.log(err)
    throw err;
  }
};

export const tryCreateTextBlock = async (textBlock: TextBlock, jwt:string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${jwt}`
    },
  };
  return apiClient
    .post(`/content/text`, textBlock, config)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data.errors;
    });
}

export const deleteTextBlock = async (textBlock: Displayable, jwt:string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${jwt}`
    },
  };
  return apiClient
    .delete(`/content/text`, {...config, data: textBlock})
    .then((res) => res.data)
    .catch((err) => {
      throw err.response;
    });
};

export const tryUpdateTextBlock = async (textBlock: Displayable, jwt:string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${jwt}`
    },
  };
  return apiClient
    .put(`/content/text`, textBlock, config)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response;
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
    .catch((err) => {throw err.response})
}

export const tryUpdateDraggedDtoOrder = async (displayable: Displayable, jwt:string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${jwt}`
    },
  };
  return apiClient
    .put(`/content/reorder`, displayable, config)
    .then((res) => res.data)
    .catch((err)=>{throw err.response})
}

export const tryUploadImage = async (formData:FormData, jwt:string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${jwt}`
    },
  };
  return formClient
    .post(`/content/image`, formData, config)
    .then((res) => res.data)
    .catch((err) => { throw err.response });
}

export const tryCreateTweetEmbed = async (newTweet: Tweet, jwt:string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${jwt}`
    },
  };
  return apiClient
    .post(`/content/tweet`, newTweet, config)
    .then((res) => res.data)
    .catch((err) => { throw err.response });
}

//TODO: make admin type
export const adminSignupRequest = async (newAdmin: any) => {
  return apiClient
    .post(`/admin/register`, newAdmin)
    .then((res) => res.data)
    .catch((err)=>{throw err.response})
}

export const tryDeleteBlog = async (blog: Blog, jwt: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${jwt}`
    },
  };
  return apiClient
    .delete(`/blog`, {...config, data:blog})
}


