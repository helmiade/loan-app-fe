import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    isLoggedIn : false,
    user: null
}

const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers : {
        setAuthState : (state,action) => {
            const {isLoggedIn , user} = action.payload;
            state.isLoggedIn = isLoggedIn;
            state.user = isLoggedIn ? user : null;
        },
        logout : (state) => {
            state.user = null;
            state.isLoggedIn = false;
        },
    },
})

export const {setAuthState , logout} = authSlice.actions;
export default authSlice.reducer;