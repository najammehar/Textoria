import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import authInstance from "../Appwrite/Auth";
import { logout } from "../Store/authSlice";
import user from "../Appwrite/User";
import post from "../Appwrite/Post";
import defaultProfile from "../assets/default-profile.jpg";
import PostFeed from "./PostFeed";

const Profile = () => {
  const { userId } = useParams();
  const currentUser = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isCurrentUser = currentUser && currentUser.$id === userId;

  const fetchProfileData = useCallback(async () => {
    try {
      const fetchedProfile = await user.getProfile(userId);
      setProfileData(fetchedProfile);
      if (fetchedProfile.avatar) {
        const url = user.getAvatarUrl(fetchedProfile.avatar);
        setAvatarUrl(url);
      }
    } catch (err) {
      setError("Failed to load profile data");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const [postCount, setPostCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);

  // Get number of posts user has made
  const fetchPostCount = async () => {
    try {
      const posts = await post.PostsCountByUser(userId, "public");
      setPostCount(posts.length);
      const likes = posts.reduce((acc, post) => acc + post.likes, 0);
      setLikeCount(likes);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchPostCount();
  }, [fetchProfileData]);

  const handleLogout = async () => {
    try {
      await authInstance.logout();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    fetchProfileData();
    fetchPostCount();
  }, [fetchProfileData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!profileData) return <div>Profile not found</div>;

  return (
    <div className=" max-w-5xl mx-auto px-6 pt-7 mb-7 dark:text-white text-black">
      <div className="relative max-w-3xl mx-auto flex items-center gap-6 sm:gap-12 pb-0 sm:pb-12">
        <img
          src={avatarUrl || defaultProfile}
          alt={`${profileData.name}'s Avatar`}
          className="w-20 h-20 sm:w-40 sm:h-40 rounded-full mb-1 sm:mb-4"
        />
        <div className="sm:hidden">
        <div className="flex gap-8">
            <p className="mb-2 text-center font-semibold flex flex-col ">
              <b>{postCount}</b> <span className="font-normal -mt-1">posts</span>
            </p>
            <p className="mb-2 text-center font-semibold flex flex-col ">
              <b>{likeCount}</b> <span className="font-normal -mt-1">likes</span>
            </p>
          </div>
        </div>

        <div className="hidden sm:block">
          <h1 className="text-2xl font-bold mb-2">{profileData.name}</h1>
          <div className="flex gap-8">
            <p className="mb-2 font-semibold">
              <b>{postCount}</b> posts
            </p>
            <p className="mb-2 font-semibold">
              <b>{likeCount}</b> likes
            </p>
          </div>
          <p className="mb-4">
            {profileData.about}
          </p>
        </div>
        {isCurrentUser && (
          <>
          <div className="hidden absolute top-0 right-0 sm:flex justify-center space-x-4">
            <button
              onClick={() => navigate("/edit-profile")}
              title="Edit Profile"
              className="px-1 py-1 rounded-lg bg-gray-500 hover:bg-purple-60 active:bg-blue"
            >
              <svg
                className="fill-white"
                xmlns="http://www.w3.org/2000/svg"
                height="32px"
                viewBox="0 -960 960 960"
                width="32px"
                fill="white"
              >
                <path d="M186.67-186.67H235L680-631l-48.33-48.33-445 444.33v48.33ZM120-120v-142l559.33-558.33q9.34-9 21.5-14 12.17-5 25.5-5 12.67 0 25 5 12.34 5 22 14.33L821-772q10 9.67 14.5 22t4.5 24.67q0 12.66-4.83 25.16-4.84 12.5-14.17 21.84L262-120H120Zm652.67-606-46-46 46 46Zm-117 71-24-24.33L680-631l-24.33-24Z" />
              </svg>
            </button>
            <button
              onClick={handleLogout}
              title="Logout"
              className=" px-1 py-1 rounded-lg bg-gray-500 hover:bg-purple-60 active:bg-blue"
            >
              <svg
                className="fill-white"
                xmlns="http://www.w3.org/2000/svg"
                height="32px"
                viewBox="0 -960 960 960"
                width="32px"
                fill="#e8eaed"
              >
                <path d="M186.67-120q-27 0-46.84-19.83Q120-159.67 120-186.67v-586.66q0-27 19.83-46.84Q159.67-840 186.67-840h292.66v66.67H186.67v586.66h292.66V-120H186.67Zm470.66-176.67-47-48 102-102H360v-66.66h351l-102-102 47-48 184 184-182.67 182.66Z" />
              </svg>
            </button>
          </div>
          </>
        )}
      </div>
      <div className="sm:hidden">
      <h1 className="text-2xl font-bold mb-1">{profileData.name}</h1>
      <p className="mb-4">
        {profileData.about}
      </p>
      </div>
      {isCurrentUser && (
      <div className="sm:hidden flex gap-2 mb-8">
            <button onClick={() => navigate("/edit-profile")} className="px-2 py-1 dark:bg-grey-10 rounded-md w-1/2 bg-grey-90 dark:hover:bg-grey-25 hover:bg-grey-75 ">Edit Profile</button>
            <button onClick={handleLogout} className="px-2 py-1 dark:bg-grey-10 rounded-md w-1/2 bg-grey-90 dark:hover:bg-grey-25 hover:bg-grey-75 ">Logout</button>
      </div>
      )}
      <div className="flex max-w-3xl mx-auto">
        <h2
          onClick={() => setActiveTab("posts")}
          className={`text-xl font-bold border-b-2 ${
            activeTab === "posts"
              ? "dark:border-b-gray-100 border-b-gray-900"
              : "border-b-gray-500"
          } ${
            isCurrentUser ? "w-1/2" : "w-full"
          } text-center cursor-pointer duration-300`}
        >
          Posts
        </h2>
        {isCurrentUser && (
          <h2
            onClick={() => setActiveTab("draft")}
            className={`text-xl font-bold border-b-2 ${
              activeTab === "draft"
                ? "dark:border-b-gray-100 border-b-gray-900"
                : "border-b-gray-500"
            } w-1/2 text-center cursor-pointer duration-300`}
          >
            Draft
          </h2>
        )}
      </div>
      {activeTab === "posts" && (
        <PostFeed key="public" userId={userId} status="public" />
      )}
      {activeTab === "draft" && isCurrentUser && (
        <PostFeed key="draft" userId={userId} status="draft" />
      )}
    </div>
  );
};

export default Profile;
