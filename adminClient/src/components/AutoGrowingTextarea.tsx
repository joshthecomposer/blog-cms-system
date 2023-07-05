import { useState, useEffect, useRef } from "react";
import { Blog } from "../types/Types";
import useLocalStorage from "../hooks/useLocalStorage";
import { Displayable } from "../types/Types";
import {
  deleteTextBlock,
  tryRefresh,
  tryUpdateTextBlock,
} from "../utils/apiRequests";

interface TAProps {
  displayable: Displayable;
  setCurrentBlog: Function;
  currentBlog: Blog;
  textType: string | undefined;
}

const AutoGrowingTextarea = (props: TAProps) => {
  const { displayable, setCurrentBlog, currentBlog, textType } = props;
  const [text, setText] = useState("");
  const [textareaHeight, setTextareaHeight] = useState("auto");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [highlighted, setHighlighted] = useState(false);

  const [blogs, setBlogs] = useLocalStorage("blogs", []);
  const [credentials, setCredentials] = useLocalStorage("credentials", {});

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

  const handleTextFocus = () => {
    setSaveButtonShowing(true);
  };

  const handleTextBlur = async () => {
    if (!saveIsClicked || !deleteIsClicked) {
      let disps: Displayable[] = currentBlog.displayables.filter(
        (d: Displayable) =>
          d.displayableId !== displayable.displayableId &&
          d.dataType === "TextBlock"
      );
      let otherMedia: Displayable[] = currentBlog.displayables.filter(
        (d: Displayable) => d.dataType !== displayable.dataType
      );
      let one: Displayable | undefined = currentBlog.displayables.find(
        (d: Displayable) =>
          d.displayableId === displayable.displayableId &&
          d.dataType == "TextBlock"
      );
      if (one) {
        one.content = text;
        let concatted = [...disps, one, ...otherMedia].sort(
          (a: Displayable, b: Displayable) =>
            a.displayOrder > b.displayOrder
              ? 1
              : b.displayOrder > a.displayOrder
              ? -1
              : 0
        );
        setCurrentBlog({ ...currentBlog, displayables: concatted });
      }
    }
    return setSaveButtonShowing(false);
  };

  const confirmDelete = async () => {
    try {
      const response = await deleteTextBlock(displayable, credentials.jwt);
      const updated = response;
      setCurrentBlog(updated);
      const disps = [
        ...blogs.filter((b: Blog) => b.blogId !== currentBlog.blogId),
      ];
      setBlogs([...disps, updated]);
      return setDeleteIsClicked(false);
    } catch (error) {
      try {
        const res = await tryRefresh({
          accessToken: credentials.jwt,
          refreshToken: credentials.rft,
        });
        const newCredentials = {
          ...credentials,
          jwt: res.accessToken,
          rft: res.refreshToken,
        };
        try {
          const response = await deleteTextBlock(displayable, newCredentials.jwt);
      const updated = response;
      setCurrentBlog(updated);
      const disps = [
        ...blogs.filter((b: Blog) => b.blogId !== currentBlog.blogId),
      ];
          setBlogs([...disps, updated]);
          setCredentials(newCredentials);
      return setDeleteIsClicked(false);
        } catch {
          console.log("Unknown error after refresh");
        }
      } catch (error) {
        console.log("error refreshing.")
      }
      console.log(error);
    }
  };

  const updateBlog = async () => {
    try {
      const incoming = displayable;
      const response = await tryUpdateTextBlock(incoming, credentials.jwt);
      const updated = response;
      setCurrentBlog(updated);
      const newText = updated.displayables.find(
        (c: Displayable) =>
          c.dataType === incoming.dataType &&
          c.displayableId === incoming.displayableId
      ).content;
      //@ts-ignore
      setText(newText);
      const filteredBlogs = [
        ...blogs.filter((b: Blog) => b.blogId !== currentBlog.blogId),
      ];
      setBlogs([...filteredBlogs, updated]);
    } catch (error) {
      try {
        const res = await tryRefresh({
          accessToken: credentials.jwt,
          refreshToken: credentials.rft,
        });
        const newCredentials = {
          ...credentials,
          jwt: res.accessToken,
          rft: res.refreshToken,
        };
        try {
          const incoming = displayable;
          const response = await tryUpdateTextBlock(incoming, newCredentials.jwt);
          const updated = response;
          setCurrentBlog(updated);
          const newText = updated.displayables.find(
            (c: Displayable) =>
              c.dataType === incoming.dataType &&
              c.displayableId === incoming.displayableId
          ).content;
          //@ts-ignore
          setText(newText);
          const filteredBlogs = [
            ...blogs.filter((b: Blog) => b.blogId !== currentBlog.blogId),
          ];
          setBlogs([...filteredBlogs, updated]);
          setCredentials(newCredentials);
        } catch {
          console.log("Unknown error after refresh");
        }
      } catch (error) {
        console.log("error trying to do refresh.");
      }
      console.log(error);
    }
  };

  const [saveButtonShowing, setSaveButtonShowing] = useState(false);
  //@ts-ignore
  const [saveIsClicked, setSaveIsClicked] = useState(false);
  //@ts-ignore
  const [deleteIsClicked, setDeleteIsClicked] = useState(false);

  const handleSaveClicked = () => {
    handleTextBlur();
    updateBlog();
  };
  const handleDeleteClicked = () => {
    handleTextBlur();
    confirmDelete();
  };

  useEffect(() => {
    //@ts-ignore
    setText(displayable.content);
  }, [displayable.content, currentBlog, setText]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        style={{
          height: textareaHeight,
          backgroundColor: highlighted ? "#d4d4d4" : "transparent",
        }}
        value={text}
        onChange={handleTextareaChange}
        onFocus={handleTextFocus}
        onBlur={handleTextBlur}
        data-expandable
        onMouseOver={() => setHighlighted(true)}
        onMouseLeave={() => setHighlighted(false)}
        className={
          textType == "paragraph"
            ? "text-[20px] w-full rounded relative z-10 w-full hover:cursor-pointer"
            : "text-2xl font-bold hover:cursor-pointer w-full"
        }
      />{" "}
      <button
        onMouseDown={handleSaveClicked}
        className="text-sm font-normal bg-green-400 bg-opacity-90 px-3 text-green-100 active:bg-green-300 active:bg-opacity-100"
        style={{ display: saveButtonShowing ? "inline" : "none" }}
      >
        Save
      </button>
      <button
        onMouseDown={handleDeleteClicked}
        className="text-sm font-normal bg-red-400 bg-opacity-90 rounded px-3 text-red-100 active:bg-red-300 active:bg-opacity-100"
        style={{ display: saveButtonShowing ? "inline" : "none" }}
      >
        Delete
      </button>
    </div>
  );
};

export default AutoGrowingTextarea;
