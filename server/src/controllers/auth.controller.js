import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import  bcrypt from 'bcryptjs';
export const signup= async(req, res) => {
    const {fullName,email,password}=req.body;
    try{
        if(!fullName || !email || !password){
            return res.status(400).json({message:" All fields required"});
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters"})
        }
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"})
        }
        const salt=await bcrypt.genSalt(10);
        const hashedpassword=await bcrypt.hash(password,salt);
        const newUser=new User(
            {
                fullName,
                email,
                password:hashedpassword
            }
        )
        if(newUser){
            //generate jwt Token here
            generateToken(newUser._id,res);
            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,


            })
        }
        else{
            res.status(400).json({message:"invalid user data"});
        }

    }
    catch(error){
        return res.status(500).json({message:error});
    }
    
}
export const login= async(req, res) => {
    const {email,password}=req.body;
    try{
        const user=await User.findOne({email});
        if(!user){
          return res.status(400).json({message:"user not found"})  
        }
        const ispassCorrect=await bcrypt.compare(password,user.password);
        if(!ispassCorrect){
            return res.status(400).json({message:"invalid password"});
        }
        generateToken(user._id,res);
        return res.status(201).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
        })
    }
    catch(error){
        console.log(error)
        return  res.status(500).json({message:error})
    }
}

export const logout= (req, res) => {
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logout succesfully"})
    }
    catch(error){
        res.status(500).json({message:error})

    }
}
export const checkAuth=(req,res)=>{
    try{
        res.status(200).json(req.user);

    }
    catch(error){
        res.status(500).json({message:error});
    }
}
