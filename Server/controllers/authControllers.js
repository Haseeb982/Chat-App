import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { renameSync, unlinkSync } from "fs"


const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userID) => {
    return jwt.sign(
        { userID, email },
        process.env.JWT_SECRET || "secret",
        { expiresIn: maxAge / 1000 }
    );
};

export const signup = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;


        if (!email || !password || !confirmPassword) {
            return res.status(400).json({ message: "Email, password, and confirm password are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }


        const hashedPassword = await bcrypt.hash(password, 10);        
        const user = new User({
            email,
            password: hashedPassword,
            profileSetup: false, 
        });

        await user.save();

        const token = createToken(user.email, user._id);

        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge,
        });

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

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {  
            console.log("email not found");
            return res.status(404).json({ message: "User not found" });
        }
  

        const token = createToken(existingUser.email, existingUser._id);

        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge,
        });

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
        const userData = await User.findById(req.userID);
        if (!userData) {
            return res.status(404).json({ message: "User with this id not found" });
        }
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
        if (!firstName, !lastName) {
            return res.status(400).send("firstname, lastname and color is required ")
        }
        const fileName = await User.findByIdAndUpdate(userID, { firstName, lastName, profileSetup: true }, { new: true, runValidators: true })

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
        if (!req.file) {
            return res.status(400).send("File is required");
        }

        const timestamp = Date.now();
        const fileNameImg = `upload/profiles/${timestamp}_${req.file.originalname}`;

        try {
            renameSync(req.file.path, fileNameImg);
        } catch (fsError) {
            console.error("Error renaming file:", fsError.message);
            return res.status(500).send("Failed to process the uploaded file.");
        }


        const updatedUser = await User.findByIdAndUpdate(
            req.userID,
            { image: fileNameImg },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).send("User not found.");
        }

        return res.status(200).json({ image: updatedUser.image });
    } catch (error) {
        console.error("Error during profile image update:", error.message);
        return res.status(500).json({ message: error.message });
    }
};


export const deleteProfileImage = async (req, res) => {
    try {
        const { userID } = req; 
        const user = await User.findById(userID); 
        if (!user) {
            return res.status(404).send("User not found");
        }

        if (user.image) {
            unlinkSync(user.image); 
        }

        user.image = null;
        await user.save(); 

        return res.status(200).send("User image removed successfully");
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error");
    }
};


export const logOut = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 1, sameSite:"none", secure:true, httpOnly: true})
        return res.status(200).send("logout successfull")
    } catch (error) {
        
        (error.message);
        return res.status(500).send("Internal server error");
    }
};
