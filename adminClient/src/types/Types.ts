export type Blog = {
  blogId: number;
  title: string;
  adminId: number;
  released: boolean;
  compiledContent?: string;
  displayables: Displayable[];
  createdAt: string;
  updatedAt: string;
};

export type Displayable = {
  displayableId: number;
  content?: string;
  url?: string;
  mediaType?: string;
  caption?: string;
  textType?: string;
  signature?: string;

  blogId: number;
  displayOrder: number;
  dataType: string;
};

export type TextBlock = {
  textBlockId?: number;
  content: string;
  displayOrder: number;
  textType: string;

  blogId: number;
};

export type ImageToSend = {
  file: File | null;
  displayOrder: number;
  caption?: string;

  blogId: number;
};

export type Image = {
  imageId: number;
  displayOrder: number;
  caption?: string;
  url: string;

  blogId: number;
}

export type Tweet = {
  tweetId?: number;
  signature: string;
  displayOrder: number;
  blogId: number;
};

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
};

export type BlogReq = {
  adminId: number;
  title: string;
};

export type RefReq = {
  accessToken: string;
  refreshToken: string;
};
