import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./feature/authSlice.jsx";

export const store=configureStore({
    reducer:{
        auth: authSlice
    }
})