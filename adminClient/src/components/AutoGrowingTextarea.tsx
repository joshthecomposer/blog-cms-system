import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Blog } from "../types/Types";
import useLocalStorage from "../hooks/useLocalStorage";

interface TAProps {
  value: string | undefined;
  textType: string | undefined;
  displayableId: number;
  setCurrentBlog: Function;
  currentBlog: Blog;
}

const AutoGrowingTextarea = (props: TAProps) => {
  const { value, textType, displayableId, setCurrentBlog, currentBlog } = props;
  const [text, setText] = useState(value);
  const [textareaHeight, setTextareaHeight] = useState("auto");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [highlighted, setHighlighted] = useState(false);

  const [blogs, setBlogs] = useLocalStorage("blogs", []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      setTextareaHeight(`${textareaRef.current.scrollHeight}px`);
    }
  }, [text]);

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    // const textarea = event.target;
    setText(event.target.value);
  };

  const toggleHighlighted = () => {
    setHighlighted(!highlighted);
  };

  const confirmDelete = () => {
    if (confirm("Are you sure you want to delete this paragraph?")) {
      axios
        .delete("http://localhost:5000/api/content/text/" + displayableId)
        .then(() => {
          const newCurrentBlog = {
            ...currentBlog,
            displayables: [
              ...currentBlog.displayables.filter(
                (d) => (d.dataType === "Image" || d.dataType === "Tweet" || (d.displayableId !== displayableId && d.dataType === "TextBlock") )
              ),
            ],
          };
          setCurrentBlog(newCurrentBlog);
            const updatedBlogList = [
              ...blogs.filter((b: Blog) => b.blogId !== currentBlog.blogId),
              newCurrentBlog,
            ];
            setBlogs(updatedBlogList);
        })
        .catch((err) => console.log(err));
    }
  };

  //TODO:  maybe blog view page should be a seperate query?
  //WE could do a rotating cache on the local storage where at most 2 blogs are stored instead of all of them? Then when the view blog is clicked it is checked against the cached blogs and if none, queried.
  //Localstorage on login will be populatd with just the title and the id etc, just what is needed to get the blog when viewing.
  //TODO: THIS CAN currently only handle text deletion.

  useEffect(() => {
    setText(value);
  }, [value]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        style={{
          height: textareaHeight,
          backgroundColor: highlighted ? "#d4d4d4" : "transparent",
        }}
        className={
          textType == "paragraph"
            ? "text-[20px] w-full rounded relative z-10"
            : "text-3xl font-bold w-full rounded relative z-10"
        }
        value={text}
        onChange={handleTextareaChange}
        data-expandable
      />
      <button
        onMouseOver={toggleHighlighted}
        onMouseLeave={toggleHighlighted}
        onMouseDown={confirmDelete}
        className="bg-red-500 bg-opacity-90 absolute z-20 bottom-2 right-2 md:-right-10 rounded px-3 shadow-lg text-red-100 active:bg-red-600 active:bg-opacity-100"
      >
        Delete
      </button>
    </div>
  );
};

export default AutoGrowingTextarea;
