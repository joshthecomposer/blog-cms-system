import useLocalStorage from "../hooks/useLocalStorage"

const BlogPreview = () => {
  //@ts-ignore
  const [currentBlog, setCurrentBlog] = useLocalStorage("currentBlog", {});

  return (
          <div dangerouslySetInnerHTML={{__html: currentBlog.compiledContent}}></div>
  )
}

export default BlogPreview
