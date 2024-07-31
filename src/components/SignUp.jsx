import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authInstance from '../Appwrite/Auth';
import logoImg from '../assets/Logo.png';
import { Oval } from 'react-loader-spinner';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleRegister = async () => {
    if(!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);

    const user = await authInstance.register(name, email, password);
    if(user === 'email') {
      setError('Account with this Email already exists');
    } else if (user) {
      navigate(`/complete-profile/${user.$id}`);
    }
    setLoading(false);
  };

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
      className={`w-full py-2 rounded-md duration-300 font-medium bg-[#5047eb] ${loading ? 'opacity-50' : 'active:bg-[#5047eb]'} text-white hover:bg-[#3228e0] mb-8`}
      onClick={handleRegister}
      disabled={loading}
      >
        {loading ? (
          <div className='flex items-center justify-center'>
            <Oval
              visible={true}
              height="24"
              width="24"
              strokeWidth="4"
              color="white"
              secondaryColor='#d8d6fa'
              ariaLabel="oval-loading"
            />
          </div>
        ) : "Sign up with email"}
      </button>

      <p className='max-w-sm px-6 text-sm text-gray-500 text-center'>By continuing you agree to our <u>Terms of Service</u> and <u>Privacy Policy</u></p>
    </div>
  );
};

export default SignUp;
