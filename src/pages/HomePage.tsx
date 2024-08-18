import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box minH="100vh">
      <Container maxW="container.xl" pt={20}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="space-between"
        >
          <VStack align="start" spacing={6} mb={{ base: 12, md: 0 }}>
            <Heading as="h1" size="2xl">
              Never fail another interview
            </Heading>
            <Text fontSize="xl">
              Doing mock interviews is one of the best ways to prepare for the
              real thing.
            </Text>
            <Button
              colorScheme="brand"
              size="lg"
              onClick={() => navigate('/interview-signup')}
            >
              Get Started
            </Button>
          </VStack>

          <Box position="relative" w="300px" h="300px"></Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default HomePage;
