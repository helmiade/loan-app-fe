import { useAuth } from "./context/AuthContext";

import React from 'react'
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({children}) => {
    const{isLoggedIn}=useAuth();

    if(!isLoggedIn){
        return <Navigate to='/login'/>
    }
    return children
}

