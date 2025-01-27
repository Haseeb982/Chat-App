import { Server as SocketIoServer } from 'socket.io';
import Message from './models/MessageModels.js';
import Channel from './models/ChannelModel.js';

const SetupSocket = (server) => {
  const io = new SocketIoServer(server, {
    cors: {
      origin: 'http://localhost:5173', // Update this to match your client URL
      methods: ['GET', 'POST'],
      credentials: true,
    },
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
      if (message.id && message) {
        console.log('message data has not here', message);
      } else {
        console.log('Message sender race:', message.sender);
      }

      const senderSocketId = userSocketMap.get(message.sender);
      const recipientSocketId = userSocketMap.get(message.recipient);

      if (!senderSocketId || !recipientSocketId) {
        console.log('Sender or recipient socket not found');
        return;
      } else {
        console.log(
          'sender and recipient ids',
          senderSocketId,
          recipientSocketId
        );
      }

      const createdMessage = await Message.create(message);

      const messageData = await Message.findById(createdMessage._id)
        .populate('sender', 'id image email firstName lastName color')
        .populate('recipient', 'id image email firstName lastName color');

      if (recipientSocketId) {
        io.to(recipientSocketId).emit('recieveMessage', messageData);
      }
      if (senderSocketId) {
        io.to(senderSocketId).emit('recieveMessage', messageData);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const sendChannelMessage = async (message) => {
    const { channelId, sender, content, messageType, fileUrl } = message;

    const createdMessages = await Message.create({
      sender,
      recipient: null,
      content,
      messageType,
      timesStamp: new Date(),
      fileUrl,
    });

    const messageData = await Message.findById(createdMessages._id)
      .populate('sender', 'id image email firstName lastName color')
      .exec();
    await Channel.findByIdAndUpdate(channelId, {
      $push: { messages: createdMessages._id },
    });

    const channel = await Channel.findById(channelId).populate('members');

    const finalData = { ...messageData._doc, channelId: channel._id };

    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());

        if (memberSocketId) {
          io.to(memberSocketId).emit('recieve-channel-message', finalData);
        }        
      });
        const adminSocketId = userSocketMap.get(channel.admin._id.toString());
          if (adminSocketId) {
           io.to(adminSocketId).emit('recieve-channel-message', finalData);
        }
    }
  };

  io.on('connection', (socket) => {
    const userID = socket.handshake.query.userID;
    if (userID) {
      userSocketMap.set(userID, socket.id);
      console.log(`User connected ${userID} with Socket id ${socket.id}`);
    } else {
      console.log('User ID not provided during connection');
    }

    socket.on('sendMessage', sendMessage);
    socket.on('send-channel-message', sendChannelMessage);
    socket.on('disconnect', () => disconnect(socket));
  });
};

export default SetupSocket;
