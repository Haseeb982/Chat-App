import React, { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/store';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import '@/App.css';
import getColors from '../utiles';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { colors } from '../utiles';
import { reducer, useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api-client';
import { HOST_URL, UPDATE_PROFILE } from '@/utiles/constant';
import { ADD_PROFILE_IMAGE } from '@/utiles/constant';
import { REMPOVE_PROFILE_IMAGE } from '@/utiles/constant';

const Profile = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { userInfo, setUserInfo } = useAuthStore();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [hovered, setHovered] = useState(false);
    const [image, setImage] = useState(null);
    const [selectedColor, setSelectedColor] = useState(0);
    const fileInputRef = useRef();

    useEffect(() => {
        if (userInfo.profileSetup) {
            setFirstName(userInfo.firstName);
            setLastName(userInfo.lastName);
            setSelectedColor(userInfo.color);
        }
        // for keep image live when browser will refresh
        if (userInfo.image) {
          setImage(`${HOST_URL}/${userInfo.image}`)
          console.log(userInfo.image)
        }
    }, [userInfo]);    

    const validateProfile = () => {
        if (!firstName) {
            toast({ description: "firstname is required" });
        }
        if (!lastName) {
            toast({ description: "lastname is required" });
        }
        if (!firstName && !lastName) {
            toast({ description: "lastname and firstname is required" });
        }
        return true;
    };

    const saveChanges = async () => {
        try {
            if (validateProfile()) {
                console.log(firstName, lastName);
                const response = await apiClient.post(UPDATE_PROFILE, { firstName, lastName }, { withCredentials: true });
                console.log("here is the profile data:", response.data);
                if (response.status === 200 && response.data) {
                    setUserInfo({ ...response.data });
                    toast({ description: "user successfully updated" });
                    navigate("/chat");
                }
            }
        } catch (error) {
            console.log("profile update data error:", error.message);
        }
    };

    const handleNavigate = () => {
        if (userInfo.profileSetup) {
            navigate("/chat");
        } else {
            toast({ description: "please setup your profile" });
        }
    };

    const handleFileInputClick = () => {
        fileInputRef.current.click(); // Open the file picker
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
            // Create a new FormData object
            const formData = new FormData();
            formData.append("profile-image", file); // Append the file with the key "profile-image"
    
            // Debugging: Log the FormData content
            console.log("image:", file);
    
            try {
                // Send the FormData to the server
                const response = await apiClient.post(ADD_PROFILE_IMAGE, formData, { withCredentials: true });
                console.log("on app.jsx file:", response);
    
                // Check if the response was successful
                if (response.status === 200 && response.data.image) {
                    // Update the user's profile image
                    setUserInfo({ ...userInfo, image: response.data.image });
                    toast({ description: "Profile image updated" });
                }
            } catch (error) {
                console.error("Error uploading image:", error);
            }
    
            // Generate a preview of the image
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleDeleteImage = async () => {
        try {
            const response = await apiClient.delete(REMPOVE_PROFILE_IMAGE, {withCredentials: true})                   
            if (response.status === 200) {
                setUserInfo({...userInfo, image: null})
                setImage(null)
            }
        } catch (error) {
            
        }        
    };

    return (
        <div className="bg-gray-600 h-[100%] w-full flex flex-col md:flex-row items-center md:items-center justify-center p-[30%] md:justify-center gap-10">
            {/* Profile and Arrow (Left Side) */}
            <div className="flex flex-col border border-red-500 items-center gap-4 md:gap-10">
                <div className="flex items-center gap-4">
                    <IoArrowBack
                        className="text-2xl cursor-pointer text-white"
                        onClick={handleNavigate}
                    />
                    <h1 className="text-white text-lg">Edit Profile</h1>
                </div>
                <div
                    className="relative w-32 h-32 md:w-48 md:h-48 border border-green-500"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    <Avatar className="w-full h-full rounded-full overflow-hidden">
                        {image ? (
                            <AvatarImage
                                src={image}
                                className="w-full h-full object-cover bg-black"
                                alt="User Avatar"
                            />
                        ) : (
                            <div
                                className={`w-full h-full uppercase text-5xl flex justify-center items-center ${getColors(selectedColor)}`}
                            >
                                {firstName
                                    ? firstName.charAt(0)
                                    : userInfo.email.charAt(0)}
                            </div>
                        )}
                    </Avatar>
                    {hovered && (
                        <div
                            className="flex justify-center items-center absolute bg-black/50 rounded-full inset-1"
                            onClick={image ? handleDeleteImage : handleFileInputClick}
                        >
                            {image ? (
                                <FaTrash className="text-3xl text-white cursor-pointer" />
                            ) : (
                                <FaPlus className="text-3xl text-white cursor-pointer" />
                            )}
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                        name="profile-image"
                        accept=".svg,.png,.jpeg,.webp"
                    />
                </div>
            </div>

            {/* Input Fields, Color Picker, and Button (Right Side) */}
            <div className="flex flex-col items-start gap-6 w-full md:w-[60%]">
                {/* Input Fields */}
                <div className="w-full flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Email"
                        disabled
                        value={userInfo.email}
                        className="rounded-xl p-4 bg-red-400 border-none"
                    />
                    <input
                        type="text"
                        placeholder="First Name"
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}
                        className="rounded-xl p-4 bg-red-400 border-none"
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                        className="rounded-xl p-4 bg-red-400 border-none"
                    />
                </div>

                {/* Color Picker */}
                <div className="w-full flex justify-start items-center mt-5">
                    <div className="grid grid-cols-6 md:grid-cols-2 lg:grid-cols-8 gap-2 w-full">
                        {colors.map((color, index) => (
                            <div
                                key={index}
                                className={`rounded-full w-8 h-8 transition-all duration-300 cursor-pointer ${color} ${selectedColor === index ? 'outline outline-black/50 outline-3' : ''}`}
                                onClick={() => setSelectedColor(index)}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Save Button */}
                <div className="w-full flex justify-center mt-3 mb-0">
                    <button
                        className="bg-purple-800 hover:bg-purple-600 text-white py-4 px-8 rounded-xl transition-all duration-300"
                        onClick={saveChanges}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
