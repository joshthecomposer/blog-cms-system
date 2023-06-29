import { Blog } from "../types/Types";

interface AdminWithTokens {
  accessToken: string;
  refreshToken: string;
  name: string;
  adminId: any;
  email: string;
  blogs: Blog[];
}

//TODO: Change this to use a secure cookie for the JWT and RFT rather than localstorage later.
export const handleLogin = (input: AdminWithTokens) => {

  localStorage.setItem("jwt", input.accessToken);
  localStorage.setItem("rft", input.refreshToken);
  localStorage.setItem("name", input.name);
  localStorage.setItem("email", input.email);
  localStorage.setItem("adminId", input.adminId);
};
