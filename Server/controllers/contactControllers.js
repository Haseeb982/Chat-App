import User from "../models/UserModel.js";

const searchContacts = async (req, res) => {
    try {
        console.log("backend before resoonse")
        const { searchTerm } = req.body;
        console.log("search items backend", searchTerm)
        // Validate input
        if (!searchTerm) {
            return res.status(400).send("searchTerm is required");
        }

        // Sanitize input
        const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        console.log('sanitizes search here', sanitizedSearchTerm)
        // Create regex
        const regex = new RegExp(sanitizedSearchTerm, "i");
        console.log("regex here", regex)
        // Find contacts
        const contacts = await User.find({
            _id: { $ne: req.userId }, // Exclude the current user
            $or: [
                { firstName: regex },
                { lastName: regex },
                { email: regex },
            ],
        });

        console.log("contacts", contacts)

        // Return results
        res.status(200).send({ contacts });
    } catch (error) {
        console.error("Error in searchContacts:", error.message);
        return res.status(500).send("Internal server error");
    }
};

export default searchContacts;
