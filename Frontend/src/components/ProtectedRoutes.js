import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminState } from '../store/store';

const ProtectedRoutes = ({ children }) => {
    const { admin, setAdmin } = useAdminState();
    const navigate = useNavigate();
    const location = useLocation();

    // useEffect(() => {
    //     const verifyToken = async () => {
    //         try {
    //             const response = await axios.get('/api/auth/verify-token', { withCredentials: true });
    //             if (response.data.success) {
    //                 setAdmin({
    //                     isLoggedIn: true,
    //                 });
    //             } else {
    //                 setAdmin({ isLoggedIn: false });
    //             }
    //         } catch (error) {
    //             console.error('Token verification failed:', error);
    //             setAdmin({ isLoggedIn: false });
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     verifyToken();
    // }, [setAdmin]);

    useEffect(() => {
            if (admin && admin?.isLoggedIn === false) {
                if (location.pathname !== '/login') {
                    navigate('/login', { replace: true });
                }
            } else if (admin && admin?.isLoggedIn === true && admin?.token === '') {
                setAdmin({
                    isLoggedIn: false,
                    token: ''
                })
                navigate('/login', { replace: true });
            } else if (admin && admin?.isLoggedIn === true) {
                if (location.pathname === '/login' || location.pathname === '/') {
                    navigate('/all-orders', { replace: true });
                }
            }
    }, [navigate, location.pathname, admin, setAdmin]);

    return children;
};

export default ProtectedRoutes;
