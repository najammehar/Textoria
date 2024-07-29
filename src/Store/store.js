import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import postReducer from "./postSlice";
import likeReducer from "./likeSlice";

export default configureStore({
    reducer: {
        auth: authReducer,
        post: postReducer,
        like: likeReducer,
    }
});