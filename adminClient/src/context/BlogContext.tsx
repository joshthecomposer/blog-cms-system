import React from "react";
import { BlogContextType } from "../types/Types";

const BlogContext = React.createContext<BlogContextType | undefined>(undefined);

export default BlogContext;
