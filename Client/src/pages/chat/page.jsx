import React from 'react'
import { useAuthStore } from "@/store";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import ChatContainer from './components/chat-container';
import ContactContainer from './components/contact-container';
import EmptyContainer from './components/empty-contaienr';


const Chat = () => {
  const { 
    SelectedChatType, userInfo, 
    isUploading,
    isDownloading,
    fileDownloadProgress,

   } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() => {
    if (userInfo && userInfo.profileSetup === false) {
      toast({ description: "Please complete your profile to continue" });
      navigate("/profile");
    } 
  }, [userInfo, navigate, toast]);
  return (<>  
    <div className='flex h-[100vh] text-white overflow-hidden'>
      {
        isUploading && <div className='h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flexs items-center justify-center flex-col gap-5 backdrop-blur-lg '>
          <h5 className='text-5xl animate-pulse'>Uploading Files</h5>
          {fileDownloadProgress}%
        </div>
      }
      {
        isDownloading && <div className='h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flexs items-center justify-center flex-col gap-5 backdrop-blur-lg '>
          <h5 className='text-5xl animate-pulse'>Downloading Files</h5>
          {fileDownloadProgress}%
        </div>
      }
      <ContactContainer />
      {
        SelectedChatType === undefined ? <EmptyContainer/> : <ChatContainer />            
      }
    </div>
  </>)
}   

export default Chat

