
import User from "../models/UserModel.js";

const getAllContacts = async (req, res, next) => {
    try {
        const users = await User.find({_id: {$ne: req.userID}}, "firstName lastName _id email")

        const contacts = users.map((user)=> ({
            label: user.firstName ? `${user.firstName} ${user.lastName}`: user.email, value: user._id
        }))
        return res.status(200).json({ contacts })
    } catch (error) {
        console.error("Error in search ContactsDM:", error.message);
        return res.status(500).send("Internal server error");
    }
};

export default getAllContacts