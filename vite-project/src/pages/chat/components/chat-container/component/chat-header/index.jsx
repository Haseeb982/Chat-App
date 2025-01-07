import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store'
import React, { useEffect } from 'react'
import { RiCloseFill } from "react-icons/ri"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"; // Ensure AvatarImage is imported
import getColors from '@/pages/utiles'
import { HOST_URL } from '@/utiles/constant';
import { useSocket } from '@/context/SocketContext';


const ChatHeaders = () => {
  const { CloseChat, SelectedChatData} = useAuthStore()        
  const socket = useSocket()
  return (
    <div className='h-[10vh] flex justify-between p-7 text-sm border-b-2 border-[#2F303b]'>
      <div className='flex gap-5 items-center'>
        <div className='flex gap-3 items-center justify-center'>          
          <Avatar className="w-10 h-10 rounded-full overflow-hidden">          
            {SelectedChatData.image ? (
                  <AvatarImage      
                src={`${HOST_URL}/${SelectedChatData.image}`}
                className="w-full h-full object-cover bg-black"
                alt="User Avatar"
              />
            ) : (
              <AvatarFallback
                className={`w-10 h-10 uppercase text-lg flex justify-center items-center ${getColors(SelectedChatData.color)}`}
              >
                {SelectedChatData.firstName
                  ? SelectedChatData.firstName
                  : SelectedChatData.email}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        <div className="flex flex-col">
          <span>
            {SelectedChatData.firstName && SelectedChatData.lastName
              ? `${SelectedChatData.firstName} ${SelectedChatData.lastName}`
              : `${SelectedChatData.email}`}
          </span>   
        </div>
        {SelectedChatData? console.log("contact is here", SelectedChatData) : "not"}
      </div> 
      <div>         
      </div> 
      <div className='flex gap-5 items-center justify-center'>
        <button className='text-neutral-500 focus:border-none focus: outline-none focus:text-white duration-300 transition-all'>
          <RiCloseFill className='text-3xl' onClick={CloseChat} />
        </button>
      </div>
    </div>
  )
}

export default ChatHeaders