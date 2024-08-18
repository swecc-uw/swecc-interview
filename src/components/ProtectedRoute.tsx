import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Center, Spinner } from '@chakra-ui/react';

// Define the props for ProtectedRoute
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, member } = useAuth();

  if (member === undefined) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

export default ProtectedRoute;
