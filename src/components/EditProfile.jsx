import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile as updateProfileAction } from '../Store/authSlice';
import { User } from '../Appwrite/User';
import defaultProfile from '../assets/default-profile.jpg';

const EditProfile = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector(state => state.auth.userProfile);
  const userData = useSelector(state => state.auth.userData);
  const userId = useSelector(state => state.auth.userData?.$id);
  const userService = new User();

  console.log("userProfile:", userProfile);
  console.log("userData:", userData);
  console.log("userId:", userId);

  const navigate = useNavigate();

  const [name, setName] = useState(userProfile?.name || '');
  const [about, setAbout] = useState(userProfile?.about || '');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(userProfile?.avatar ? `https://cloud.appwrite.io/v1/storage/buckets/${import.meta.env.VITE_APPWRITE_BUCKET_ID_P_IMAGE}/files/${userProfile.avatar}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}` : defaultProfile);
  const [error, setError] = useState('');

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    setAvatar(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(userProfile?.avatar ? `https://cloud.appwrite.io/v1/storage/buckets/${import.meta.env.VITE_APPWRITE_BUCKET_ID}/files/${userProfile.avatar}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}` : defaultProfile);
    }
  };

  const handleUpdate = async () => {
    if (!name) {
      setError("Name is required");
      return;
    }

    setError('');
    const updatedProfile = {
      name,
      about,
    };

    if (avatar) {
      if (userProfile.avatar) {
        await userService.deleteAvatar(userProfile.avatar);
      }
      const uploadedAvatar = await userService.uploadAvatar(avatar);
      if (uploadedAvatar) {
        updatedProfile.avatar = uploadedAvatar.$id;
      }
    }
    console.log("Updating profile for user:", userId);
    const result = await userService.updateProfile(userId, updatedProfile);
    if (result) {
      dispatch(updateProfileAction(result));
      navigate(-1);
    }
  };

  const isDisabled = !name;

  return (
    <div className='max-w-lg w-full mx-auto px-6 text-black dark:text-white flex flex-col items-center gap-2'>
      <div className='mb-4 flex flex-col items-center mt-8'>
        <div className='w-64 h-64 rounded-full overflow-hidden bg-gray-200 mb-2'>
          <img src={avatarPreview} alt="Avatar preview" className='w-full h-full object-cover' />
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
        className={`w-full py-2 rounded-md duration-300 font-medium ${
          isDisabled
            ? 'bg-[#5047eb] cursor-not-allowed'
            : 'bg-[#5047eb] active:bg-[#5047eb] text-white hover:bg-[#3228e0]'
        } mt-4 `}
        onClick={handleUpdate}
        disabled={isDisabled}
      >
        Update Profile
      </button>
      <button className='w-full py-2 rounded-md border border-[#5047eb] text-[#5047eb] hover:text-[#3228e0] hover:border-[#3228e0] hover:bg-gray-100 duration-300' onClick={() => navigate(-1)}>Cancel</button>
    </div>
  );
};

export default EditProfile;