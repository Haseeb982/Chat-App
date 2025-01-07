import { Router } from "express";
import { signup } from "../controllers/authControllers.js";
import { signin } from "../controllers/authControllers.js";
import { VerifyToken } from "../middleware/authMiddleware.js";
import { getUserInfo } from "../controllers/authControllers.js";
import { updateProfile } from "../controllers/authControllers.js";
import { updateProfileImage } from "../controllers/authControllers.js";
import { deleteProfileImage } from "../controllers/authControllers.js";
import multer from "multer"
import { logOut } from "../controllers/authControllers.js";

const authRouter = Router();
const upload = multer({dest: "upload/profiles"})

authRouter.post("/signup", signup);
authRouter.post("/login", signin);
authRouter.get("/user-info", VerifyToken, getUserInfo);
authRouter.post("/update-profile", VerifyToken, updateProfile);
authRouter.post("/update-profile-image", VerifyToken, upload.single("profile-image"), updateProfileImage);
authRouter.delete("/remove-profile-image", VerifyToken, deleteProfileImage);
authRouter.post("/logout", logOut);

export default authRouter;
