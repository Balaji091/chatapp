import User from "../models/user.model.js";
import streamifier from 'streamifier';
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsers=async(req,res)=>{
    try{
        const loginUserId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:loginUserId}}).select("-password");
        res.status(200).json({data:filteredUsers});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:'internal server'})
    }
}
export const getMessages=async(req,res)=>{
    try{
        const {id:userTochatId}=req.params;
        const myId=req.user._id;    
        const messages=await Message.find({
            $or:[
                {senderId:myId,receiverId:userTochatId},
                {senderId:userTochatId,receiverId:myId},
            ],
        });
        res.status(200).json({data:messages});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
    

} 


export const sendMessage = async (req, res) => {
    try {
      const senderId = req.user._id;
      const { id: receiverId } = req.params;
      const { text } = req.body;
  
      if (!senderId) {
        return res.status(401).json({ message: "Unauthorized: User not found" });
      }
  
      // Validate receiverId
      if (!mongoose.Types.ObjectId.isValid(receiverId)) {
        return res.status(400).json({ message: "Invalid receiverId" });
      }
  
      let imageUrl = null;
  
      if (req.file) {
        try {
          const uploadResponse = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: 'messages' },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );
            streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
          });
          imageUrl = uploadResponse.secure_url;
        } catch (uploadError) {
          return res.status(500).json({ message: "Image upload failed", error: uploadError.message });
        }
      }
  
      const newMessage = new Message({ senderId, receiverId, text, image: imageUrl });
      await newMessage.save();
  
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
  
      return res.status(201).json({ message: "Message sent successfully", data: newMessage });
    } catch (error) {
      console.error("Error in sendMessage:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
