// ProtectedRoute.js
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser, setUser } from '../utils/userSlice';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let userRole = useSelector((store) => store?.user?.user?.role?.toLowerCase());

    // Check if userRole is not available in the Redux store
    if (!userRole) {
        // Decode the token from localStorage to get the user role
        userRole = localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')).role.toLowerCase() : '';
        
        // If userRole is still empty, navigate to the home page
        if (userRole === '') {
            navigate('/');
        } else {
            // Dispatch the setUser action to update the Redux store with the user data
            dispatch(setUser({ user: jwtDecode(localStorage.getItem('token')), token: localStorage.getItem('token') }));
        }
    }

    // Check if the user role is included in the allowedRoles
    if (allowedRoles.includes(userRole)) {
        return children;
    } else {
        // If the user role is not allowed, clear the user data and navigate to the home page
        localStorage.removeItem('token');
        dispatch(clearUser());
        return <Navigate to='/' />;
    }
};

export default ProtectedRoute;