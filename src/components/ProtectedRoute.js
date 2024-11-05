// ProtectedRoute.js
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../utils/userSlice';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let userRole = useSelector((store) => store?.user?.user?.role.toLowerCase());
    if (!userRole) {
        userRole = localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')).role.toLowerCase() : '';
        if (userRole === '') {
            navigate('/');
        }
        else {
            dispatch(setUser({ user: jwtDecode(localStorage.getItem('token')), token: localStorage.getItem('token') }));

        }
    }

    return allowedRoles.includes(userRole) ? children : <Navigate to="/" />;
};

export default ProtectedRoute;