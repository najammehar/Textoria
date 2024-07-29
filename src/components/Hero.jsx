import React from 'react'
import { useNavigate } from 'react-router-dom'

function Hero() {
    const navigate = useNavigate();
  return (
    <>
            <section className='dark:text-white text-black'>
                <div 
                className='h-screen -mt-20 max-w-[800px] px-6 w-full mx-auto text-center flex flex-col justify-center gap-2' 
                >
                    <h2 className='text-xl sm:text-4xl font-semibold'>Exploring Thoughts & Learning</h2>
                    <p className='text-xs sm:text-xl font-normal'>Dive into a world of ideas and knowledge by reading and sharing articles on our dynamic community platform.</p>
                    <button className='max-w-[150px] sm:max-w-[200px] w-full mx-auto py-3 mt-4 text-white bg-[#5047eb] rounded-md hover:bg-[#3228e0] active:bg-[#5047eb]' onClick={() => navigate('/register')} >Get Started</button>
                    <div className='mx-auto cursor-pointer sm:hidden flex font-medium  hover:text-gray-500 active:text-current underline'  onClick={() => navigate('/login')}>Login</div>
                </div>
                
            </section>
    </>
  )
}

export default Hero