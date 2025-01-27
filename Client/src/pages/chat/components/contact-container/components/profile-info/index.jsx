import React from 'react'
import { HOST_URL } from '@/utiles/constant'
import { useAuthStore } from '@/store'
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import getColors from '@/pages/utiles';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { FiEdit2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { IoPowerSharp } from 'react-icons/io5';
import { LOGOUT_ROUTE } from '@/utiles/constant';
import { apiClient } from '@/lib/api-client';

const ProfileInfo = () => {
    const { userInfo, setUserInfo } = useAuthStore()
    const navigate = useNavigate()
    const logOut = async () => {
        try {
            alert("hello")
            const resposne = await apiClient.post(LOGOUT_ROUTE,{}, { withCredentials: true })
       
            alert("after")
            if (resposne.status === 200) {
                navigate("auth")
                setUserInfo(null)
            }
        } catch (error) {
            console.log("error in logout:", error.message)
        }
    }
    return (
        <div className='absolute bottom-0 h-16 px-3 w-full bg-[#2a2b33] flex justify-between items-center '>
            <div className='gap-3 flex justify-center items-center'>
                <div className='h-10 w-10 relative'>
                    <Avatar className="w-10 h-10 rounded-full overflow-hidden">
                        {userInfo.image ? (
                            <AvatarImage
                                src={`${HOST_URL}/${userInfo.image}`}
                                className="w-full h-full object-cover bg-black"
                                alt="User Avatar"
                            />
                        ) : (
                            <div
                                className={`w-10 h-10 uppercase text-lg flex justify-center items-center ${getColors(userInfo.color)}`}
                            >
                                {userInfo.firstName
                                    ? userInfo.firstName.charAt(0)
                                    : userInfo.email.charAt(0)}
                            </div>
                        )}
                    </Avatar>
                </div>
                <div className='text-sm'>
                    {userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ''}
                </div>
            </div>
            <div className='flex gap-5 '>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiEdit2 className='text-purple-700 text-lg font-medium' onClick={() => navigate('/profile')} />
                        </TooltipTrigger>
                        <TooltipContent className='bg-[#1c1b1e] border-none text-white'>
                            Edit Profile
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <IoPowerSharp className='text-purple-700 text-lg font-medium' onClick={logOut} />
                        </TooltipTrigger>
                        <TooltipContent className='bg-[#1c1b1e] border-none text-white'>
                            Edit Profile
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}

export default ProfileInfo
