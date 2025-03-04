import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
export const connectDB=async ()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log(`mongo db connected :${conn.connection.host}`)
    }
    catch(e){
        console.log(e)
    }

}