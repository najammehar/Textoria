import React from 'react'
import { Link } from 'react-router-dom'

function Footer1() {
  return (
    <footer className='w-full px-6 text-center dark:text-white text-black h-20 -mt-20 border-t border-t-gray-500 flex flex-col justify-center'>
            <p className='text-sm font-medium mb-1'>© 2024 All rights reserved</p>
            <p className='text-xs font-normal'>Developed by <Link target='_blank' to={'https://www.linkedin.com/in/najam-ul-hassan-65b92a250/'} className='underline hover:text-[#5047eb] active:text-[#8680ff] cursor-pointer'>Najam Ul Hassan</Link></p>
    </footer>
  )
}

export default Footer1