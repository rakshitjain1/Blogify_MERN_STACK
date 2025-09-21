import React, { useEffect, useRef, useState } from "react";
import { assets, blogCategories } from "../../assets/assets";
import Quill from "quill";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { parse } from "marked";

const AddBlog = () => {
  const { axios } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);
  const QuillRef = useRef(null);

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Startup");
  const [isPublished, setIsPublished] = useState(false);

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsAdding(true);
      const blog = {
        title,
        subTitle,
        description: QuillRef.current.root.innerHTML,
        category,
        isPublished,
      };
      if (author) blog.author = author; // optional

      const formData = new FormData();
      formData.append("blog", JSON.stringify(blog));
      formData.append("image", image);

      const { data } = await axios.post("/api/blog/add", formData);
      if (data.success) {
        toast.success(data.message);
        setImage(null);
        setTitle("");
        setSubTitle("");
        QuillRef.current.root.innerHTML = "";
        setCategory("Startup");
        setAuthor("");
        setIsPublished(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  const generateContent = async () => {
    if (!title) return toast.error("Please enter a title");
    try {
      setLoading(true);
      const { data } = await axios.post("/api/blog/generate", { prompt: title });
      if (data.success) {
        QuillRef.current.root.innerHTML = parse(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (!QuillRef.current && editorRef.current) {
    // Extend Link behavior
    const Link = Quill.import("formats/link");
    class CustomLink extends Link {
      static sanitize(url) {
        if (!/^https?:\/\//.test(url)) {
          return "https://" + url;
        }
        return super.sanitize(url);
      }
    }
    Quill.register(CustomLink, true);

    QuillRef.current = new Quill(editorRef.current, {
      theme: "snow",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }], // Headings
          ["bold", "italic", "underline", "strike"], // Text styles
          [{ list: "ordered" }, { list: "bullet" }], // Lists
          ["link"], // Links
          ["clean"], // Remove formatting
        ],
      },
    });

    // Ensure links open in new tab
    QuillRef.current.root.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        e.preventDefault();
        const url = e.target.getAttribute("href");
        if (url) {
          window.open(url, "_blank", "noopener,noreferrer");
        }
      }
    });
  }
}, []);



  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll"
    >
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        {/* Upload Thumbnail */}
        <p>
          Upload thumbnail <span className="text-red-500">*</span>
        </p>
        <label htmlFor="image">
          <img
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            alt=""
            className="mt-2 h-16 rounded cursor-pointer"
          />
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </label>

        {/* Blog Title */}
        <p className="mt-4">
          Blog Title <span className="text-red-500">*</span>
        </p>
        <input
          type="text"
          placeholder="Enter Your Title"
          required
          className="w-full max-w-lg mt-2 p-3 border border-gray-300 focus:ring-2 focus:ring-primary outline-none rounded-lg"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        {/* Blog Subtitle */}
        <p className="mt-4">
          Blog Subtitle <span className="text-red-500">*</span>
        </p>
        <input
          type="text"
          placeholder="Enter Your Subtitle"
          required
          className="w-full max-w-lg mt-2 p-3 border border-gray-300 focus:ring-2 focus:ring-primary outline-none rounded-lg"
          onChange={(e) => setSubTitle(e.target.value)}
          value={subTitle}
        />

        {/* Blog Description */}
        <p className="mt-4">
          Blog Description <span className="text-red-500">*</span>
        </p>
        <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative border border-gray-300 rounded-lg">
          <div ref={editorRef} className="p-2 min-h-[150px]" />
          {loading && (
            <div className="absolute right-0 top-0 bottom-0 left-0 flex items-center justify-center bg-black/10 mt-2">
              <div className="w-8 h-8 rounded-full border-2 border-t-white animate-spin"></div>
            </div>
          )}
          <button
            disabled={loading}
            className="absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer"
            type="button"
            onClick={generateContent}
          >
            {loading ? "Generating..." : "Generate with AI"}
          </button>
        </div>

        {/* Blog Category */}
        <p className="mt-4">
          Blog Category <span className="text-red-500">*</span>
        </p>
        <select
          onChange={(e) => setCategory(e.target.value)}
          name="category"
          className="mt-2 px-3 py-2 border text-gray-500 rounded hover:underline cursor-pointer"
          value={category}
          required
        >
          <option value="">Select category</option>
          {blogCategories.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* Author (optional) */}
        <p className="mt-4">Author (optional)</p>
        <input
          type="text"
          placeholder="Enter Author Name"
          className="w-full max-w-lg mt-2 p-3 border border-gray-300 focus:ring-2 focus:ring-primary outline-none rounded-lg"
          onChange={(e) => setAuthor(e.target.value)}
          value={author}
        />

        {/* Publish (optional) */}
        <div className="flex gap-2 mt-4 items-center">
          <input
            type="checkbox"
            checked={isPublished}
            className="scale-125 cursor-pointer"
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          <p>Publish Now (optional)</p>
        </div>

        {/* Submit */}
        <button
          disabled={isAdding}
          type="submit"
          className="mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm hover:bg-primary/90 transition"
        >
          {isAdding ? "Adding..." : "Add Blog"}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;
