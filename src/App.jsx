import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, setUserData, setUserProfile } from './Store/authSlice';
import authInstance from './Appwrite/Auth';
import CompleteProfile from './components/CompleteProfile';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import user from './Appwrite/User';
import { EditPost, Home, LandingPage, Login, SignUp, Feed, WritePost } from './pages';
import { FAQs, PostDetail, Sidebar, WriteEditPost } from './components';
import Logo from './assets/Logo.png';


const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useSelector(state => state.auth.status);
  const [theme, setTheme] = useState('light')
  
  useEffect(() => {
    
    if(theme === 'dark') 
      document.documentElement.classList.add('dark')
    else
      document.documentElement.classList.remove('dark')
    }, [theme])

    const toggleDarkMode = () => {
      setTheme(theme === 'dark' ? 'light' : 'dark')
    }

  //     const fetchUserData = async () => {
  //         try {
  //             const userData = await authInstance.getUser();
  //             if (userData) {
  //                 dispatch(setUserData(userData));
  //                 return userData;
  //             } else {
  //                 dispatch(logout());
  //                 return null;
  //             }
  //         } catch (error) {
  //             console.error('Error fetching user data:', error);
  //             dispatch(logout());
  //             return null;
  //         }
  //     };
  
  //     const fetchUserProfile = async (userData) => {
  //         if (userData) {
  //             try {
  //                 const userProfile = await user.getProfile(userData.$id);
  //                 if (userProfile) {
  //                     dispatch(setUserProfile(userProfile));
  //                 }
  //             } catch (error) {
  //                 console.error('Error fetching user profile:', error);
  //             } finally {
  //                 setLoading(false);
  //             }
  //         } else {
  //             setLoading(false);
  //         }
  //     };
  
  //     fetchUserData().then(userData => {
  //         if (userData) {
  //             fetchUserProfile(userData);
  //         }
  //     });
  
  // }, [dispatch]);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        // First, check if there's an active session
        const session = await authInstance.account.getSession('current');
        
        if (session) {
          // If there's an active session, fetch user data
          const userData = await authInstance.getUser();
          
          if (userData) {
            dispatch(setUserData(userData));
            
            // Fetch user profile
            try {
              const userProfile = await user.getProfile(userData.$id);
              if (userProfile) {
                dispatch(setUserProfile(userProfile));
              }
            } catch (profileError) {
              console.error('Error fetching user profile:', profileError);
            }
          } else {
            dispatch(logout());
          }
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error('Error in auth check or data fetching:', error);
        if (error.code === 401) {
        }
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };
  
    checkAuthAndFetchData();
  }, [dispatch]);

  return !loading ? (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <SignUp />} />
        <Route path="/complete-profile/:userId" element={<CompleteProfile />} />
        
        {/* Authenticated routes */}
        <Route path="/" element={isAuthenticated ? <Home /> : <LandingPage />}>
          <Route index element={<Feed />} />
          <Route path="write" element={<WritePost />} />
          <Route path="profile/:userId" element={<Profile />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="/post/:postId" element={<PostDetail />} />
          <Route path="/edit-post/:postId" element={<EditPost />} />
          <Route path="help-and-support" element={<FAQs />} />

        </Route>
      </Routes>
    </Router>
  ) : (<>
    <div className="flex flex-col items-center justify-center gap-4 h-screen bg-[#000300]">
                <img className='w-16 h-16' src={Logo} alt="Textoria" />
                <h1 className='text-purple-60 text-3xl font-bold' >Textoria</h1>
    </div>
  </>);
};

export default App;
