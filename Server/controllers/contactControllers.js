
import User from "../models/UserModel.js";


export const searchContacts = async (req, res) => {
    try {
        const { searchTerm } = req.body;
   
        if (!searchTerm) {
            return res.status(400).send("searchTerm is required");
        }

        const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
 
        const regex = new RegExp(sanitizedSearchTerm, "i");

        const contacts = await User.find({
            _id: { $ne: req.userId }, 
            $or: [
                { firstName: regex },
                { lastName: regex },
                { email: regex },
            ],
        });

        return  res.status(200).send({ contacts });

        return res.status(200).send("logout successfully")
        
    } catch (error) {
        console.error("Error in search Contacts:", error.message);
        return res.status(500).send("Internal server error");
    }
};

export default searchContacts

