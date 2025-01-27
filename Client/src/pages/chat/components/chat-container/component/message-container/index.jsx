import React, { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store';
import moment from 'moment';
import { apiClient } from '@/lib/api-client';
import {
  GET_CHANNEL_MESSAGES,
  GET_MESSAGES_ROUTES,
  HOST_URL,
} from '@/utiles/constant';
import { MdFolderZip } from 'react-icons/md';
import { IoMdArrowRoundDown } from 'react-icons/io';
import { IoCloseSharp } from 'react-icons/io5';
import getColors from '@/pages/utiles';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    SelectedChatMessages,
    SelectedChatType,
    SelectedChatData,
    userInfo,
    SetSelectedChatMessages,
    isUploading,
    isDownloading,
    SetisDownloading,
    fileUploadProgress,
    SetfileDownloadProgress,
    SetisUploading,
  } = useAuthStore();

  const [imageUrl, setImageUrl] = useState(null);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_MESSAGES_ROUTES,
          { id: SelectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          SetSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error.message);
      }
    };

    const getChannelMessages = async () => {
      try {
        const response = await apiClient.get(
          `${GET_CHANNEL_MESSAGES}/${SelectedChatData._id}`,
          { withCredentials: true }
        );
        if (response.data.messages) {
          console.log('data is this', response.data.messages);
          SetSelectedChatMessages(response.data.messages);
        }
      } catch (error) {}
    };
    if (SelectedChatData._id && SelectedChatType === 'contact') {
      getMessages();
    } else if (SelectedChatType === 'channel') getChannelMessages();
  }, [SelectedChatData, SelectedChatType, SetSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [SelectedChatMessages]);

  const checkIfImage = (content) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff?)$/i;
    return imageRegex.test(content);
  };

  const downloadFile = async (url) => {
    SetisDownloading(true);
    SetfileDownloadProgress(0);

    try {
      const response = await apiClient.get(`${HOST_URL}/${url}`, {
        responseType: 'blob',
        onDownloadProgress: (ProgressEvent) => {
          const { loaded, total } = ProgressEvent;
          const percentCompleted = Math.round((loaded / total) * 100);
          SetfileDownloadProgress(percentCompleted);
        },
      });

      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = url.split('/').pop();
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error('Error downloading file:', error.message);
    } finally {
      SetisDownloading(false);
      SetfileDownloadProgress(0);
    }
  };

  const DateDivider = ({ date }) => (
    <div className="text-center text-gray-400 my-4 text-sm">
      {moment(date).format('LL')}
    </div>
  );

  const MessageBubble = ({ message, isCurrentUser }) => (
    <div
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`rounded-lg px-4 py-3 max-w-[70%] break-words shadow-md ${
          isCurrentUser
            ? 'bg-purple-600 text-white'
            : 'bg-[#202022] text-gray-200'
        }`}
      >
        {message.messageType === 'file' ? (
          <FileMessage message={message} isCurrentUser={isCurrentUser} />
        ) : (
          <p>{message.content}</p>
        )}
        <div
          className={`text-xs mt-2 ${
            isCurrentUser ? 'text-gray-300' : 'text-gray-400'
          }`}
        >
          {moment(message.timestamp).format('LT')}
        </div>
      </div>
    </div>
  );

  const renderChannelMessages = (message) => {
    const currentUser = message.sender_id !== userInfo.id;
    return (
      <div
        className={`flex ${currentUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`rounded-lg px-4 py-3 max-w-[70%] break-words shadow-md ${
            currentUser
              ? 'bg-purple-600 text-white'
              : 'bg-[#202022] text-gray-200'
          }`}
        >
          {message.messageType === 'file' ? (
            <FileMessage message={message} isCurrentUser={currentUser} />
          ) : (
            <p>{message.content}</p>
          )}
          <div
            className={`text-xs mt-2 ${
              currentUser ? 'text-gray-300' : 'text-gray-400'
            }`}
          >
            {moment(message.timestamp).format('LT')}
          </div>
        </div>
        {message.sender_id !== userInfo.id ? (
          <div className="flex justify-center items-center gap-3 border-2 border-red-600 ">
            <Avatar className="w-8 h-8 rounded-full overflow-hidden">
              {message.sender.image && (
                <>
                  <AvatarImage
                    src={`${HOST_URL}/${message.sender.image}`}
                    className="w-full h-full object-cover bg-black"
                    alt="User Avatar"
                  />
                  <AvatarFallback
                    className={`w- h-8 uppercase text-lg flex justify-center items-center ${getColors(
                      message.sender.color
                    )}`}
                  >
                    {message.sender.firstName
                      ? message.sender.firstName.split('').shift()
                      : message.sender.email.split('').shift()}
                  </AvatarFallback>
                </>
              )}
            </Avatar>
            <span className="text-sm text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
            <span className="text-sm text-white60">
              {moment(message.timestamp).format('LT')}
            </span>
          </div>
        ) : (
          <div className="text-xs text-white/60 mt-1 ">
            {moment(message.timestamp).format('LT')}
          </div>
        )}
      </div>
    );
  };
  const FileMessage = ({ message, isCurrentUser }) => (
    <div
      className={`rounded-md overflow-hidden ${
        isCurrentUser
          ? 'bg-purple-600 text-purple-600 border-purple-600'
          : 'bg-black/50 text-white/50 border-white/20'
      }`}
    >
      {checkIfImage(message.fileUrl) ? (
        <div
          className="cursor-pointer"
          onClick={() => {
            setShowImage(true);
            setImageUrl(message.fileUrl);
          }}
        >
          <img
            src={`${HOST_URL}/${message.fileUrl}`}
            alt="Uploaded content"
            className="w-full h-auto cursor-pointer"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center gap-4">
          <span className="text-white text-3xl bg-black rounded-full p-3">
            <MdFolderZip />
          </span>
          <span>{message.fileUrl.split('/').pop()}</span>
          <span
            className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
            onClick={() => downloadFile(message.fileUrl)}
          >
            <IoMdArrowRoundDown />
          </span>
        </div>
      )}
    </div>
  );

  const renderMessages = () => {
    let lastDate = null;
    return SelectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format('YYYY-MM-DD');
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      const isCurrentUser = message.sender._id === userInfo.id;
      {
        SelectedChatType === 'channel' && renderChannelMessages(message);
      }
      return (
        <React.Fragment key={index}>
          {showDate && <DateDivider date={message.timestamp} />}
          <MessageBubble message={message} isCurrentUser={isCurrentUser} />
        </React.Fragment>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-4 w-full text-gray-100">
      {isUploading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500 border-solid"></div>
        </div>
      )}
      {SelectedChatMessages.length > 0 ? (
        renderMessages()
      ) : (
        <div className="text-center text-gray-500">No messages yet</div>
      )}
      <div ref={scrollRef}></div>

      {isDownloading && (
        <div className="fixed bottom-0 left-0 w-full p-3 bg-black/70">
          <div className="w-full bg-gray-300 h-2 rounded-full">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${fileUploadProgress}%` }}
            ></div>
          </div>
          <div className="text-white text-center mt-1">
            {fileUploadProgress}%
          </div>
        </div>
      )}

      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`${HOST_URL}/${imageUrl}`}
              className="h-[80vh] w-full bg-cover"
              alt="Displayed content"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(imageUrl)}
            ></button>
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setImageUrl(null);
                setShowImage(false);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
