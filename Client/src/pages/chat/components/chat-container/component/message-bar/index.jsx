import React, { useRef, useState } from 'react';
import { GrAttachment } from 'react-icons/gr';
import { RiEmojiStickerLine } from 'react-icons/ri';
import { IoSend } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import { useAuthStore } from '@/store';
import { useSocket } from '@/context/SocketContext';
import { apiClient } from '@/lib/api-client';
import { UPLOAD_FILE_ROUTES } from '@/utiles/constant';

const MessageBar = () => {
  const fileInputRef = useRef();
  const [message, setMessage] = useState('');
  const { socket } = useSocket();
  const {
    SelectedChatData,
    SelectedChatType,
    userInfo,
    SetfileDownloadProgress,
    SetisUploading,
  } = useAuthStore();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const handleSendMessage = () => {
    console.log('channel id user', message);
    try {
      if (SelectedChatType === 'contact') {
        socket.emit('sendMessage', {
          sender: userInfo.id,
          content: message,
          recipient: SelectedChatData._id,
          messageType: 'text',
          fileUrl: undefined,
        });
      } else if (SelectedChatType === 'channel') {
        socket.emit('send-channel-message', {
          sender: userInfo.id,
          content: message,
          messageType: 'text',
          fileUrl: undefined,
          channelId: SelectedChatData._id,
        });
      }
      setMessage('');
    } catch (error) {
      console.log('error in send message:', error.message);
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessage((msg) => msg + emoji.emoji); 
    setEmojiPickerOpen(false); 
  };

  const handelAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handelAttachmentChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(UPLOAD_FILE_ROUTES, formData, {
      withCredentials: true,
      onUploadProgress: (data) => {
        SetfileDownloadProgress(Math.round(100 * data.loaded) / data.total);
      },
    });

    if (response.status === 200 && response.data) {
      SetisUploading(false);
      if (SelectedChatType === 'contact') {
        socket.emit('sendMessage', {
          sender: userInfo.id,
          content: undefined,
          recipient: SelectedChatData._id,
          messageType: 'file',
          fileUrl: response.data.filePath,
        });
      } else if (SelectedChatType === 'channel') {
        socket.emit('send-channel-message', {
          sender: userInfo.id,
          content: undefined,
          messageType: 'file',
          fileUrl: response.data.filePath,
          channelId: SelectedChatData._id,
        });
      }
    }
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
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={handelAttachmentClick}
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handelAttachmentChange}
        />
        <div className="relative mt-1">
          <button
            onClick={() => setEmojiPickerOpen((prev) => !prev)} 
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
