import { Router } from "express";
import  searcthContacts  from "../controllers/contactControllers.js";
import { VerifyToken } from "../middleware/authMiddleware.js";

const contactRoutes = Router()

contactRoutes.post('/search',VerifyToken, searcthContacts)

export default contactRoutes