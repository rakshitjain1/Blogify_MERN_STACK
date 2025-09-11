import express from "express"
import 'dotenv/config'
import cors from  'cors'
import connectDB from "./config/db.js";
import adminRouter from "./routes/adminRoute.js";
import blogRouter from "./routes/blogRoutes.js";

const app = express();
  await connectDB()
//Middelwars
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // make sure this matches your frontend URL
    credentials: true,
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