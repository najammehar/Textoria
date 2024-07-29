import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { FaRegHeart, FaHeart, FaShare, FaLink } from "react-icons/fa";
import { Oval } from 'react-loader-spinner';
import Post from '../Appwrite/Post';
import User from '../Appwrite/User';
import PostAction from './PostAction';
import parse from 'html-react-parser';
import { addLike, removeLike } from '../Store/likeSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import defaultAvatar from '../assets/default-profile.jpg'

function PostDetail() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const userId = useSelector((state) => state.auth.userData?.$id);
    const dispatch = useDispatch();
    
    const [post, setPost] = useState(null);
    const [userProfile, setUserProfile] = useState({});
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [thumbnail, setThumbnail] = useState('');

    const fetchPostDetails = useCallback(async () => {
        try {
            const postData = await Post.getPost(postId);
            setPost(postData);

            const profile = await User.getProfile(postData.userId);
            setUserProfile(profile);

            const likes = await Post.getLikes(postId);
            setLikeCount(likes);
            setIsLiked(likes.some(like => like.userId === userId));

            if (postData.thumbnail) {
                const thumbnailUrl = await Post.getThumbnailPreview(postData.thumbnail);
                setThumbnail(thumbnailUrl);
            }

            setLoading(false);
        } catch (err) {
            console.error("Error fetching post details:", err);
            setError("Failed to load post details. Please try again later.");
            setLoading(false);
        }
    }, [postId, userId]);

    useEffect(() => {
        fetchPostDetails();
    }, [fetchPostDetails]);

    const [likeLoading, setLikeLoading] = useState(false);
    

    const handleLike = async () => {
        if (likeLoading) return;

        setLikeLoading(true);
        try {
            const newIsLiked = !isLiked;
            setIsLiked(newIsLiked);
            
            if (newIsLiked) {
                setLikeCount(prev => [...prev, { userId, postId: post.$id }]);
                await Post.likePost(userId, post.$id);
                dispatch(addLike({ postId: post.$id, userId }));
            } else {
                setLikeCount(prev => prev.filter(like => like.userId !== userId));
                await Post.unLikePost(userId, post.$id);
                dispatch(removeLike({ postId: post.$id, userId }));
            }
        } catch (error) {
            console.error("Error handling like:", error);
            setIsLiked(!isLiked);
            setLikeCount(await Post.getLikes(post.$id));
        } finally {
            setLikeLoading(false);
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleDelete = async () => {
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await Post.deleteThumbnail(post.thumbnail);
            await Post.DeleteLikes(postId);
            await Post.deletePost(postId);
            navigate('/');
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
        navigate(`/edit-post/${postId}`);
    };
    const [showCopyMessage, setShowCopyMessage] = useState(false);

    const handleShare = () => {
        const postUrl = `${window.location.origin}/post/${postId}`;
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

    if (loading) {
        return <div className='flex items-center justify-center my-8'>
            <Oval visible={true} height="30" width="30" strokeWidth="4" color="#5047eb" secondaryColor='#d8d6fa' ariaLabel="oval-loading" />
        </div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    if (!post) {
        return <div className="text-center">Post not found.</div>;
    }

    return (
        <>
            {thumbnail && (
                <div className="md:h-[75vh] h-auto overflow-hidden flex justify-center items-center">
                <img 
                    src={thumbnail} 
                    alt="Post thumbnail" 
                    className="w-full h-full object-contain mb-6"
                />
            </div>
            
            )}
        <div className="max-w-5xl mx-auto px-4 mb-12">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                    <Link to={`/profile/${userProfile.$id}`} >
                    <img
                        src={User.getAvatarUrl(userProfile.avatar) || defaultAvatar } 
                        alt={`${userProfile.name}'s avatar`}
                        className="w-12 h-12 rounded-full"
                        onError={(e) => { e.target.src = defaultAvatar; }}
                    />
                    </Link>
                    <div>
                    <Link to={`/profile/${userProfile.$id}`} >
                        <p className="font-semibold dark:text-white hover:underline">{userProfile.name}</p>
                    </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>
                
                {userId === post.userId && (
                    <PostAction
                        isAuthor={true}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        onShare={handleShare}
                    />
                )}
            </div>
            <h1 className="text-3xl font-bold dark:text-white mb-4">{post.title}</h1>
            {/* <p className='mb-2'>{post.description}</p> */}
            


            <div className="prose dark:prose-invert text-sm dark:text-white text-black max-w-none mb-6">
                {parse(post.content)}
            </div>

            <div className="flex items-center space-x-4">
                <button onClick={handleLike} className="flex items-center space-x-2 text-gray-500 hover:text-purple-60">
                    {isLiked ? <FaHeart className='h-5 w-5 text-purple-60' /> : <FaRegHeart className='h-5 w-5 text-gray-500 hover:text-purple-60' />}
                    <span>{likeCount.length}</span>
                </button>
                <button onClick={handleShare} className="flex items-center space-x-2 text-gray-500 hover:text-purple-60">
                    <FaLink />
                    <span>Share</span>
                </button>
            </div>
            {showCopyMessage && <CopyMessage />}
            {isModalOpen && <DeletePost />}
        </div>
        <footer className='w-full px-6 text-center dark:text-white text-black h-20 border-t border-t-gray-500 flex flex-col justify-center'>
            <p className='text-sm font-medium mb-1'>© 2024 All rights reserved</p>
            <p className='text-xs font-normal'>Developed by <span className='underline hover:text-[#5047eb] active:text-[#8680ff] cursor-pointer'>Najam Ul Hassan</span></p>
        </footer>
        </>
    );
}

export default PostDetail;