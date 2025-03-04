import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
export const protectRoute=async(req,res,next)=>{
    try{
        const token=await req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"unauthorized access-no token provided"})
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            return res.status(400).json({message:"unAuthorized invalid token"})
        }
        const user=await User.findById(decoded.userId).select("-password")
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
       req.user=user
       
       next();
    }
    catch(error){
        res.status(500).json({message:error})
    }
}