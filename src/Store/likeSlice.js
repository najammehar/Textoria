import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    likes: [],
    status: false,
    error: null
}

const likeSlice = createSlice({
    name: 'like',
    initialState,
    reducers: {
        setLikes: (state, action) => {
            state.likes = action.payload;
        },
        addLike: (state, action) => {
            state.likes.push(action.payload);
        },
        removeLike: (state, action) => {
            state.likes = state.likes.filter(
                (like) => like.likeId !== action.payload
            );
        },
        setStatus: (state, action) => {
            state.status = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
})

export const { setLikes, setStatus, setError, addLike, removeLike } = likeSlice.actions;
export default likeSlice.reducer;