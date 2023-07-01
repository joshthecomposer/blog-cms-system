import { Displayable } from "../types/Types";
import AutoGrowingTextarea from "../components/AutoGrowingTextarea";
import BlogEditorTool from "../components/BlogEditorTool";
import useLocalStorage from "../hooks/useLocalStorage";
import { useEffect } from "react";
// import { useState } from "react";

const BlogView = () => {
  const [currentBlog, setCurrentBlog] = useLocalStorage("currentBlog", {});
  useEffect(() => {}, [currentBlog]);

  const onDragOver = (event: any) => {
    event.preventDefault();
  };

  const onDragStart = (event: any, index: any) => {
    event.dataTransfer.setData("itemIndex", index);
  };

  const onDrop = (event: any, index: any) => {
    const draggingIndex = event.dataTransfer.getData("itemIndex");
    const tempList = [...currentBlog.displayables];

    // Swap elements
    let temp = tempList[draggingIndex];
    tempList[draggingIndex] = tempList[index];
    tempList[index] = temp;
    console.log(tempList);
    let order = 0;
    tempList.forEach((d) => {
      d.displayOrder = order + 10;
      order += 10;
    });
    console.log(tempList);
    setCurrentBlog({ ...currentBlog, displayables: [...tempList] });
  };

  useEffect(() => {}, [currentBlog]);

  return (
    <>
      <BlogEditorTool
        currentBlog={currentBlog}
        setCurrentBlog={setCurrentBlog}
      />

      <div className="self-center items-center flex flex-col m-auto py-10 w-full md:px-0 md:w-2/3 2xl:w-1/3 relative z-[1]">
        <h1 className="text-3xl text-center sm:text-4xl 2xl:text-5xl font-bel w-full">
          {currentBlog.title}
        </h1>
        <hr className="my-10 w-full self-center" />
        <div className="flex flex-col gap-5 relative w-full">
          {currentBlog.displayables &&
            currentBlog.displayables.length > 0 &&
            currentBlog.displayables.map((d: Displayable, index: any) => {
              switch (d.dataType) {
                case "TextBlock":
                  return (
                    <div
                      key={`${d.displayableId}-${d.dataType}`}
                      onDragOver={(event) => onDragOver(event)}
                      onDragStart={(event) => onDragStart(event, index)}
                      onDrop={(event) => onDrop(event, index)}
                      draggable
                    >
                      <AutoGrowingTextarea
                        displayable={d}
                        setCurrentBlog={setCurrentBlog}
                        currentBlog={currentBlog}
                        textType={d.textType}
                      />
                    </div>
                  );
                case "Image":
                  return (
                    <img
                      key={`${d.displayableId}-${d.dataType}`}
                      onDragOver={(event) => onDragOver(event)}
                      onDragStart={(event) => onDragStart(event, index)}
                      onDrop={(event) => onDrop(event, index)}
                      draggable
                      src={d.url}
                      className="w-full"
                      alt=""
                    />
                  );
                default:
                  return null;
              }
            })}
        </div>
      </div>
    </>
  );
};

export default BlogView;
