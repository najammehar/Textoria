import React from 'react';
import {useNavigate } from 'react-router-dom';
import Logo from './Logo';
import Button from './Button';
import DarkMode from './DarkMode';
import logoImg from '../assets/Logo.png';


const Navbar1 = () => {

  const navigate = useNavigate();

  const handleLogoClick = () => {
    window.location.href = '/';  // This will cause a full page refresh
  };

  return (
    <>
      <header className='dark:text-white text-black'>
        <nav className='flex justify-between items-center max-w-[1280px] w-full px-6 mx-auto h-20'>
        <div onClick={handleLogoClick} className='flex items-baseline'>
        <img className='w-6 cursor-pointer sm:w-8' src={logoImg} alt="Logo Image" />
        <Logo className={'ml-[-4px] w-fit text-2xl sm:text-4xl cursor-pointer'}/>
        </div>
        <ul className='flex flex-row items-center gap-6'>
          <li><DarkMode className='w-7 h-7 flex items-center justify-center' dIcon='text-black hover:text-gray-500 ' lIcon='text-white hover:text-gray-500' /></li>
          <li className='cursor-pointer px-3 py-2 rounded-md duration-300 font-medium bg-[#5047eb] active:bg-[#5047eb] text-white hover:bg-[#3228e0]' onClick={() => navigate('/register')}>Get Started</li>
          <li className='cursor-pointer hidden sm:flex font-medium  hover:text-gray-500 active:text-current'  onClick={() => navigate('/login')}>Login</li>
        </ul>
        </nav>
      </header>
    </>
  );
};

export default Navbar1;
