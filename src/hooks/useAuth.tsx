import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import api from '../api';
import { devPrint } from '../components/utils/RandomUtils';

interface AuthContextType {
  isAuthenticated: boolean | null;
  csrf: string;
  error: string;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    username: string,
    password: string,
    email: string
  ) => Promise<void>;
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
  const [csrf, setCsrf] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getSession();
  }, []);

  const getSession = async (): Promise<void> => {
    try {
      const res = await api.get('/api/auth/session/');

      const data = res.data;
      devPrint('Session data:', data);

      if (data.isAuthenticated) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        getCSRF();
      }

      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch session data:', err);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const getCSRF = async (): Promise<void> => {
    try {
      const res = await api.get('/api/auth/csrf/');

      const csrfToken = res.headers['x-csrftoken'];
      if (csrfToken) {
        setCsrf(csrfToken);
        devPrint('CSRF Token fetched and set:', csrfToken);
      } else {
        throw new Error('CSRF token not found in response headers');
      }
    } catch (err) {
      console.error('Failed to fetch CSRF token:', err);
    }
  };

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const res = await api.post('/api/auth/login/', {
        username,
        password,
      });

      if (res.status === 200) {
        setIsAuthenticated(true);
        setError('');
      } else {
        const errorData = res.data;
        if (
          errorData.detail ===
          'Your account does not have a Discord ID associated with it.'
        ) {
          setError(
            `Your discord is not verified. Please type /auth ${errorData.username} in the swecc server`
          );
        } else {
          console.error('Login failed:', errorData);
          setError('Invalid credentials. Please try again.');
          setIsAuthenticated(false);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response) {
        console.error('Error during login:', err.response.data);
        setError(err.response.data.detail || 'Login failed. Please try again.');
      } else {
        console.error('Error during login:', err);
        setError('An error occurred. Please try again later.');
      }
      setIsAuthenticated(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const res = await api.post('/api/auth/logout/');

      if (res.status === 200) {
        devPrint('Logout successful');
        setIsAuthenticated(false);
        await getCSRF();
      } else {
        console.error('Logout failed');
      }
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  const register = async (
    username: string,
    password: string,
    discord_username: string
  ): Promise<void> => {
    try {
      const res = await api.post('/api/auth/register/', {
        username,
        password,
        discord_username,
      });

      if (res.status !== 201) {
        throw new Error('Registration failed.');
      }

      const data = res.data;
      devPrint('Registration successful:', data);
      setError('');
      //This shouldn't be an error but too lazy right now to create redirect page
      setError(
        `Registration successful. Please type /auth ${username} in the swecc server`
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response) {
        console.error('Registration failed:', err.response.data);
        setError(
          err.response.data.detail || 'Registration failed. Please try again.'
        );
      } else {
        console.error('Error during registration:', err);
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, csrf, error, loading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};
