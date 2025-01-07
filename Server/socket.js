import { Server as SocketIoServer } from "socket.io";
import Message from "./models/MessageModels.js";

const SetupSocket = (server) => {
    const io = new SocketIoServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`Client disconnected ${socket.id}`);
        for (const [userID, socketid] of userSocketMap.entries()) {
            if (socketid === socket.id) {
                userSocketMap.delete(userID);
                break;
            }
        }
    };

    const sendMessage = async (message) => {
        try {
            // Log the incoming message to see if it contains correct sender/recipient
            console.log("Received message:", message);
    
            const senderSocketId = userSocketMap.get(message.sender);
            const recipientSocketId = userSocketMap.get(message.recipient);
    
            if (!senderSocketId || !recipientSocketId) {
                console.log('Sender or recipient socket not found');
                return;
            }
    
            // Create message and populate sender and recipient details
            const createdMessage = await Message.create(message);
    
            const messageData = await Message.findById(createdMessage._id)
                .populate("sender", "id image email firstName lastName color")
                .populate("recipient", "id image email firstName lastName color");
    
            console.log('Message data:', messageData);
    
            // Send the message to both sender and recipient
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("recieveMessage", messageData);
            }
            if (senderSocketId) {
                io.to(senderSocketId).emit("recieveMessage", messageData);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };       


    io.on("connection", (socket) => {
        const userID = socket.handshake.query.userID;

        if (userID) {
            userSocketMap.set(userID, socket.id);
            console.log(`User connected ${userID} with Socket id ${socket.id}`);
        } else {
            console.log('User ID not provided during connection');
        }

        socket.emit("test", "wellocome to my home")
        socket.on("sendMessage", (e)=> {
            console.log(e)
        });
        socket.on("disconnect", () => disconnect(socket));
    });
};

export default SetupSocket;
