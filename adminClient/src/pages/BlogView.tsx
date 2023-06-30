import { Displayable } from "../types/Types";
import AutoGrowingTextarea from "../components/AutoGrowingTextarea";
import BlogEditorTool from "../components/BlogEditorTool";
import useLocalStorage from "../hooks/useLocalStorage";


const BlogView = () => {

  const [currentBlog, setCurrentBlog] = useLocalStorage("currentBlog", {});

  return (
    <>
      <BlogEditorTool />

      <div className="self-center items-center flex flex-col m-auto py-10 w-full md:px-0 md:w-2/3 2xl:w-1/3 relative z-[1]">
        <h1 className="text-3xl text-center sm:text-4xl 2xl:text-5xl font-bel w-full">
          {currentBlog.title}
        </h1>
        <hr className="my-10 w-full self-center" />
        <div className="flex flex-col gap-5 relative">
          {currentBlog.displayables &&
            currentBlog.displayables.length > 0 &&
            currentBlog.displayables.map((d: Displayable, i: number) => {
              switch (d.dataType) {
                case "TextBlock":
                  switch (d.textType) {
                    case "header":
                      return (
                        <div key={i}>
                          <AutoGrowingTextarea
                            value={d.content}
                            textType={"header"}
                            displayableId={d.displayableId}
                            setCurrentBlog={setCurrentBlog}
                            currentBlog={currentBlog}
                          />
                        </div>
                      );
                    case "paragraph":
                      return (
                        <div key={i}>
                          <AutoGrowingTextarea
                            value={d.content}
                            textType={"paragraph"}
                            displayableId={d.displayableId}
                            setCurrentBlog={setCurrentBlog}
                            currentBlog={currentBlog}
                          />
                        </div>
                      );
                    case "quote":
                      return null;
                    default:
                      return null;
                  }
                case "Image":
                  return (
                    <img
                      key={i}
                      className="w-full self-center relative"
                      src={d.url}
                      alt=""
                    />
                  );
                default:
                  return null;
                case "Tweet":
                  return d.signature ? (
                    <div key={i} className="w-full">
                      {
                        //TODO: Create a twitter embed component.
                      }
                    </div>
                  ) : null;
              }
            })}
        </div>
      </div>
    </>
  );
};

export default BlogView;
