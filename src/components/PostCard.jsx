import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLike, removeLike } from '../Store/likeSlice';
import Post from '../Appwrite/Post';
import User from '../Appwrite/User';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import PostAction from './PostAction';
import defaultAvatar from '../assets/default-profile.jpg';


function PostCard({ post, onPostDeleted}) {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.userData?.$id);
    const [postLikes, setPostLikes] = useState([]);
    const [localIsLiked, setLocalIsLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [likeLoading, setLikeLoading] = useState(false);
    const [userProfile, setUserProfile] = useState({});
    const [pic, setPic] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const Navigate = useNavigate();
    const [isAuthor, setIsAuthor] = useState(false);

    const fetchLikes = useCallback(async () => {
        try {
            const response = await Post.getLikes(post.$id);
            setPostLikes(response);
            setLocalIsLiked(response.some((like) => like.userId === userId));
        } catch (error) {
            console.error("Error fetching likes:", error);
        }
    }, [post.$id, userId]);

    const fetchThumbnail = useCallback(async () => {
        try {
            const thumbnailUrl = await Post.getThumbnailPreview(post.thumbnail);
            if (thumbnailUrl) setThumbnail(thumbnailUrl);
        } catch (error) {
            console.error("Error fetching thumbnail:", error);
        }
    }, [post.thumbnail]);

    const fetchUserProfile = useCallback(async () => {
        try {
            const profile = await User.getProfile(post.userId);
            if (profile) {
                setUserProfile(profile);
                const profilePic = User.getAvatarUrl(profile.avatar);
                if (profilePic) setPic(profilePic);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    }, [post.userId]);

    useEffect(() => {
        Promise.all([fetchLikes(), fetchThumbnail(), fetchUserProfile()])
            .then(() => setLoading(false))
            .catch((error) => {
                console.error("Error in initial data fetch:", error);
                setLoading(false);
            });
            setIsAuthor(userId === post.userId);
    }, [fetchLikes, fetchThumbnail, fetchUserProfile, userId, post.userId]);

    // const handleDelete = async () => {
    //     if (window.confirm('Are you sure you want to delete this post?')) {
    //         try {
    //             await Post.deleteThumbnail(post.thumbnail);
    //             await Post.DeleteLikes(post.$id);
    //             await Post.deletePost(post.$id);
    //             onPostDeleted(post.$id);
    //         } catch (error) {
    //             console.error("Error deleting post:", error);
    //         }
    //     }
    // };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleDelete = async () => {
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await Post.deleteThumbnail(post.thumbnail);
                await Post.DeleteLikes(post.$id);
                await Post.deletePost(post.$id);
                onPostDeleted(post.$id);
        } catch (error) {
            console.error("Error deleting post:", error);
        } finally {
            setIsModalOpen(false);
        }
    };

    const cancelDelete = () => {
        setIsModalOpen(false);
    };
    const DeletePost = () => {
    return (
        <div>  
                <div className="fixed px-4 bg-[#0000006a] top-0 left-0 w-full h-screen flex justify-center z-50 items-center">
                    <div className="max-w-xs sm:max-w-sm dark:bg-grey-5 bg-grey-90  rounded-md p-5 dark:text-white">
                        <h1 className='text-2xl font-bold mb-2'>Delete Post?</h1>
                        <p className='mb-4'>This will permanently remove this post from Textoria. It cannot be undone.</p>
                        <div className='flex justify-end gap-4'>
                        <button className='px-2 py-2 rounded-lg dark:bg-grey-10 bg-grey-60  hover:bg-gray-700 text-white ' onClick={cancelDelete}>Cancel</button>
                        <button className='px-2 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white' onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
        </div>
    );
}

    const handleEdit = () => {
        Navigate(`/edit-post/${post.$id}`);
    };

    const [showCopyMessage, setShowCopyMessage] = useState(false);
    const handleShare = () => {
        const postUrl = `${window.location.origin}/post/${post.$id}`;
        navigator.clipboard.writeText(postUrl)
            .then(() => {
                setShowCopyMessage(true);
                setTimeout(() => {
                    setShowCopyMessage(false);
                }, 3000);
            })
            .catch(err => console.error('Failed to copy: ', err));
    };

    // Add this code after the handleShare function

    const CopyMessage = () => {
        return (
            <div className="fixed bottom-4 right-4 bg-grey-90 dark:bg-grey-10 dark:text-white text-black shadow-lg z-10 px-4 py-2 transition-transform duration-300 rounded-md">
                Post link copied to clipboard!
            </div>
        );
    };

    const handleLike = async () => {
        if (likeLoading) return;

        setLikeLoading(true);
        try {
            const newIsLiked = !localIsLiked;
            setLocalIsLiked(newIsLiked);
            
            if (newIsLiked) {
                setPostLikes(prev => [...prev, { userId, postId: post.$id }]);
                await Post.likePost(userId, post.$id);
                dispatch(addLike({ postId: post.$id, userId }));
            } else {
                setPostLikes(prev => prev.filter(like => like.userId !== userId));
                await Post.unLikePost(userId, post.$id);
                dispatch(removeLike({ postId: post.$id, userId }));
            }
        } catch (error) {
            console.error("Error handling like:", error);
            // Revert the optimistic update
            setLocalIsLiked(!localIsLiked);
            setPostLikes(await Post.getLikes(post.$id));
        } finally {
            setLikeLoading(false);
        }
    };

    return (
        <div className='max-w-2xl mx-auto dark:text-white text-black py-8 border-b dark:border-grey-25 border-grey-75'>
            <div className='max-w-xl rounded-xl overflow-hidden border dark:border-grey-25 border-grey-75 mx-auto'>
                {thumbnail && <img onClick={() => Navigate(`/post/${post.$id}`)} src={thumbnail} alt="Post thumbnail" className="cursor-pointer w-full h-auto" />}
                <div className='dark:bg-grey-10 bg-grey-90 p-3'>
                    <div className='flex items-center justify-between w-full'>
                        <div className='flex items-center gap-2 mb-2'>
                        <Link to={`/profile/${userProfile.$id}`}>
                            <img className='h-8 w-8 rounded-full object-cover' src={pic || defaultAvatar } onError={(e) => { e.target.src = defaultAvatar; }} alt={`${userProfile.name}'s profile`} />
                        </Link>
                        <div className='flex flex-col'>
                            <Link to={`/profile/${userProfile.$id}`}>
                                <h2 className='text-sm font-semibold hover:underline'>{userProfile.name}</h2>
                            </Link>
                            <p className='text-xs text-gray-500 -mt-[2px]'>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
                        </div>
                        </div>
                        <PostAction
                            isAuthor={isAuthor}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                            onShare={handleShare}
                        />
                    </div>
                    <div className='relative'>
                        <div onClick={() => Navigate(`/post/${post.$id}`)} className='w-[85%] cursor-pointer'>
                            <h1 className='text-lg font-semibold'>{post.title}</h1>
                            <p className='text-xs text-gray-500'>{post.description}</p>
                        </div>
                        <div className='absolute bottom-0 right-0 flex items-center gap-1'>
                            <button onClick={handleLike} disabled={likeLoading} className="focus:outline-none">
                                {localIsLiked 
                                    ? <FaHeart className='h-5 w-5 text-purple-60'/> 
                                    : <FaRegHeart className='h-5 w-5 text-gray-500 hover:text-purple-60' />
                                }
                            </button>
                            <span className='text-gray-500'>{postLikes.length}</span>
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && <DeletePost />}
            {showCopyMessage && <CopyMessage />}
        </div>
    );
}

export default PostCard;