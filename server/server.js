import express from "express"
import 'dotenv/config'
import cors from  'cors'
import connectDB from "./config/db.js";
import adminRouter from "./routes/adminRoute.js";
import blogRouter from "./routes/blogRoutes.js";

const app = express();
  
await connectDB()
// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://blogify-mern-stack.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json())

 //routes
app.get('/',(req ,res)=>{
     res.send("api is working")
})

app.use('/api/admin',adminRouter)
app.use('/api/blog',blogRouter)


const PORT = process.env.PORT ||3000

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
})

export default app;