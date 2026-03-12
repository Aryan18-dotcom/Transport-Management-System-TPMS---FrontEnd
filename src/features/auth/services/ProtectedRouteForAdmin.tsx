import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import toast from 'react-hot-toast';

interface ProtectedRouteForAdminProps {
  children: ReactNode;
}

const ProtectedRouteForAdminProps = ({ children }: ProtectedRouteForAdminProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full shadow-lg shadow-indigo-500/20" />
      </div>
    );
  }

  // 1. If not logged in, go to login
  if (!user) {
    return <Navigate to={'/login'} />
  }

  if (user.role != "COMPANY_ADMIN"){
    toast.error("Can't Access this page.")
    return <Navigate to={'/employee-dashboard'} />
  }

  return children;
};

export default ProtectedRouteForAdminProps;