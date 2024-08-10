import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LogoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
        await logout();
        navigate("/login");
    }
    handleLogout();
  }, []);

  return <div>Logging out...</div>; 
};

export default LogoutPage;
