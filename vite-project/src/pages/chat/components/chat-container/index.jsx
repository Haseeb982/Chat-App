import React from 'react'
import MessageContainer from './component/message-container'
import MessageBar from './component/message-bar'
import ChatHeaders from './component/chat-header'

const ChatContainer = () => {
  return (
    <div className='top-0 h-[100vh] w-[100vw] bg-black/90 md:static md:flex-1 flex flex-col'>
        <ChatHeaders/>
        <MessageContainer/>
        <MessageBar/>        
    </div>
  )
}

export default ChatContainer

