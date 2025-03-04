import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import AuthRouter from './routes/auth.route.js'; // Ensure this path is correct
import { connectDB } from './lib/db.js';
import ProfileRouter from './routes/profile.router.js';
import MessageRouter from './routes/message.router.js';
import { app, server } from "./lib/socket.js";
dotenv.config();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({origin:["http://localhost:5173","http://localhost:5173"],credentials:true}));
app.use(express.json({ limit: "50mb" }));  // Increase JSON payload limit

app.use(express.urlencoded({ extended: true })); // ✅ Parses URL-encoded data
app.use(cookieParser())
// Routes
app.use('/auth', AuthRouter);
app.use('/user',ProfileRouter);
app.use('/messages',MessageRouter);
server.listen(PORT, () =>{
     console.log(`Server is running on port ${PORT}.`)
     connectDB();
}
);
