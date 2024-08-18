import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import api, { getCSRF } from '../services/api';
import { devPrint } from '../components/utils/RandomUtils';

interface AuthContextType {
  isAuthenticated: boolean | null;
  error: string;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    username: string,
    password: string,
    email: string
  ) => Promise<number | null>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getSession();
  }, []);

  const getSession = async (): Promise<void> => {
    try {
      await api.get('/auth/session/');
      setIsAuthenticated(true);
      setLoading(false);
    } catch (err) {
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const res = await api.post(
        '/auth/login/',
        { username, password }
      );

      if (res.status === 200) {
        getCSRF();
        setIsAuthenticated(true);
        setError('');
      } else {
        handleLoginError(res.data);
      }
    } catch (err: any) {
      handleLoginError(err.response?.data);
    }
  };

  const handleLoginError = (errorData: any) => {
    if (
      errorData?.detail ===
      'Your account does not have a Discord ID associated with it.'
    ) {
      setError(
        `Your discord is not verified. Please type /auth ${errorData.username} in the swecc server`
      );
    } else {
      setError('Invalid credentials. Please try again.');
      setIsAuthenticated(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const res = await api.post(
        '/auth/logout/'
      );

      if (res.status === 200) {
        devPrint('Logout successful');
        getCSRF();
        setIsAuthenticated(false);
      } else {
        devPrint('Logout failed');
      }
    } catch (err) {
      devPrint('Logout failed');
    }
  };

  const register = async (
    username: string,
    password: string,
    discord_username: string
  ): Promise<number | null> => {
    try {
      const res = await api.post(
        '/auth/register/',
        { username, password, discord_username }
      );

      if (res.status !== 201) throw new Error('Registration failed.');

      const data = res.data;
      setError('');
      setError(
        `Registration successful. Please type /auth ${username} in the swecc server`
      );
      getCSRF();
      return data.id;
    } catch (err: any) {
      devPrint('Registration failed:', err.response?.data);
      setError(
        err.response?.data?.detail || 'Registration failed. Please try again.'
      );
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, error, loading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};
