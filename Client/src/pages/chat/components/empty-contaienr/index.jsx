import React from 'react'
import Lottie from 'lottie-react'
import animationData from "@/assets/lottie-json/loading.json";

const EmptyContainer = () => {
  return (
    <div className='md:flex flex-1 flex-col items-center hidden w-full bg-black/90 duration-1000 transition-all justify-center'>        
        <Lottie
         isClickToPauseDisabled={true}
         height={260}
         width={260}
         animationData={animationData}
        />        
        <h3 className='poppins-medium'>
            HI<span className='text-purple-600'>!</span> Welcom to Talk Wave Chat App
        </h3>
    </div>
  )
}

export default EmptyContainer