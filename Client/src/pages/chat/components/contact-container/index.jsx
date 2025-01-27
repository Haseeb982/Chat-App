import React, { useEffect } from 'react';
import animationData from '@/assets/lottie-json/logo.json';
import Lottie from 'lottie-react';
import ProfileInfo from './components/profile-info';
import NewDm from './components/new-dm';
import { apiClient } from '@/lib/api-client';
import {
  GET_DM_MESSAGES_ROUTES,
  GET_USER_CHANNEL_ROUTES,
} from '@/utiles/constant';
import { useAuthStore } from '@/store';
import ContactList from '@/components/contact-list';
import CreateChannel from './components/create-group';

const ContactContainer = () => {
  const {
    SetSelectedDirectMessagesContact,
    SelectedDirectMessagesContact,
    channels,
    SetChannel,
  } = useAuthStore();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.get(GET_DM_MESSAGES_ROUTES, {
          withCredentials: true,
        });
        console.log('messages of frontend', response.data.contacts);
        if (response.data.contacts) {
          SetSelectedDirectMessagesContact(response.data.contacts);
        }
      } catch (error) {
        console.log('API COnnection of file contactContainer:', error.message);
      }
    };

    const getChannels = async () => {
      try {
        const response = await apiClient.get(GET_USER_CHANNEL_ROUTES, {
          withCredentials: true,
        });
        console.log('front response', response);
        if (response.data.channels) {
          SetChannel(response.data.channels);
        }
      } catch (error) {
        console.log('error in api connection of channel:', error.message);
      }
    };

    getChannels();
    getMessages();
  }, [SetSelectedDirectMessagesContact, SetChannel]);

  return (
    <div className="md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-black/90 border-r-2 border-[#2F303b] relative w-full h-[100vh]">
      <div className="flex gap-2 mt-0 justify-start items-center w-full h-12">
        <div>
          <Lottie
            isClickToPauseDisabled={true}
            style={{ height: '50px', width: '50px' }}
            animationData={animationData}
          />
        </div>  
        <div>Talk Wave</div>
      </div>
      <div className="my-5">
        <div className="pr-10 items-center flex justify-between">
          <Title text="Direct Messages" />
          <NewDm />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
            <ContactList contacts={SelectedDirectMessagesContact} />
          </div>
        </div>
      </div>
      <div className="my-5">
        <div className="pr-10 items-center flex justify-between">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          {Array.isArray(channels) && (
            <ContactList contacts={channels} isChannel={true} />
          )}
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactContainer;

const Title = ({ text }) => {
  return (
    <div className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </div>
  );
};
