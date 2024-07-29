import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userData: null,
    userProfile: null
}

const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserData: (state, action) => {
            state.status = true;
            state.userData = action.payload;
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
        },
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.session;
            state.userProfile = action.payload.userProfile;
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            state.userProfile = null;
        },
        updateProfile: (state, action) => { // Add this reducer
            state.userProfile = {
              ...state.userProfile,
              ...action.payload
            };
        }
    }
})

export const {updateProfile, login, logout, setUserData, setUserProfile } = AuthSlice.actions;

export default AuthSlice.reducer;