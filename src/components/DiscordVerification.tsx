import { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, Spinner, Button } from '@chakra-ui/react';
import { devPrint } from './utils/RandomUtils';

interface DiscordVerificationProps {
  username: string;
  password: string;
  tryLogin: (username: string, password: string) => void;
  onGoBack: () => void; // Add this new prop
}

const DiscordVerification: React.FC<DiscordVerificationProps> = ({
  username,
  password,
  tryLogin,
  onGoBack,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    // poll login every 10 seconds
    const interval = setInterval(async () => {
      try {
        tryLogin(username, password);
      } catch (error) {
        devPrint(error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isPolling, tryLogin, username, password]);

  const startChecking = async () => {
    setIsLoading(true);
    setIsPolling(true);
  };

  return (
    <Box minHeight="100vh" py={12}>
      <VStack spacing={8} maxW="md" mx="auto">
        <Heading as="h1" size="xl" textAlign="center">
          Discord Verification
        </Heading>
        <Box borderRadius="lg" boxShadow="md" p={6} width="full">
          <VStack spacing={4}>
            <Text fontSize="lg" textAlign="center">
              Run{' '}
              <Text as="span" fontWeight="bold">
                `/auth {username}`
              </Text>{' '}
              in the Discord server to verify your account.
            </Text>
            {isLoading && (
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            )}
            <Button
              onClick={() => startChecking()}
              colorScheme="brand"
              size="lg"
              disabled={isLoading}
            >
              Confirm
            </Button>
            <Button onClick={onGoBack} colorScheme="brand" size="lg">
              Go Back
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default DiscordVerification;
