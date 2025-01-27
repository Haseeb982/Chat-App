    import express from "express";
    import { connectDB } from "./db/connectDB.js";
    import dotenv from "dotenv";
    import cors from "cors";
    import cookieParser from "cookie-parser";
    import authRouter from "./routes/authRoute.js";
    import contactRoutes from "./routes/contactRoutes.js";
    import SetupSocket from "./socket.js";
    import http from "http";  // Import HTTP module for server
    import messagesRoutes from "./routes/messageRoutes.js";
    import createChannel from "./controllers/ChannelController.js";
    import channelRoute from "./routes/ChannelRoute.js";

    dotenv.config();

    const app = express();
    const server = http.createServer(app);  // Create an HTTP server instance

    const corsOptions = {
        origin: 'http://localhost:5173',  // Allow only your frontend origin
        credentials: true,  // Allow credentials (cookies, headers, etc.)
    };

    app.use(express.json());
    app.use(cookieParser());
    app.use(cors(corsOptions));

    app.use("/upload/profiles", express.static("upload/profiles"));
    app.use("/upload/files", express.static("upload/files"));    

    app.use("/api/auth", authRouter);
    app.use("/api/contacts", contactRoutes);
    app.use("/api/messages", messagesRoutes);
    app.use("/api/channel", channelRoute);

    // Set up Socket.IO with the created server
    SetupSocket(server);

    server.listen(process.env.PORT, () => {
        connectDB();  // Connect to your database
        console.log(`Server is running on port http://localhost:${process.env.PORT}`);
    });
