import React, {useEffect, useState, useRef} from 'react'
import Logo from './Logo';
import logoImg from '../assets/Logo.png';
import DarkMode from './DarkMode';
import { BiChevronRight } from 'react-icons/bi';
import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import User from '../Appwrite/User';
import defaultProfile from '../assets/default-profile.jpg';
import { logout } from '../Store/authSlice';
import authInstance from '../Appwrite/Auth';
import {AiOutlineClose, AiOutlineMenu} from 'react-icons/ai'

function Sidebar() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const user = useSelector(state => state.auth.userProfile);
    const [profile, setProfile] = useState('');
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        if(user.avatar) {
            const profile = User.getAvatarUrl(user.avatar);
            if (profile) {
                setProfile(profile);
            }
        } else {
            setProfile(defaultProfile);
        }
    },[])
    const handleLogout = async () => {
        try {
          await authInstance.logout();
          dispatch(logout());
          navigate('/');
        } catch (err) {
          console.error('Logout failed:', err);
        }
      };
      const handleLogoClick = () => {
        window.location.href = '/';
       };


  return (
    <>
        <aside className={`hidden sm:block h-screen ${open ? "w-72" : "w-20"} dark:bg-grey-10 border-r border-grey-25 bg-grey-90 fixed duration-300 px-5 top-0 left-0 z-50`}>
          <div
          className={`absolute cursor-pointer -right-3 bottom-2/4 p-1 border-purple-60 dark:text-white dark:bg-grey-10  bg-grey-90
          border-2 rounded-full flex items-center justify-center  ${open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
          ><BiChevronRight />
          </div>
            <div className='flex items-center h-20'>
                <Link
                to="/"
                className='flex items-baseline px-1'>
                    <img onClick={handleLogoClick} className='w-6 sm:w-8' src={logoImg} alt="Logo Image" />
                    <Logo onClick={handleLogoClick} className={`ml-[-4px] w-fit text-2xl sm:text-4xl cursor-pointer ${!open && "hidden"}`}/>
                </Link>
            </div>
            <ul>
                <li className='group'>
                    <NavLink
                    title='Home'
                    to="/"
                    className={({ isActive }) => ` flex items-center gap-x-2 px-1 py-1 mb-4 dark:text-white text-sm ${isActive ? " text-white  bg-purple-60" : ""} dark:hover:bg-grey-25 hover:bg-gray-500 hover:text-white rounded-md`}
                    >
                    {({ isActive }) =>  (
                    <>
                    <div><svg className={`fill-gray-500 group-hover:fill-white ${isActive ? "fill-white" : ""}`} xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="white"><path d="M226.67-186.67h140v-246.66h226.66v246.66h140v-380L480-756.67l-253.33 190v380ZM160-120v-480l320-240 320 240v480H526.67v-246.67h-93.34V-120H160Zm320-352Z"/></svg></div>
                    <div className={`${!open && "scale-0"} mt-1`}>Home</div>
                    </>
                    )}
                    </NavLink>
                    
                </li>
                <li className='group'>
                    <NavLink
                    title='Write'
                    to="/write"
                    className={({ isActive }) => ` flex items-center gap-x-2 px-1 py-1 mb-4 dark:text-white text-sm ${isActive ? " text-white  bg-purple-60" : ""} dark:hover:bg-gray-800 hover:bg-gray-500 hover:text-white rounded-md`}
                    >
                    {({ isActive }) =>  (
                    <>
                        <div><svg className={`fill-gray-500 group-hover:fill-white ${isActive ? "fill-white" : ""}`} xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="30px" fill="white"><path d="M160-406.67v-66.66h293.33v66.66H160ZM160-570v-66.67h460V-570H160Zm0-163.33V-800h460v66.67H160ZM520-160v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8.67 9 12.83 20 4.17 11 4.17 22t-4.33 22.5q-4.34 11.5-13.28 20.5L643-160H520Zm300-263-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z"/></svg></div>
                        <div className={`${!open && "scale-0"}`}>Write</div>
                    </>
                    )}
                    </NavLink>
                </li>
                <li className='group'>
                    <NavLink
                    title='Help & Support'
                    to="/help-and-support"
                    className={({ isActive }) => ` flex items-center gap-x-2 px-1 py-1 mb-4 dark:text-white text-sm ${isActive ? " text-white  bg-purple-60" : ""} dark:hover:bg-gray-800 hover:bg-gray-500 hover:text-white rounded-md`}
                    >
                    {({ isActive }) =>  (
                    <>
                        <div><svg className={`fill-gray-500 group-hover:fill-white ${isActive ? "fill-white" : ""}`} xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#e8eaed"><path d="M482-244.67q17.67 0 29.83-12.16Q524-269 524-286.67q0-17.66-12.17-29.83-12.16-12.17-29.83-12.17-17.67 0-29.83 12.17Q440-304.33 440-286.67q0 17.67 12.17 29.84 12.16 12.16 29.83 12.16Zm-35.33-148.66h64q0-28.34 6.83-49 6.83-20.67 41.17-50.34 29.33-26 43-50.5 13.66-24.5 13.66-55.5 0-54-36.66-85.33-36.67-31.33-93.34-31.33-51.66 0-88.5 26.33Q360-662.67 344-620l57.33 22q9-24.67 29.5-42t52.5-17.33q33.34 0 52.67 18.16 19.33 18.17 19.33 44.5 0 21.34-12.66 40.17-12.67 18.83-35.34 37.83-34.66 30.34-47.66 54-13 23.67-13 69.34ZM480-80q-82.33 0-155.33-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.67T80-480q0-83 31.5-156t85.83-127q54.34-54 127.34-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82.33-31.5 155.33-31.5 73-85.5 127.34Q709-143 636-111.5T480-80Zm0-66.67q139.33 0 236.33-97.33t97-236q0-139.33-97-236.33t-236.33-97q-138.67 0-236 97-97.33 97-97.33 236.33 0 138.67 97.33 236 97.33 97.33 236 97.33ZM480-480Z"/></svg></div>
                        <div className={`${!open && "scale-0"}`}>Help</div>
                    </>
                    )}
                    </NavLink>
                </li>
                <li className='group'>
                    <div
                    title='Logout'
                    onClick={handleLogout}
                    className={`cursor-pointer flex items-center gap-x-2 px-1 py-1 mb-4 dark:text-white text-sm dark:hover:bg-gray-800 hover:bg-gray-500 hover:text-white rounded-md`}
                    >
                        <div><svg className={`fill-gray-500 group-hover:fill-white`} xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#e8eaed"><path d="M186.67-120q-27 0-46.84-19.83Q120-159.67 120-186.67v-586.66q0-27 19.83-46.84Q159.67-840 186.67-840h292.66v66.67H186.67v586.66h292.66V-120H186.67Zm470.66-176.67-47-48 102-102H360v-66.66h351l-102-102 47-48 184 184-182.67 182.66Z"/></svg></div>                        
                        <div className={`${!open && "scale-0"}`}>Logout</div>
                    </div>
                </li>
                <li className='group w-full'>
                    <NavLink
                    title='Profile'
                    to={`/profile/${user.$id}`}
                    className={({ isActive }) => ` flex items-center gap-x-2 px-1 py-1 dark:text-white text-sm ${isActive ? "dark:bg-grey-25 bg-gray-500" : ""} dark:hover:bg-grey-25 hover:bg-gray-500 hover:text-white rounded-md absolute bottom-5 ${open ? "w-[248px]" : "w-[40px]"}`}
                    >
                    {({ isActive }) =>  (
                    <>
                    <div className={`w-8 h-8 rounded-full overflow-hidden `}><img className='w-full h-full object-cover' src={profile} alt="Profile" /></div>
                    {open && <div>
                            <div className={`${!open && "scale-0"} mt-1`}>{user.name}</div>
                            <div className={`${!open && "scale-0"} text-xs text-gray-500`}>{user.email}</div>
                            </div>
                    }
                    </>
                    )}
                    </NavLink>
                </li>
                <li className='group w-full'>
                    <div
                    className={` flex items-center gap-x-2 px-1 py-1 dark:text-white text-sm dark:hover:bg-grey-25 hover:bg-gray-500 hover:text-white rounded-md absolute bottom-20 ${open ? "w-[248px]" : "w-[40px]"}`}
                    >
                        <DarkMode className='w-8 h-8 flex items-center justify-center' dIcon='dark:text-black' lIcon='text-white' />
                    {open && <div className={`${!open && "scale-0"}`}>Appearance</div>}
                    </div>
                </li>
                
                
            </ul>
        </aside>
        <nav className='sticky sm:hidden dark:text-white flex h-16 items-center border-b border-grey-45 px-4 justify-between'>
        <Link
                to="/"
                className='flex items-baseline px-1'>
                    <img className='w-6 sm:w-8 cursor-pointer' src={logoImg} alt="Logo Image" />
                    <Logo className={`ml-[-4px] w-fit text-2xl cursor-pointer`}/>
                </Link>
        <AiOutlineMenu className='cursor-pointer' size={24} onClick={() => setIsOpen(true)} />
        </nav>


        {isOpen && (
            <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={() => setIsOpen(false)}></div>
        )}
        <div  className={` ${isOpen? "dark:text-white px-4 dark:bg-grey-10 bg-grey-90 fixed bottom-0 w-full rounded-t-xl z-50 ease-in-out duration-500" : "ease-in-out duration-500 fixed w-full bottom-[-100%]"} `}>
            <div className='group w-full my-6'>
                    <NavLink
                    title='Profile'
                    onClick={() => setIsOpen(false)}
                    to={`/profile/${user.$id}`}
                    className={({ isActive }) => ` flex items-center gap-x-2 text-sm ${isActive ? "text-purple-60 font-bold" : "dark:text-white text-black"}`}
                    >
                    <div className={`w-10 h-10 rounded-full overflow-hidden `}><img className='w-full h-full object-cover' src={profile} alt="Profile" /></div>
                    <div>
                    <div className={`mt-1`}>{user.name}</div>
                    <div className={`text-xs text-gray-500`}>{user.email}</div>
                    </div>
                    

                    </NavLink>
            </div>
            <hr className='border-grey-45' />
            <div className='group my-4 w-full'>
                    <NavLink
                    onClick={() => setIsOpen(false)}
                    to="/"
                    className={({ isActive }) => ` flex items-center gap-x-2 text-sm ${isActive ? "text-purple-60 font-bold" : "dark:text-white text-black"}`}
                    >
                    {({ isActive }) =>  (
                    <>
                    <div><svg className={`${isActive ? "fill-purple-60" : "dark:fill-white fill-black"}`} xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="white"><path d="M226.67-186.67h140v-246.66h226.66v246.66h140v-380L480-756.67l-253.33 190v380ZM160-120v-480l320-240 320 240v480H526.67v-246.67h-93.34V-120H160Zm320-352Z"/></svg></div>
                    <div className={`mt-1`}>Home</div>
                    </>
                    )}
                    </NavLink>
                    
            </div>
            <div className='group my-4 w-full'>
                    <NavLink
                    onClick={() => setIsOpen(false)}
                    to="/write"
                    className={({ isActive }) => ` flex items-center gap-x-2 text-sm ${isActive ? "text-purple-60 font-bold" : "dark:text-white text-black"}`}
                    >
                    {({ isActive }) =>  (
                    <>
                        <div><svg className={`${isActive ? "fill-purple-60" : "dark:fill-white fill-black"}`} xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="white"><path d="M160-406.67v-66.66h293.33v66.66H160ZM160-570v-66.67h460V-570H160Zm0-163.33V-800h460v66.67H160ZM520-160v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8.67 9 12.83 20 4.17 11 4.17 22t-4.33 22.5q-4.34 11.5-13.28 20.5L643-160H520Zm300-263-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z"/></svg></div>
                        <div className={`mt-1`}>Write</div>
                    </>
                    )}
                    </NavLink>
                    
            </div>
            <div className='group my-4 w-full'>
                    <NavLink
                    onClick={() => setIsOpen(false)}
                    to="/help-and-support"
                    className={({ isActive }) => ` flex items-center gap-x-2 text-sm ${isActive ? "text-purple-60 font-bold" : "dark:text-white text-black"}`}
                    >
                    {({ isActive }) =>  (
                    <>
                        <div><svg className={`${isActive ? "fill-purple-60" : "dark:fill-white fill-black"}`} xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#e8eaed"><path d="M482-244.67q17.67 0 29.83-12.16Q524-269 524-286.67q0-17.66-12.17-29.83-12.16-12.17-29.83-12.17-17.67 0-29.83 12.17Q440-304.33 440-286.67q0 17.67 12.17 29.84 12.16 12.16 29.83 12.16Zm-35.33-148.66h64q0-28.34 6.83-49 6.83-20.67 41.17-50.34 29.33-26 43-50.5 13.66-24.5 13.66-55.5 0-54-36.66-85.33-36.67-31.33-93.34-31.33-51.66 0-88.5 26.33Q360-662.67 344-620l57.33 22q9-24.67 29.5-42t52.5-17.33q33.34 0 52.67 18.16 19.33 18.17 19.33 44.5 0 21.34-12.66 40.17-12.67 18.83-35.34 37.83-34.66 30.34-47.66 54-13 23.67-13 69.34ZM480-80q-82.33 0-155.33-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.67T80-480q0-83 31.5-156t85.83-127q54.34-54 127.34-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82.33-31.5 155.33-31.5 73-85.5 127.34Q709-143 636-111.5T480-80Zm0-66.67q139.33 0 236.33-97.33t97-236q0-139.33-97-236.33t-236.33-97q-138.67 0-236 97-97.33 97-97.33 236.33 0 138.67 97.33 236 97.33 97.33 236 97.33ZM480-480Z"/></svg></div>
                        <div className={`mt-1`}>Help & Support</div>
                    </>
                    )}
                    </NavLink>
                    
            </div>
            <div className='group cursor-pointer mt-4 mb-6 w-full'>
                    <div
                    onClick={handleLogout}
                    className={` flex items-center gap-x-2 text-sm `}
                    >
                        <div><svg className={`dark:fill-white fill-black`} xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#e8eaed"><path d="M186.67-120q-27 0-46.84-19.83Q120-159.67 120-186.67v-586.66q0-27 19.83-46.84Q159.67-840 186.67-840h292.66v66.67H186.67v586.66h292.66V-120H186.67Zm470.66-176.67-47-48 102-102H360v-66.66h351l-102-102 47-48 184 184-182.67 182.66Z"/></svg></div>                        
                        <div className={`mt-1`}>Logout</div>
                    
                    </div>
                    
            </div>
            <hr className='border-grey-45' />
            <div className='group my-6 w-full cursor-pointer'>
                    <div
                    className={` flex items-center gap-x-2 text-sm `}
                    >
                        <DarkMode className='w-8 h-8 flex items-center justify-center' dIcon='dark:text-black' lIcon='text-white' />
                        <div>Appearance</div>
                    </div>
            </div>
            <hr className='border-grey-45' />
            <div className='group my-6 w-full px-1'>
            <p className='text-xs font-medium '>© 2024 All rights reserved</p>
            <p className='text-xs font-normal'>Developed by <Link target='_blank' to={'https://www.linkedin.com/in/najam-ul-hassan-65b92a250/'} className='underline hover:text-[#5047eb] active:text-[#8680ff] cursor-pointer'>Najam Ul Hassan</Link></p>
            </div>
            <div className='absolute cursor-pointer top-7 right-4'>
                <AiOutlineClose size={24} onClick={() => setIsOpen(false)} />
            </div>
        </div>
    </>
  )
}

export default Sidebar