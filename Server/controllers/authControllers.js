import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { renameSync, unlinkSync } from "fs"
import { userInfo } from "os";
// Token expiration: 3 days
const maxAge = 3 * 24 * 60 * 60 * 1000;

// Function to create a JWT token
const createToken = (email, userID) => {
    return jwt.sign(
        { userID, email },
        process.env.JWT_SECRET || "secret",
        { expiresIn: maxAge / 1000 } // expiresIn expects seconds
    );
};

// Signup controller
export const signup = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        console.log("Received signup data:", req.body); // Log incoming data for debugging

        // Validate input
        if (!email || !password || !confirmPassword) {
            return res.status(400).json({ message: "Email, password, and confirm password are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);        
        // Create a new user
        const user = new User({
            email,
            password: hashedPassword,
            profileSetup: false, // Default value for profile setup
        });

        await user.save();

        const token = createToken(user.email, user._id);
        console.log("token", token);
        // Set the token as a cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge,
        });
        console.log("Set-Cookie header:", res.getHeaders()["set-cookie"]);

        // Respond with success and user details
        return res.status(201).json({
            id: user._id,
            email: user.email,
            profileSetup: user.profileSetup,
            message: "Signup successful",
        });
    } catch (error) {
        console.error("Error during signup:", error.message);
        return res.status(500).json({ message: error.message });
    }
};

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Received signin data:", req.body); // Log incoming data for debugging

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check for existing user by email
        const existingUser = await User.findOne({ email });
        console.log("existingUser", existingUser.email);
        if (!existingUser) {  // User not found
            console.log("email not found");
            return res.status(404).json({ message: "User not found" });
        }
        console.log("email found", existingUser);

        // Generate a JWT token after successful authentication
        const token = createToken(existingUser.email, existingUser._id);
        console.log("token", token);
        // Set the token as a cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge,
        });
        console.log("Set-Cookie header:", res.getHeaders()["set-cookie"]);

        // Respond with success and user details
        return res.status(200).json({
            id: existingUser._id,
            email: existingUser.email,
            profileSetup: existingUser.profileSetup,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            image: existingUser.image,
            color: existingUser.color,
            message: "Login successful",
        });
    } catch (error) {
        console.error("Error during login:", error.message);
        return res.status(500).json({ message: error.message });
    }
};

export const getUserInfo = async (req, res) => {
    try {
        console.log("user id is this", req.userID);
        const userData = await User.findById(req.userID);
        console.log("userData", userData);
        if (!userData) {
            return res.status(404).json({ message: "User with this id not found" });
        }
        // Respond with success and user details
        return res.status(200).json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
            message: "User data fetched successfully",

        });
    } catch (error) {
        console.error("Error during get user info:", error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { userID } = req
        const { firstName, lastName } = req.body
        console.log("backend data", userID, firstName, lastName)
        if (!firstName, !lastName) {
            return res.status(400).send("firstname, lastname and color is required ")
        }
        const fileName = await User.findByIdAndUpdate(userID, { firstName, lastName, profileSetup: true }, { new: true, runValidators: true })
        console.log("user update data:", fileName)
        // Respond with success and user details
        return res.status(200).json({
            id: fileName.id,
            email: fileName.email,
            profileSetup: fileName.profileSetup,
            firstName: fileName.firstName,
            lastName: fileName.lastName,
            image: fileName.image,
            color: fileName.color,
            message: "User data fetched successfully",

        });
    } catch (error) {
        console.error("Error during get user info:", error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const updateProfileImage = async (req, res) => {
    try {
        // Ensure file exists in the request
        if (!req.file) {
            return res.status(400).send("File is required");
        }

        // Generate unique filename for the uploaded file
        const timestamp = Date.now();
        const fileNameImg = `upload/profiles/${timestamp}_${req.file.originalname}`; // Corrected property name

        // Rename the uploaded file
        try {
            renameSync(req.file.path, fileNameImg);
        } catch (fsError) {
            console.error("Error renaming file:", fsError.message);
            return res.status(500).send("Failed to process the uploaded file.");
        }

        // Update the user's profile image in the database
        const updatedUser = await User.findByIdAndUpdate(
            req.userID,
            { image: fileNameImg },
            { new: true, runValidators: true }
        );

        // Check if user update was successful
        if (!updatedUser) {
            return res.status(404).send("User not found.");
        }

        console.log("Updated backend profile image:", updatedUser);

        // Respond with success and updated image path
        return res.status(200).json({ image: updatedUser.image });
    } catch (error) {
        console.error("Error during profile image update:", error.message);
        return res.status(500).json({ message: error.message });
    }
};


export const deleteProfileImage = async (req, res) => {
    try {
        const { userID } = req; // Assuming `userID` is in request params
        console.log("userid of uesr for profile", userID )
        const user = await User.findById(userID); // Await the promise to get the document
        console.log ("delete oriofile on backend", user)      
        if (!user) {
            return res.status(404).send("User not found");
        }

        if (user.image) {
            unlinkSync(user.image); // Use `user.image` to remove the file
        }

        user.image = null; // Clear the image field
        await user.save(); // Save the updated user document

        return res.status(200).send("User image removed successfully");
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error");
    }
};


export const logOut = async (req, res) => {
    try {
        console.log("in backend of logout")
        res.cookie("jwt", "", {maxAge: 1, sameSite:"none", secure:true, httpOnly: true})
        console.log("after cookie")
        return res.status(200).send("logout successfull")
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal server error");
    }
};
