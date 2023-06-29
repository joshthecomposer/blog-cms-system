import { useState, useEffect, useRef } from "react";
import { Blog } from "../types/Types";
import useLocalStorage from "../hooks/useLocalStorage";
import { Displayable } from "../types/Types";
import { deleteTextBlock } from "../utils/apiRequests";

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


  //TODO: track whether the user actually started editing the blog or not and don't send alert when changing
  //blogs if not.
  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    // const textarea = event.target;
    setText(event.target.value);
  };

  const handleTextFocus = () => {
    setSaveButton(true);
  };

  const handleTextBlur = () => {
    setSaveButton(false);
    let disps: Displayable[] = currentBlog.displayables.filter(
      (d: Displayable) => d.displayableId !== displayableId
    );
    let one: Displayable = currentBlog.displayables.filter(
      (d: Displayable) => d.displayableId === displayableId
    )[0];
    one.content = text;
    disps = [...disps, one].sort((a: Displayable, b: Displayable) =>
      a.displayOrder > b.displayOrder
        ? 1
        : b.displayOrder > a.displayOrder
        ? -1
        : 0
    );
    setCurrentBlog({ ...currentBlog, displayables: disps });
  };

  const confirmDelete = async () => {
    if (confirm("Are you sure you want to delete this paragraph?")) {
      try {
        const response = await deleteTextBlock(displayableId, currentBlog.blogId);
        console.log(response);
        const blog = response;
        setCurrentBlog(blog);
        setBlogs([...blogs.filter((b : Blog)=>b.blogId !== currentBlog.blogId), blog]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const [saveButton, setSaveButton] = useState(false);

  //TODO:  maybe blog view page should be a seperate query?
  //WE could do a rotating cache on the local storage where at most 2 blogs are stored instead of all of them? Then when the view blog is clicked it is checked against the cached blogs and if none, queried.
  //Localstorage on login will be populatd with just the title and the id etc, just what is needed to get the blog when viewing.

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
        onFocus={handleTextFocus}
        onBlur={handleTextBlur}
        data-expandable
        onMouseOver={() => setHighlighted(true)}
        onMouseLeave={() => setHighlighted(false)}
      />{" "}
      <button
        // onMouseDown={saveChanges}
        className="bg-green-500 bg-opacity-90 absolute z-20 bottom-10 right-2 md:-right-10 rounded px-3 shadow-lg text-green-100 active:bg-red-600 active:bg-opacity-100"
        style={{ display: saveButton ? "inline" : "none" }}
      >
        Save
      </button>
      <button
        onMouseDown={confirmDelete}
        className="bg-red-500 bg-opacity-90 absolute z-20 bottom-2 right-2 md:-right-10 rounded px-3 shadow-lg text-red-100 active:bg-red-600 active:bg-opacity-100"
        style={{ display: saveButton ? "inline" : "none" }}
      >
        Delete
      </button>
    </div>
  );
};

export default AutoGrowingTextarea;
