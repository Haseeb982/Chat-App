import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuthStore } from '@/store';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { SelectedChatData, SelectedChatType, userInfo, addMessage } =
    useAuthStore();

  useEffect(() => {
    if (!userInfo || !userInfo.id) {
      console.log('User info is not yet available:', userInfo);
      return;
    }

    const newSocket = io('http://localhost:8048', {
      withCredentials: true,
      transports: ['polling'],
      query: { userID: userInfo.id },
    });

    newSocket.on('connect', () => {
      console.log('User ID:', userInfo.id);
      console.log('Socket connected:', newSocket.id);
      setSocket(newSocket);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setSocket(null);
    });

    const handleRecieveMessage = (message) => {
      if (message) {
        addMessage(message);
      } else {
        console.log('message not recieved');
      }
      addContactsInDMContacts(message);
    };
    const handleRecieveChannelMessage = (message) => {
      const {
        SelectedChatData,
        SelectedChatType,
        addMessage,
        addChannelInChannelList,
      } = useAuthStore.getState();
      if (
        SelectedChatType !== undefined &&
        SelectedChatData._id === message.channelId
      ) {
        console.log('frontend data', message);
        addMessage(message);
      }
      addChannelInChannelList(message);
    };

    newSocket.on('recieveMessage', handleRecieveMessage);
    newSocket.on('recieve-channel-message', handleRecieveChannelMessage);
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [userInfo]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
