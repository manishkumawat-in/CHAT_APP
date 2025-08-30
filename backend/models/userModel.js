import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    image:{
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const UserModel = mongoose.models.user || mongoose.model("user", userSchema);

export default UserModel;