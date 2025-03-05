import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import AuthRouter from './routes/auth.route.js'; // Ensure this path is correct
import { connectDB } from './lib/db.js';
import ProfileRouter from './routes/profile.router.js';
import MessageRouter from './routes/message.router.js';
import { app, server } from "./lib/socket.js";
import path from 'path';
import { disconnect } from 'mongoose';
dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname=path.resolve();

// Middleware
app.use(cors({origin:["http://localhost:5173","http://localhost:5173"],credentials:true}));
app.use(express.json({ limit: "50mb" }));  // Increase JSON payload limit

app.use(express.urlencoded({ extended: true })); // ✅ Parses URL-encoded data
app.use(cookieParser())
// Routes
// Mount API routes with "/api" prefix
app.use('/api/auth', AuthRouter);
app.use('/api/user', ProfileRouter);
app.use('/api/messages', MessageRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  // Make sure the catch-all comes after your API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

server.listen(PORT, () =>{
     console.log(`Server is running on port ${PORT}.`)
     connectDB();
}
);
