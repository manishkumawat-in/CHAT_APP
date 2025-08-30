import mongoose from "mongoose";

const connectdb = async ()=> {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/buddy`); 
        console.log("MongoDB connected successfully");      
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

export default connectdb;