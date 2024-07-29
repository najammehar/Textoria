import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";


const initialState = {
    posts: [],
    post: null,
    status: false,
    error: null
}

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        setPost: (state, action) => {
            state.post = action.payload;
        },
        addPost: (state, action) => {
            state.posts.push(action.payload);
        },
        setStatus: (state, action) => {
            state.status = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        getPostById: (state, action) => {
            return state.posts.find(post => post.$id === action.payload);
        },
        updatePostLikes: (state, action) => {
            const { postId, likesCount } = action.payload;
            const post = state.posts.find(post => post.$id === postId);
            if (post) {
                post.likes = likesCount;
            }
        }
    }
})

export const { setPosts, setPost, setStatus, setError, addPost, updatePostLikes, getPostById } = postSlice.actions;
export default postSlice.reducer;
