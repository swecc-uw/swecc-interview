import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  Spinner,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

interface DiscordVerificationProps {
  userId: number;
  username: string;
}

const DiscordVerification: React.FC<DiscordVerificationProps> = ({
  userId,
  username,
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isVerified) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`/auth/${userId}/verified`);
          const data = await response.json();
          if (data.verified) {
            setIsVerified(true);
          }
        } catch (error) {
          console.error('Error checking verification status:', error);
        }
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [isVerified, userId]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Send the verification code to the server if needed
      // const response = await fetch(`/auth/verify-code`, { method: 'POST', body: JSON.stringify({ userId, verificationCode }) });
      setIsLoading(false);
      setIsVerified(true);
    } catch (error) {
      console.error('Error submitting verification code:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVerified) {
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  }, [isVerified, navigate]);

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const boxBgColor = useColorModeValue('white', 'gray.700');

  return (
    <Box minHeight="100vh" backgroundColor={bgColor} py={12}>
      <VStack spacing={8} maxW="md" mx="auto">
        <Heading as="h1" size="xl" textAlign="center">
          Discord Verification
        </Heading>
        <Box
          backgroundColor={boxBgColor}
          borderRadius="lg"
          boxShadow="md"
          p={6}
          width="full"
        >
          {!isVerified ? (
            <VStack spacing={4}>
              <Text fontSize="lg">
                Run{' '}
                <Text as="span" fontWeight="bold">
                  `/auth {username}`
                </Text>{' '}
                in the Discord server and paste the code here.
              </Text>
              <Input
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                isDisabled={isLoading}
              />
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                isLoading={isLoading}
                isDisabled={isLoading || !verificationCode}
              >
                Verify
              </Button>
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
                visibility={isLoading ? 'visible' : 'hidden'}
              />
            </VStack>
          ) : (
            <VStack spacing={4}>
              <Icon as={CheckCircleIcon} boxSize={16} color="green.500" />
              <Text fontSize="lg" fontWeight="bold">
                Account Verified! Redirecting to login...
              </Text>
            </VStack>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default DiscordVerification;
