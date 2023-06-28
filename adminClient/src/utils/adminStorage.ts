interface Blog{
  "blogId": number
  "title": string
  "adminId": number
  "released": boolean
  "mediaBlogJoins": Array<any>
  "textBlocks": Array<any>
  "createdAt": string
  "updatedAt": string
}

interface AdminWithTokens {
  accessToken: string
  refreshToken: string
  name: string
  adminId: any
  email: string
  blogs: Blog[]
}

//TODO: Change this to use a secure cookie for the JWT and RFT rather than localstorage later.
export const adminStorage = (input: AdminWithTokens) => {
  localStorage.setItem("jwt", input.accessToken);
  localStorage.setItem("rft", input.refreshToken);
  localStorage.setItem("name", input.name);
  localStorage.setItem("adminId", input.adminId);
  localStorage.setItem("email", input.email);
  localStorage.setItem("blogs", JSON.stringify(input.blogs));
}
