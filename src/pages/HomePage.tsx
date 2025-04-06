import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Text,
  VStack,
  HStack,
  Divider,
  useColorModeValue,
  Badge,
  Icon,
  Stack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiTrendingUp, FiAward } from 'react-icons/fi';
import TECH_PICTURE from '../assets/tech-pic.png';

const FeaturePoint: React.FC<{
  icon: React.ElementType;
  children: React.ReactNode;
}> = ({ icon, children }) => (
  <HStack spacing={3} align="flex-start">
    <Icon as={icon} w={6} h={6} color="brand.500" />
    <Text fontWeight="medium">{children}</Text>
  </HStack>
);

const HomePage = () => {
  const navigate = useNavigate();
  const bgGradient = useColorModeValue(
    'linear(to-r, brand.50, white)',
    'linear(to-r, gray.900, gray.800)'
  );
  const accentColor = useColorModeValue('brand.500', 'brand.300');

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      <Container maxW="container.xl" py={{ base: 16, md: 32 }}>
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          align="center"
          justify="space-between"
          gap={{ base: 12, lg: 16 }}
        >
          <Stack spacing={{ base: 8, md: 10 }} maxW={{ lg: '650px' }}>
            <Box position="relative">
              <Badge
                colorScheme="brand"
                fontSize="md"
                px={3}
                py={1}
                borderRadius="full"
                mb={4}
              >
                Brought to you by SWECC
              </Badge>

              <Heading
                as="h1"
                fontSize={{ base: '4xl', md: '6xl' }}
                fontWeight="extrabold"
                lineHeight="1.1"
                letterSpacing="tight"
              >
                Never fail another
                <Box as="span" color={accentColor}>
                  {' '}
                  interview
                </Box>
              </Heading>

              <Divider
                borderColor={accentColor}
                borderWidth="3px"
                width="100px"
                mt={6}
                mb={6}
              />

              <Text
                fontSize={{ base: 'xl', md: '2xl' }}
                fontWeight="medium"
                maxW="600px"
              >
                Doing mock interviews isn&apos;t just practice—it&apos;s the
                difference between rejection and your dream job.
              </Text>
            </Box>

            <VStack spacing={5} align="flex-start">
              <FeaturePoint icon={FiCheckCircle}>
                Practice in a real interview scenario
              </FeaturePoint>
              <FeaturePoint icon={FiTrendingUp}>
                Get feedback from your peers
              </FeaturePoint>
              <FeaturePoint icon={FiAward}>
                Master the technical interview
              </FeaturePoint>
            </VStack>

            <Box pt={4}>
              <Button
                colorScheme="brand"
                size="lg"
                height="60px"
                px={10}
                fontSize="xl"
                fontWeight="bold"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                onClick={() => navigate('/interview-signup')}
              >
                Start Practicing Now
              </Button>
              <Text fontSize="sm" mt={3} color="gray.500">
                Always free and crowd sourced
              </Text>
            </Box>
          </Stack>

          <Box
            position="relative"
            w={{ base: '100%', md: '500px' }}
            h={{ base: '300px', md: '500px' }}
            bg="gray.100"
            borderRadius="2xl"
            overflow="hidden"
            boxShadow="2xl"
          >
            <Flex
              h="100%"
              direction="column"
              justify="center"
              align="center"
              p={8}
              bg="gray.50"
            >
              <Image
                src={TECH_PICTURE}
                alt="Tech Illustration"
                style={{
                  transform: 'scale(2)',
                }}
              />
            </Flex>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default HomePage;
