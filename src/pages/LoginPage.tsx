import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate(); 
  const { isAuthenticated, login, error, isVerified } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
        navigate("/");
      }
    }, [isAuthenticated, navigate]);    


  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleUserNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login(username, password);
  };

  return (isVerified) ? (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
    <br />
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleUserNameChange}
            required
          />
          <br />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
            {error &&  <div><br /><small>{error}</small></div>}
        <br />
        <button type="submit">Login</button>
      </form>
    </div>) : (<div>Please verify </div>);

};

export default LoginPage;
