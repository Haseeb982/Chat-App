import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "@/store";
import { HOST_URL } from "@/utiles/constant";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { userInfo } = useAuthStore();
  const { SelectedChatData, SelectedChatType, addMessage } = useAuthStore.getState();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST_URL, {
        withCredentials: true,
        query: { userID: userInfo.id },
      });

      socket.current.on("connect", () => {
        console.log("Socket connected:", socket.current.id);
      });

      const handleReceiveMessage = (message) => {
        if (
          SelectedChatType !== undefined &&
          (SelectedChatData._id === message.sender._id ||
            SelectedChatData._id === message.recipient._id)
        ) {
          console.log("Message received:", message);
          addMessage(message);
        }
      };

      socket.current.on("receiveMessage", handleReceiveMessage);

      return () => {
        if (socket.current) {
          socket.current.off("receiveMessage", handleReceiveMessage);
          socket.current.disconnect();
        }
      };
    }
  }, [userInfo, SelectedChatData, SelectedChatType, addMessage]);

  return (
    <SocketContext.Provider value={{ socket: socket.current }}>
      {children}
    </SocketContext.Provider>
  );
};
