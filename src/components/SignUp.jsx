import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authInstance from '../Appwrite/Auth';
import logoImg from '../assets/Logo.png';
import { useDispatch } from "react-redux";
import { setUserData, setUserProfile } from "../Store/authSlice";

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    const user = await authInstance.register(name, email, password);
    
    if (user) {
      navigate(`/complete-profile/${user.$id}`);
    }
  };

  const isDisabled = !name || !email || !password || error;

  return (
    <div className='max-w-lg w-full mx-auto px-6 text-black dark:text-white flex flex-col items-center gap-2'>
      <img className='w-8 mx-auto mb-8' src={logoImg} alt="Textoria" />
      <h2 className='text-xl'>Sign up to Textoria</h2>
      <p className='text-gray-500 mb-4'>Already have an account? <span className='text-[#5047eb] active:text-[#3228e0] cursor-pointer hover:underline' onClick={() => navigate('/login')} >Sign in</span></p>
      {error && <p className='text-red-500 text-sm'>{error}</p>}

        <input 
            className='block w-full px-2 py-2 rounded-md border border-gray-500 dark:bg-[#171717] bg-gray-100 text-black dark:text-white'
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Name"
        />
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
      <button 
      className={`w-full py-2 rounded-md duration-300 font-medium ${
        isDisabled
          ? 'bg-[#5047eb] cursor-not-allowed'
          : 'bg-[#5047eb] active:bg-[#5047eb] text-white hover:bg-[#3228e0]'
      } mb-8`}
      onClick={handleRegister}>Register</button>
      <p className='max-w-sm px-6 text-sm text-gray-500 text-center'>By continuing you agree to our <u>Terms of Service</u> and <u>Privacy Policy</u></p>
    </div>
  );
};

export default SignUp;
