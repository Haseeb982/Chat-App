import User from "../models/UserModel.js";
import Message from "../models/MessageModels.js";


const MessageControllers = async (req, res) => {
    try {
        const user1 = req.userID
        const user2 = req.body.id

        if (user1 || user2) {
            return res.status(400).send("both users are required")            
        }        

        const messages = await Message.find({
            $or: [
                {sender: user1, recipient: user2}, 
                {sender: user2, recipient: user1}  
            ]
        }.sort({ timestamp: 1 }));
        
        return res.status(200).json({ messages })

    } catch (error) {
        console.error("Error in searchContacts:", error.message);
        return res.status(500).send("Internal server error");
    }
};


export default MessageControllers;


