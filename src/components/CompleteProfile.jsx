import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import user, {User} from '../Appwrite/User';
import { login, setUserData, setUserProfile } from '../Store/authSlice';
import authInstance from '../Appwrite/Auth';
import { Oval } from 'react-loader-spinner';

import defaultProfile from '../assets/default-profile.jpg';

const CompleteProfile = () => {
  const { userId } = useParams();
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState('');
  const userService = new User();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
      const userProfile = userService.getProfile(userId)
      .then(userProfile => userProfile ? setName(userProfile.name) : null)
  },[]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  const handleCompleteProfile = async () => {
    if (!name) {
      setError("Name is required");
      return;
    }

    setError('');
    setLoading(true);
    const avatarFile = avatar ? await userService.uploadAvatar(avatar) : null;
    const userProfile = {
      name,
      about,
      avatar: avatarFile ? avatarFile.$id : null,
    };

    const result = await userService.updateProfile(userId, userProfile);
    if (result) {
      const userData = await authInstance.getUser();
      dispatch(setUserData(userData));
      dispatch(setUserProfile(result));
      navigate('/');
    }
    setLoading(false);
  };
  const handleSkip = async () => {
    const result = await userService.getProfile(userId);
    if (result) {
      const userData = await authInstance.getUser();
      dispatch(setUserData(userData));
      dispatch(setUserProfile(result));
      navigate('/');
    }
  }



  return (
    <div className='max-w-lg w-full mx-auto px-6 text-black dark:text-white flex flex-col items-center gap-2'>      
      {/* Avatar preview and input */}
      <div className='mb-4 flex flex-col items-center mt-8'>
        <div className='w-64 h-64 rounded-full overflow-hidden bg-gray-200 mb-2'>
        {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar preview" className='w-full h-full object-cover' />
          ) : (
            <img src={defaultProfile} alt="Avatar preview" className='w-full h-full object-cover' />
          )}
        </div>
        <label className='cursor-pointer bg-[#5047eb] hover:bg-[#3228e0] text-white py-2 px-4 rounded-md'>
          <span>Choose Profile Picture</span>
          <input 
            type="file" 
            className='hidden'
            onChange={handleAvatarChange} 
            accept="image/*"
          />
        </label>
      </div>

      {error && <p className='text-red-500 mb-4'>{error}</p>}
      <input 
        className='block w-full px-2 py-2 rounded-md border border-gray-500 dark:bg-[#171717] bg-gray-100 text-black dark:text-white'
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Name" 
        required 
      />
      <textarea 
        className='block h-40 w-full px-2 py-2 rounded-md border border-gray-500 dark:bg-[#171717] bg-gray-100 text-black dark:text-white'
        value={about} 
        onChange={(e) => setAbout(e.target.value)} 
        placeholder="About" 
      />
      <button 
        className={`w-full py-2 rounded-md duration-300 font-medium bg-[#5047eb] active:bg-[#5047eb] text-white hover:bg-[#3228e0] mt-4 `}
        onClick={handleCompleteProfile}
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
        ) : "Complete Profile"}
      </button>
      <button className='w-full py-2 rounded-md border border-[#5047eb] text-[#5047eb] hover:text-[#3228e0] hover:border-[#3228e0] hover:bg-gray-100 duration-300' onClick={handleSkip}>Skip For Now</button>
    </div>
  );
};

export default CompleteProfile;