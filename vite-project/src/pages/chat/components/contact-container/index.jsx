import React from 'react'
import animationData from "@/assets/lottie-json/logo.json";
import Lottie from 'lottie-react';
  import ProfileInfo from './components/profile-info';
import NewDm from './components/new-dm';

const ContactContainer = () => {
  return (
    <div className='md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-black/90 border-r-2 border-[#2F303b] relative w-full h-[100vh]'>
      <div className='flex gap-2 mt-0 justify-start items-center w-full h-12'>
        <div>
          <Lottie
            isClickToPauseDisabled={true}
            style={{ height: '50px', width: '50px' }}
            animationData={animationData}
            /> 
        </div>       
        <div>
        ContectContainer            
        </div>        
      </div>
      <div className='my-5'>
          <div className='pr-10 items-center flex justify-between'>
            <Title text="Direct Messages"/>
            <NewDm/>
          </div>
      </div>
      <div className='my-5'>
          <div className='pr-10 items-center flex justify-between'>
            <Title text="Channels"/>
          </div>
      </div>                
      <ProfileInfo/>
    </div>
  )
}

export default ContactContainer


const Title = ({ text })=> {
  return  <div className='uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm'>
    { text }
  </div>
}