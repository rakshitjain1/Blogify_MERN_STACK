import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import adminRouter from "./routes/adminRoute.js";
import blogRouter from "./routes/blogRoutes.js";

const app = express();

// ✅ CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://blogify-mern-stack.vercel.app",
      "https://blogify-mern-stack-m9fuay5ps-rakshit-jains-projects-04f26b9b.vercel.app"  // ✅ add this
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors()); // ✅ Handle preflight requests

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API working ✅");
});

app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);

export default app;
