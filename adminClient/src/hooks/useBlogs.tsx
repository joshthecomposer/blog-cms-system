import { useContext } from 'react';
import BlogContext from '../context/BlogContext';


export function useBlogs() {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('BlogContext must be used within a BlogContext.Provider');
  }
  return context;
}
