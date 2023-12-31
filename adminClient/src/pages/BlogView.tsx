import { Blog, Displayable } from "../types/Types";
import AutoGrowingTextarea from "../components/AutoGrowingTextarea";
import BlogEditorTool from "../components/BlogEditorTool";
import useLocalStorage from "../hooks/useLocalStorage";
import { useEffect } from "react";
import {
  tryDeleteImage,
  tryRefresh,
  tryUpdateDraggedDtoOrder,
} from "../utils/apiRequests";
// import { TwitterTweetEmbed } from "react-twitter-embed";

const BlogView = () => {
  const [currentBlog, setCurrentBlog] = useLocalStorage("currentBlog", {});
  useEffect(() => {}, [currentBlog]);
  const [credentials, setCredentials] = useLocalStorage("credentials", {});

  const [blogs, setBlogs] = useLocalStorage("blogs", {});

  const onDragOver = (event: any) => {
    event.preventDefault();
  };

  const onDragStart = (event: any, index: any) => {
    event.dataTransfer.setData("itemIndex", index);
  };

  const onDrop = async (event: any, index: any) => {
    let prevBlog = JSON.parse(JSON.stringify(currentBlog));
    let draggedFromIndex = event.dataTransfer.getData("itemIndex");
    let tempList = [...currentBlog.displayables];
    let draggedItem = tempList[draggedFromIndex];

    tempList.splice(draggedFromIndex, 1);
    tempList.splice(index, 0, draggedItem);
    if (index === 0) {
      draggedItem.displayOrder = 1;
    } else {
      draggedItem.displayOrder = tempList[index - 1].displayOrder + 1;
    }
    try {
      const response = await tryUpdateDraggedDtoOrder(
        draggedItem,
        credentials.jwt
      );
      setCurrentBlog({ ...response });
    } catch (error) {
      try {
        const response = await tryRefresh({
          accessToken: credentials.jwt,
          refreshToken: credentials.rft,
        });
        const newCredentials = {
          ...credentials,
          jwt: response.accessToken,
          rft: response.refreshToken,
        };
        try {
          const response = await tryUpdateDraggedDtoOrder(
            draggedItem,
            newCredentials.jwt
          );
          setCurrentBlog({ ...response });
          setCredentials({ ...newCredentials });
        } catch (err) {
          console.log(err);
          setCurrentBlog({ ...prevBlog });
          console.log(error);
        }
      } catch (error) {
        console.log(error);
        console.log("ERROR REFRESHING");
      }
    }
  };

  const handleDeleteImage = async (displayable: Displayable) => {
    try {
      const res = await tryDeleteImage(displayable, credentials.jwt);
      console.log(res)
      const updated = res;
      setCurrentBlog(updated);
      const disps = [
        ...blogs.filter((b: Blog) => b.blogId !== currentBlog.blogId),
      ];
      setBlogs([...disps, updated]);
    } catch (err) {
      console.log(err);
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
          const res = await tryDeleteImage(displayable, newCredentials.jwt);
          const updated = res;
          setCurrentBlog(updated);
          const disps = [
            ...blogs.filter((b: Blog) => b.blogId !== currentBlog.blogId),
          ];
          setBlogs([...disps, updated]);
        } catch (err) {
          console.log("Refresh succeeded but uncaught error.");
        }
      } catch (err) {
        console.log("Refresh failed.");
      }
    }
  };


  useEffect(() => {}, [currentBlog]);

  return (
    <>
      <BlogEditorTool
        currentBlog={currentBlog}
        setCurrentBlog={setCurrentBlog}
      />


      <div className="self-center items-center flex flex-col m-auto py-10 w-full md:px-0 md:w-2/3 2xl:w-1/3 relative z-[1]">
        <h1 key={currentBlog.blogId} className="text-3xl text-center sm:text-4xl 2xl:text-5xl font-bel w-full">
          {currentBlog.title}
        </h1>
        <hr className="my-10 w-full self-center" />
        <div className="flex flex-col gap-5 relative w-full">
          {currentBlog.displayables &&
            currentBlog.displayables.length > 0 &&
            currentBlog.displayables.map((d: Displayable, index: any) => {
              switch (d.dataType) {
                case "TextBlock" :
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
                    <div
                      key={`${d.displayableId}-${d.dataType}`}
                      className="w-full relative"
                    >
                      <button
                        onClick={() => handleDeleteImage(d)}
                        className="absolute top-2 left-2 text-sm font-normal bg-red-400 bg-opacity-90 rounded px-3 text-red-50 active:bg-red-300 active:bg-opacity-100"
                      >
                        delete
                      </button>
                      <img
                        key={`${d.displayableId}-${d.dataType}`}
                        onDragOver={(event) => onDragOver(event)}
                        onDragStart={(event) => onDragStart(event, index)}
                        onDrop={(event) => onDrop(event, index)}
                        draggable
                        src={d.url}
                        alt=""
                      />
                    </div>
                  );
                case "Tweet":
                  return (
                    //   <div
                    //   key={`${d.displayableId}-${d.dataType}`}
                    //   onDragOver={(event) => onDragOver(event)}
                    //   onDragStart={(event) => onDragStart(event, index)}
                    //   onDrop={(event) => onDrop(event, index)}
                    //     draggable
                    //     className="relative"
                    //   >
                    //     {/* <div className="absolute top-0 left-0 w-2 h-2 bg-red-500">

                    //     </div> */}
                    //     <TwitterTweetEmbed tweetId={d.signature} />
                    // </div>
                    null
                  );
                default:
                  null;
              }
            })}
        </div>
      </div>
    </>
  );
};

export default BlogView;
