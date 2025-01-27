import { useAuthStore } from '@/store'
import React from 'react'
import getColors from '@/pages/utiles'
import { HOST_URL } from '@/utiles/constant'
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar'

const ContactList = ({ contacts, isChannel = false }) => {
  const { SelectedChatData, SetSelectedChatData, SelectedChatType, SetSelectedChatType, SetSelectedChatMessages } = useAuthStore()

  const handleClick = (contact) => {
    if (isChannel) SetSelectedChatType('channel')
    else SetSelectedChatType('contact')
    SetSelectedChatData(contact)
    if (SelectedChatData && SelectedChatData._id !== contact._id) {
      SetSelectedChatMessages([])
    }
  }

  return (
    <div className='mt-5 border-red-700'>      
      {contacts.map((contact) => (
        <div 
          key={contact._id} 
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${SelectedChatData && SelectedChatData._id === contact._id ? "bg-[#8417ff] hover:bg-[#8417ff]" : "hover:bg-[#f1f1f111]"}`} 
          onClick={() => handleClick(contact)}
        >
          <div className='flex gap-5 items-center justify-start text-neutral-300'>
            {!isChannel && (
              <Avatar className="w-10 h-10 rounded-full overflow-hidden">          
                {contact.image ? (
                  <AvatarImage      
                    src={`${HOST_URL}/${contact.image}`}
                    className="w-full h-full object-cover bg-black"
                    alt="User Avatar"
                  />
                ) : (
                  <AvatarFallback
                    className={`w-10 h-10 uppercase text-lg flex justify-center items-center ${SelectedChatData && SelectedChatData._id === contact._id? "bg-[#ffffff22] border border-black/50": getColors(contact.color)}}`} 
                  >
                    {contact.firstName ? contact.firstName : contact.email}
                  </AvatarFallback>
                )}
              </Avatar>
            )}            
            {isChannel && <div className='bg-[#222222ff] h-10 w-10 flex items-center justify-center rounded-full'>#</div>}
                { 
                    isChannel ? <span>{ contact.name }</span> : <span>{`${contact.firstName} ${contact.lastName}`}</span>
                }            
          </div>
        </div>
      ))}
    </div>
  )
}

export default ContactList
