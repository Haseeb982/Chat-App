import React, { useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Lottie from "lottie-react";
import animationData from "@/assets/lottie-json/loading.json";
import { apiClient } from "@/lib/api-client";
import { SEARCH_CONTACTS_ROUTE } from "@/utiles/constant";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"; 
import getColors from "@/pages/utiles";
import { useAuthStore } from "@/store";
import { HOST_URL } from "@/utiles/constant";

const NewDm = () => {
    const [openNewModelContact, setopenNewModelContact] = useState(false);
    const [searchedContacts, setsearchedContacts] = useState([]);
    const { SetSelectedChatType, SetSelectedChatData } = useAuthStore()

    const searchContact = async (searchTerm) => {
        try {
            if (searchTerm.length > 0) {
            
                const response = await apiClient.post(
                    SEARCH_CONTACTS_ROUTE,
                    { searchTerm },
                    { withCredentials: true }
                );
                if (response.status === 200 && response.data.contacts) {                    
                  
                    setsearchedContacts(response.data.contacts);                                         
                }
            } else {
                setsearchedContacts([]);
            }
        } catch (error) {
            console.error("Error in frontend of search:", error.message);
        }
    };

    const selectNewContact = async (contact) => {
        try {
            if (contact) {
            setopenNewModelContact(false)
            SetSelectedChatType("contact")
            SetSelectedChatData(contact)

            setsearchedContacts([])
  
        } 
                  
        } catch (error) {
            console.log("error in search items", error.message)
        }
    }

    return (
        <div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus
                            className="text-neutral-400 font-light text-opacity-90 hover:text-neutral-100 cursor-pointer transition-all duration-300"
                            onClick={() => setopenNewModelContact(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3">
                        <p>Add to library</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={openNewModelContact} onOpenChange={setopenNewModelContact}>
                <DialogContent className="bg-[#191820] h-[400px] flex-col border-none text-white flex w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="flex justify-center">Please Select a Contact</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <input
                        type="text"
                        placeholder="Search Contact"
                        className="rounded-lg p-3 bg-[#2c2e3b] border-none"
                        onChange={(e) => searchContact(e.target.value)}
                    />
                    <div className='h-[250px] overflow-y-auto'>
                        <div className="flex flex-col gap-5">
                            {searchedContacts.map((contact) => (
                                <div key={contact._id} onClick={() => selectNewContact(contact)} className="flex gap-3 items-center cursor-pointer">
                                    <div className="h-10 w-10 relative">
                                        <Avatar className="w-10 h-10 rounded-full overflow-hidden">
                                            {contact.image ? (
                                                <AvatarImage
                                                    src={`${HOST_URL}/${contact.image}`}
                                                    className="w-full h-full object-cover bg-black"
                                                    alt="User Avatar"
                                                />
                                            ) : (
                                                <AvatarFallback
                                                    className={`w-10 h-10 uppercase text-lg flex justify-center items-center ${getColors(contact.color)}`}
                                                >
                                                    {contact.firstName
                                                        ? contact.firstName.split("").shift()
                                                        : contact.email.split("").shift()}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                    </div>
                                    <div className="flex flex-col">
                                        <span>
                                            {contact.firstName && contact.lastName
                                                ? `${contact.firstName} ${contact.lastName}`
                                                : ""}

                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {searchedContacts.length <= 0 && (
                        <div className="md:flex flex mt-2 flex-col items-center duration-1000 transition-all">
                            <Lottie animationData={animationData} style={{ width: "50%", height: "50%" }} />
                            <h3 className="poppins-medium">
                                HI<span className="text-purple-600">!</span> Search Contact
                            </h3>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default NewDm;
