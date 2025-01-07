import React from 'react'
import { useAuthStore } from "@/store";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import ChatContainer from './components/chat-container';
import ContactContainer from './components/contact-container';
import EmptyContainer from './components/empty-contaienr';


const Chat = () => {
  const { SelectedChatType, userInfo } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  console.log("on chat page user info is this");
  useEffect(() => {
    console.log("on chat page user info is this", userInfo.profileSetup);
    if (userInfo && userInfo.profileSetup === false) {
      toast({ description: "Please complete your profile to continue" });
      navigate("/profile");
    } 
  }, [userInfo, navigate, toast]);
  return (<>  
    <div className='flex h-[100vh] text-white overflow-hidden'>
      <ContactContainer />
      {
        SelectedChatType === undefined ? <EmptyContainer/> : <ChatContainer />            
      }
    </div>
  </>)
}   

export default Chat

