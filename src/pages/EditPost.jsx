import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Post from '../Appwrite/Post';
import { WriteEditPost } from '../components';

function EditPost() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postData = await Post.getPost(postId);
                setPost(postData);
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        }
        fetchPost();
},[])




  return (
    <>
        {post && (
            <>
                <h1 className='mt-4 text-center text-2xl font-bold text-black dark:text-white'>Edit Post</h1>
                <WriteEditPost post={post} />
            </>
            )}
    </>
  )
}

export default EditPost