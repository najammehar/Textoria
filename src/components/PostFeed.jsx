import React, { useEffect, useState, useCallback, useRef } from 'react';
import Post from '../Appwrite/Post';
import PostCard from './PostCard';
import { Oval } from 'react-loader-spinner';

function PostFeed({ userId, status , category }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef(null);

    const POSTS_PER_PAGE = 4;

    const handlePostDeleted = useCallback((deletedPostId) => {
        setPosts(prevPosts => prevPosts.filter(post => post.$id !== deletedPostId));
    }, []);

    const fetchPosts = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        setError(null);
        try {
            let newPosts;
            if (userId && status) {
                newPosts = await Post.getPostsByUser(userId, status, POSTS_PER_PAGE, offset);
            } else {
                if(!category){
                    newPosts = await Post.getPosts(POSTS_PER_PAGE, offset);
                } else {
                    newPosts = await Post.getPosts(POSTS_PER_PAGE, offset, category);
                }
            }
            
            if (newPosts.length > 0) {
                setPosts(prevPosts => {
                    const updatedPosts = [...prevPosts, ...newPosts];
                    return Array.from(new Map(updatedPosts.map(post => [post.$id, post])).values());
                });
                setOffset(prevOffset => prevOffset + newPosts.length);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError('Failed to load posts. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [userId, status, offset, loading, hasMore]);

    useEffect(() => {
        setPosts([]);
        setOffset(0);
        setHasMore(true);
        setError(null);
    }, [userId, status, category]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts, userId, status, category]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    fetchPosts();
                }
            },
            { threshold: 0.1 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [fetchPosts, hasMore, loading]);

    return (
        <div className='w-full px-4'>
            {posts.map((post) => (
                <PostCard key={post.$id} post={post} onPostDeleted={handlePostDeleted} />
            ))}
            <div ref={loaderRef} className='h-10 w-full'></div>
            {loading && (
                <div className='flex items-center justify-center my-8'>
                    <Oval
                        visible={true}
                        height="30"
                        width="30"
                        strokeWidth="4"
                        color="#5047eb"
                        secondaryColor='#d8d6fa'
                        ariaLabel="oval-loading"
                    />
                </div>
            )}
            {error && <div className='text-red-500 text-center py-4'>{error}</div>}
            {!hasMore && posts.length > 0 && (
                <div className='dark:text-white text-center py-4'>No more posts</div>
            )}
            {!hasMore && posts.length === 0 && (
                <div className='dark:text-white font-bold text-4xl text-center py-8'>No posts yet</div>
            )}
        </div>
    );
}

export default React.memo(PostFeed);