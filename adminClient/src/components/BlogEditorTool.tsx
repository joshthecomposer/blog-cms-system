import { BiX, BiEdit } from "react-icons/bi";
import { useState } from "react";
const BlogEditorTool = () => {
  const [editorShowing, setEditorShowing] = useState<boolean>(false);

  const toggleEditor = () => {
    return setEditorShowing(!editorShowing);
  };
  return (
    <div className="fixed right-0 top-50 z-[999] bg-white">
      {editorShowing ? (
        <button className="absolute right-2 top-2 w-[50px] h-[50px]">
          <BiX className="w-full h-full" onClick={toggleEditor} />
        </button>
      ) : (
        <button className="absolute right-2 top-2 w-[50px] h-[50px]">
          <BiEdit className="w-full h-full bg-white bg-opacity-80  rounded" onClick={toggleEditor} />
        </button>
      )}
      <div
        style={{ display: editorShowing ? "flex" : "none" }}
        className=" flex flex-col rounded shadow-lg py-5 px-10 gap-5"
      >
        <h3 className="text-3xl text-neutral-700">Add Content</h3>
        <hr />
        <h3 className="text-3xl font-bold w-full border-[1px] rounded hover:bg-neutral-100 hover:cursor-pointer">
          &lt;h3&gt;Header&lt;/h3&gt;
        </h3>
        <p className="text-[20px] w-full border-[1px] rounded hover:bg-neutral-100 hover:cursor-pointer">
          &lt;p&gt;Paragraph&lt;/p&gt;
        </p>
        <form className="border-[1px] rounded shadow-sm py-3 px-2">
          <div className="flex flex-col gap-2">
            <label>Embed a tweet:</label>
            <input
              className="border-[1px] rounded"
              type="text"
              placeholder="past tweet id..."
            />
            <button className="bg-indigo-500 rounded text-indigo-100">
              Embed
            </button>
          </div>
        </form>
        <form
          className="border-[1px] rounded shadow-sm py-3 px-2"
          encType="multipart/form-data"
        >
          <div className="flex flex-col gap-2">
            <label>Upload an Image:</label>
            <input
              className="border-[1px] rounded"
              type="file"
              multiple
              placeholder="past tweet id..."
            />
            <button className="bg-emerald-500 rounded text-indigo-100">
              Upload
            </button>
          </div>
        </form>
      </div>

  </div>
  );
};

export default BlogEditorTool;
