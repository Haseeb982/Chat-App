import mongoose, { mongo } from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        requied: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        requied: false
    },
    messageType: {
        type: String,
        enum: ["text", "file"],
        required: true
    },
    content: {
        type: String,
        requird: function() {
            return this.messageType === "text"
        }
    },
    fileUrl: {
        type: String,
        requird: function() {
            return this.messageType === "file"
        }
    },
    timesStamp: {
        type: Date,
        default: Date.now()
    }
})

const Message = mongoose.model("Messages", messageSchema)

export default Message