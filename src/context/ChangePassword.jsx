import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Navigate, Outlet } from 'react-router-dom';

const ChangePassword = () => {
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
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return true;
    }
    if (!user) {
        return <Navigate to="/login" />;
    }
    if (user.data.request_new_password === 0) {
        return <Navigate to="/dashboard" />;
    }
    return <Outlet />;

};

export default ChangePassword;
