import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthForm from '../components/AuthForm';
import DiscordVerification from '../components/DiscordVerification';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Heading,
  useColorModeValue,
  Container,
} from '@chakra-ui/react';

const AuthPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const navigate = useNavigate();
  const { isAuthenticated, login, register, error: authError } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      alert('You are already logged in.');
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    await login(username, password);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const userId = await register(username, password, discordUsername);
    if (userId) {
      setUserId(userId);
      setIsRegistered(true);
    } else {
      setError('Registration failed. Please try again.');
    }
  };

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const tabBgColor = useColorModeValue('white', 'gray.700');

  return (
    <Box minHeight="100vh" backgroundColor={bgColor} py={12}>
      <Container maxW="md">
        <VStack spacing={8}>
          <Heading as="h1" size="xl">
            Welcome
          </Heading>
          <Box
            backgroundColor={tabBgColor}
            borderRadius="lg"
            boxShadow="md"
            p={6}
            width="full"
          >
            {isRegistered && userId ? (
              <DiscordVerification userId={userId} />
            ) : (
              <Tabs isFitted variant="enclosed">
                <TabList mb="1em">
                  <Tab>Login</Tab>
                  <Tab>Register</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <AuthForm
                      isLogin={true}
                      username={username}
                      password={password}
                      error={error || authError || ''}
                      successMessage={successMessage}
                      onUsernameChange={(e: any) => setUsername(e.target.value)}
                      onPasswordChange={(e: any) => setPassword(e.target.value)}
                      onSubmit={handleLogin}
                    />
                  </TabPanel>
                  <TabPanel>
                    <AuthForm
                      isLogin={false}
                      username={username}
                      password={password}
                      confirmPassword={confirmPassword}
                      discordUsername={discordUsername}
                      error={error || authError || ''}
                      successMessage={successMessage}
                      onUsernameChange={(e: any) => setUsername(e.target.value)}
                      onPasswordChange={(e: any) => setPassword(e.target.value)}
                      onConfirmPasswordChange={(e: any) =>
                        setConfirmPassword(e.target.value)
                      }
                      onDiscordUsernameChange={(e: any) =>
                        setDiscordUsername(e.target.value)
                      }
                      onSubmit={handleRegister}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default AuthPage;
