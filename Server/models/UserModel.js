import mongoose from "mongoose";
import bcrypt from "bcrypt"
import { genSalt } from "bcrypt";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false,        
    },
    password: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
        
    },
    image: {
        type: String,
        default: "",
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    profileSetup: {
        type: Boolean,
        default: false,
    },
    color: {
        type: Number,
        default: 0,
    },
    
})

UserSchema.pre("save", async function (next) {
    const salt = await genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model("User", UserSchema);
export default User;
