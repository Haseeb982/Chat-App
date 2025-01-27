import { Router } from "express";
import { VerifyToken } from "../middleware/authMiddleware.js";
import MessageControllers from "../controllers/messageControllers.js";
import multer from "multer";
import uploadFile from "../controllers/uploadFileController.js";

const messagesRoutes = Router()
const upload = multer({dest: "uploads/files"})
messagesRoutes.post("/get-messages", VerifyToken, MessageControllers)
messagesRoutes.post("/upload-file", VerifyToken, upload.single("file"), uploadFile)

export default messagesRoutes