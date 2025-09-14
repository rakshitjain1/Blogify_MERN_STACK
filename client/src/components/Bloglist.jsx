import React, { useState } from "react";
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

const Bloglist = () => {
  const [menu, setMenu] = useState("All");
  const [startIndex, setStartIndex] = useState(0);
  const { blogs, input } = useAppContext();

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
    if (startIndex + 7 < blogCategories.length) setStartIndex(startIndex + 1);
  };

  const buttonWidth = 150; // fixed width for each button

  return (
    <div>
      {/* Categories with Slide Buttons */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 my-6">
        {/* Left Button */}
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

        {/* Categories with Motion */}
        <div className="w-[90%] sm:w-[80%] overflow-hidden">
          <motion.div
            className="flex gap-3 sm:gap-5"
            animate={{ x: -startIndex * (buttonWidth + 20) }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            {blogCategories.map((item) => (
              <div key={item.name} className="relative" style={{ width: buttonWidth }}>
                <button
                  onClick={() => setMenu(item.name)}
                  className={`relative flex items-center justify-center gap-2 w-full px-3 py-2 rounded-full cursor-pointer whitespace-nowrap transition ${
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
        </div>

        {/* Right Button */}
        <button
          onClick={handleNext}
          disabled={startIndex + 7 >= blogCategories.length}
          className={`p-2 rounded-full ${
            startIndex + 7 >= blogCategories.length
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200 text-gray-600"
          }`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40">
        {filterBlogs()
          .filter((blog) => (menu === "All" ? true : blog.category === menu))
          .map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
      </div>
    </div>
  );
};

export default Bloglist;
