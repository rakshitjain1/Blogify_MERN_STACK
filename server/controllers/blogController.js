
import fs from "fs";
import imagekit from "../config/imageKit.js";
import Blog from "../models/blog.js";
import Comment from "../models/comment.js";
import main from "../config/gemini.js";


export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished ,author } = JSON.parse(
      req.body.blog
    );
    const imageFile = req.file;

    // check if all fields are present
    if (!title || !description || !category || !imageFile) {
      return res.json({
        success: false,
        message: "Missing Required Fields",
      });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    //upload img to img kit
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    // optimized through img kit url transformation
    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" }, //auto compression
        { format: "webp" }, //convert to modern format
        { width: "1280" }, // width resizeing
      ],
    });

    const image = optimizedImageUrl;

    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image,
      isPublished,
      author,
    });

    res.json({
      success: true,
      message: "Blog Added successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true });
    res.json({
      success: true,
      blogs,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { blogID } = req.params;
    const blog = await Blog.findById(blogID);
    if (!blog) {
      return res.json({
        success: false,
        message: "Blog Not Found",
      });
    }
    res.json({
      success: true,
      blog,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteBlogByID = async (req, res) => {
  try {
    const { id } = req.body;
    await Blog.findByIdAndDelete(id);

    //Delete all comments assoiated with the blog

    await Comment.deleteMany({blog :id});

    res.json({
      success: true,
      message: "Blog Deleted Successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const togglePublish = async (req ,res)=>{
    try {
        const {id} = req.body
        const blog =await Blog.findById(id)
        blog.isPublished = !blog.isPublished
        await blog.save();
        res.json({
            success:true,
            message:"Blog status updated"
        })
    } catch (error) {
        res.json({
      success: false,
      message: error.message,
    });
    }
}


export const addComment= async (req , res)=>{
   try {
     const {blog ,name , content} = req.body;
     await Comment.create({blog,name,content});
     res.json({
        success:true,
        message:"Comment added for review"
     })
    
   } catch (error) {
      res.json({
      success: false,
      message: error.message,
    });
   }
}

export const getBlogComments= async (req , res)=>{
    try {
           const {blogId} = req.body;

           const comments = await Comment.find({blog :blogId , isApproved:true}).sort({
            createdAt:-1 });
             res.json({
        success:true,
        comments
     })
        
    } catch (error) {
          res.json({
      success: false,
      message: error.message,
    });
    }
}

export const generateContent = async (req ,res)=>{
  try {
    const {prompt} = req.body
    const content =  await main(prompt + ' Generate a blog content for this topic in simple text format')
    res.json({
      success:true,
      content
    })
  } catch (error) {
    res.json({
      success:false,
      message:error.message
    })
  }
}



