import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import BlogCard from "./BlogCard";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Laptop,
  Rocket,
  Home,
  DollarSign,
  Trophy,
  Utensils,
  BookOpen,
  Tv,
  FlaskRound,
  HeartPulse,
  Landmark,
  Plane,
  Briefcase,
  BarChart,
  GraduationCap,
  Leaf,
  Users,
  Palette,
  BookMarked,
  Camera,
  Gamepad2,
  Car,
  Shirt,
  Music,
  Film,
  Sparkles,
} from "lucide-react";

// Categories with icons
const blogCategories = [
  { name: "All", icon: <Sparkles size={18} /> },
  { name: "Technology", icon: <Laptop size={18} /> },
  { name: "Startup", icon: <Rocket size={18} /> },
  { name: "Lifestyle", icon: <Home size={18} /> },
  { name: "Finance", icon: <DollarSign size={18} /> },
  { name: "Sports", icon: <Trophy size={18} /> },
  { name: "Food", icon: <Utensils size={18} /> },
  { name: "Education", icon: <BookOpen size={18} /> },
  { name: "Entertainment", icon: <Tv size={18} /> },
  { name: "Science", icon: <FlaskRound size={18} /> },
  { name: "Health & Fitness", icon: <HeartPulse size={18} /> },
  { name: "Politics", icon: <Landmark size={18} /> },
  { name: "Travel", icon: <Plane size={18} /> },
  { name: "Personal Development", icon: <Briefcase size={18} /> },
  { name: "Business", icon: <BarChart size={18} /> },
  { name: "Marketing", icon: <GraduationCap size={18} /> },
  { name: "Career", icon: <Users size={18} /> },
  { name: "Environment", icon: <Leaf size={18} /> },
  { name: "Parenting", icon: <Users size={18} /> },
  { name: "Art & Culture", icon: <Palette size={18} /> },
  { name: "History", icon: <Landmark size={18} /> },
  { name: "Books", icon: <BookMarked size={18} /> },
  { name: "Photography", icon: <Camera size={18} /> },
  { name: "Gaming", icon: <Gamepad2 size={18} /> },
  { name: "Automobile", icon: <Car size={18} /> },
  { name: "Fashion", icon: <Shirt size={18} /> },
  { name: "Music", icon: <Music size={18} /> },
  { name: "Movies", icon: <Film size={18} /> },
  { name: "Spirituality", icon: <Sparkles size={18} /> },
];

// Simple Newsletter component
const Newsletter = () => (
  <div className="bg-gray-100 p-8 mt-12 rounded-md text-center mx-8 sm:mx-16 xl:mx-40">
    <h2 className="text-2xl font-semibold mb-4">Subscribe to our Newsletter</h2>
    <p className="mb-4">Get the latest blogs delivered to your inbox!</p>
    <form className="flex flex-col sm:flex-row justify-center gap-2">
      <input
        type="email"
        placeholder="Enter your email"
        className="p-2 rounded-md border border-gray-300 w-full sm:w-auto flex-1"
      />
      <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
        Subscribe
      </button>
    </form>
  </div>
);

const Bloglist = () => {
  const [menu, setMenu] = useState("All");
  const { blogs, input } = useAppContext();
  const carouselRef = useRef(null);
  const blogGridRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const buttonWidth = 150 + 20; // button width + gap

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 12;

  // Calculate width for drag constraints
  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, []);

  const filterBlogs = () => {
    if (input === "") return blogs;
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(input.toLowerCase()) ||
        blog.category.toLowerCase().includes(input.toLowerCase())
    );
  };

  const handlePrev = () => {
    if (startIndex > 0) setStartIndex(startIndex - 1);
  };

  const handleNext = () => {
    if (startIndex < blogCategories.length - 1) setStartIndex(startIndex + 1);
  };

  // Pagination logic
  const filteredBlogs = filterBlogs()
    .filter((blog) => (menu === "All" ? true : blog.category === menu))
    .slice()
    .reverse(); // newest first

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      blogGridRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      blogGridRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      {/* Categories Slider */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 my-6 relative">
        <button
          onClick={handlePrev}
          disabled={startIndex === 0}
          className={`p-2 rounded-full ${
            startIndex === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200 text-gray-600"
          }`}
        >
          <ChevronLeft size={20} />
        </button>

        <motion.div
          ref={carouselRef}
          className="overflow-hidden w-[90%] sm:w-[80%] cursor-grab"
          whileTap={{ cursor: "grabbing" }}
        >
          <motion.div
            className="flex gap-3 sm:gap-5"
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
            dragElastic={0}
            animate={{ x: -startIndex * buttonWidth }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            {blogCategories.map((item) => (
              <div key={item.name} className="min-w-[150px]">
                <button
                  onClick={() => {
                    setMenu(item.name);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center justify-center gap-2 w-full px-3 py-2 rounded-full cursor-pointer whitespace-nowrap transition ${
                    menu === item.name
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <button
          onClick={handleNext}
          disabled={startIndex >= blogCategories.length - 1}
          className={`p-2 rounded-full ${
            startIndex >= blogCategories.length - 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200 text-gray-600"
          }`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Blog Grid */}
      <div
        ref={blogGridRef}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-4 mx-8 sm:mx-16 xl:mx-40"
      >
        {currentBlogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mb-12">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }`}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
};

export default Bloglist;
