import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Navigate, Outlet } from 'react-router-dom';
import Loading from './Loading';

const ProtectedRoutes = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }
                const response = await axios.get('/api/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchUserProfile();
        }, 2100);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }
    if (user.data.request_new_password === 1) {
        return <Navigate to="/change-new-password" />;
    }
    return <Outlet />;
};

export default ProtectedRoutes;