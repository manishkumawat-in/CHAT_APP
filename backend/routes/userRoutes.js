import { Router } from "express";
import authChecker from "../middleware/authChecker.js";
import upload from "../middleware/imageUpload.js";
import { getUser, login, logout, signup, updateImage, updateProfile } from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.post("/updateprofile", authChecker, updateProfile);
userRouter.post("/updateimage", authChecker, upload.single("image"), updateImage);
userRouter.get("/getuser", authChecker, getUser);

export default userRouter; 