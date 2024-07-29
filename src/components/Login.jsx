import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authInstance from '../Appwrite/Auth';
import User from '../Appwrite/User';
import { setUserData, setUserProfile } from '../Store/authSlice';
import logoImg from '../assets/Logo.png';
import {DarkMode} from './index'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const session = await authInstance.login(email, password);
    if (session) {
      const userProfile = await User.getProfile(session.$id);
      dispatch(setUserData(session));
      dispatch(setUserProfile(userProfile));
      navigate('/profile');
    } else {
      setError('Invalid email and password.');
    }
  };

  return (
    <div className='max-w-lg w-full mx-auto px-6 text-black dark:text-white flex flex-col items-center gap-2'>
      <img className='w-8 mx-auto mb-8' src={logoImg} alt="Textoria" />
      <h2 className='text-xl'>Log in to Textoria</h2>
      <p className='text-gray-500 mb-4'>Don't Have an account? <span className='text-[#5047eb] active:text-[#3228e0] cursor-pointer hover:underline' onClick={() => navigate('/register')} >Sign up</span></p>
      {error && <p className='text-red-500 text-sm'>{error}</p>}
      <input 
        className='block w-full px-2 py-2 rounded-md border border-gray-500 dark:bg-[#171717] bg-gray-100 text-black dark:text-white'
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email" 
      />
      <div className='relative w-full'>
        <input 
          className='block w-full px-2 py-2 rounded-md border border-gray-500 dark:bg-[#171717] bg-gray-100 text-black dark:text-white'
          type={showPassword ? 'text' : 'password'}
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
        />
        <button 
          type="button"
          className='absolute inset-y-0 right-0 px-3 py-2 text-gray-500'
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      <button className='w-full py-2 rounded-md duration-300 font-medium bg-[#5047eb] active:bg-[#5047eb] text-white hover:bg-[#3228e0] mb-8' onClick={handleLogin}>Sign in with Email</button>
      <p className='max-w-sm px-6 text-sm text-gray-500 text-center'>By continuing you agree to our <u>Terms of Service</u> and <u>Privacy Policy</u></p>
      {/* <DarkMode /> */}
    </div>
  );
};

export default Login;
