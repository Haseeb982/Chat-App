import { Router } from "express";
import  searcthContacts  from "../controllers/contactControllers.js";
import getContactsForDMList from "../controllers/contactsDMlist.js";
import { VerifyToken } from "../middleware/authMiddleware.js";
import getAllContacts from "../controllers/AllContactsController.js";

const contactRoutes = Router()

contactRoutes.post('/search',VerifyToken, searcthContacts)
contactRoutes.get('/get-contacts-for-dm',VerifyToken, getContactsForDMList)
contactRoutes.get('/get-all-contacts',VerifyToken, getAllContacts)

export default contactRoutes
