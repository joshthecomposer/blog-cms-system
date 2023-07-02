export type Blog = {
    blogId: number
    title: string
    adminId: number
    released: boolean
    displayables: Displayable[]
    createdAt: string
    updatedAt: string
}

export type Displayable = {
    displayableId: number
    content?: string
    url?: string
    mediaType?: string
    caption?: string
  textType?: string
    signature?: string

    blogId: number
    displayOrder: number
    dataType:string
}

export type TextBlock = {
    textBlockId?: number;
    content: string;
    displayOrder: number;
    textType: string;

    blogId: number;
}

// export type Media = {
//     mediaId: number;
//     url?: string;
//     type: string;
//     caption?: string;
//     displayOrder: number;

//     blogId: number;
// }

export type BlogContextType = {
  blogs: Blog[];
  setBlogs: React.Dispatch<React.SetStateAction<Blog[]>>;
}

export type BlogReq = {
  adminId: number;
  title: string;
}

export type RefReq = {
  accessToken: string;
  refreshToken: string;
}
