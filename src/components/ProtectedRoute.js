// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const userRole = useSelector((store) => store.user.user.role.toLowerCase());

    return allowedRoles.includes(userRole) ? children : <Navigate to="/" />;
};

export default ProtectedRoute;