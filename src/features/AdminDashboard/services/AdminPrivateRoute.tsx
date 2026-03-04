import { useAuth } from '../../auth/hooks/useAuth';
import { type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

interface PrivateAdminRouteProps {
    children: ReactNode;
}


const AdminPrivateRoute = ({ children }: PrivateAdminRouteProps) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#070707] flex items-center justify-center">
                <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full shadow-lg shadow-indigo-500/20" />
            </div>
        );
    }

    if (user.role != "COMPANY_ADMIN") {
        toast.error("This page is only accessed by the Admin User.")
        return <Navigate to={'/login'} />
    }

    return children;
}

export default AdminPrivateRoute