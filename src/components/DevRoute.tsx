import React from 'react';
import { Navigate } from 'react-router-dom';

interface DevRouteProps {
  children: React.ReactNode;
}

const DevRoute: React.FC<DevRouteProps> = ({ children }) => {
  const isDev = import.meta.env.VITE_ENV === 'development';

  return isDev ? <>{children}</> : <Navigate to="/" />;
};

export default DevRoute;
