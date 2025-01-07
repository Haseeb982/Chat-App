import React, { useState, useRef } from 'react';
import { GrAttachment } from 'react-icons/gr';
import { RiEmojiStickerLine } from 'react-icons/ri';
import { IoSend } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import { useAuthStore } from '@/store';
import { useSocket } from '@/context/SocketContext';


const MessageBar = () => {
  const [message, setMessage] = useState('');
  const { socket } = useSocket()
  const { SelectedChatData, SelectedChatType, userInfo } = useAuthStore()
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const handleSendMessage = () => {
    try {           
      if (SelectedChatType === "contact") {
        console.log("this is a socket", socket) 
        socket.emit("sendMessage", {
          sender: userInfo.id,
          content: message,
          recipient: SelectedChatData._id,
          messageType: "text",
          fileUrl: undefined
        }) 
      }                 
    } catch (error) {
      console.log("error in send message;:", error.message)
    }    
  };
  

  const handleEmojiClick = (emoji) => {
    setMessage((msg) => msg + emoji.emoji); // Append emoji to the message
    setEmojiPickerOpen(false); // Close picker after selection
  };

  return (
    <div className="flex justify-center items-center h-[10vh] px-8 mb-6 gap-6">
      <div className="flex flex-1 bg-[#2a2b33] rounded-md gap-5 items-center pr-5">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
        />
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
          <GrAttachment className="text-2xl" />
        </button>
        <div className="relative mt-1">
          <button
            onClick={() => setEmojiPickerOpen((prev) => !prev)} // Toggle the picker
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          {emojiPickerOpen && (
            <div className="absolute bottom-16 right-0 z-10">
              <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
            </div>
          )}
        </div>
      </div>
      <button
        className="rounded-md bg-purple-700 p-5 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
