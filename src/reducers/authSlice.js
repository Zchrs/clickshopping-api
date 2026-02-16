import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    userAdmin: null,
    checking: true
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginUser(state, action) {
            state.user = action.payload;
            state.checking = false;
        },
        logoutUser(state) {
            state.user = null;
            state.checking = false;
        },
        loginAdmin(state, action) {
            state.userAdmin = action.payload;
            state.checking = false;
        },
        logoutAdmin(state) {
            state.userAdmin = null;
            state.checking = false;
        },
        checkingFinish(state) {
            state.checking = false;
        }
    }
});

export const { loginUser, logoutUser, loginAdmin, logoutAdmin, checkingFinish } = authSlice.actions;

export default authSlice.reducer;