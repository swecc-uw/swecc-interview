import React from 'react';
import {
  Box,
  Flex,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Spinner,
  Center,
  Link as ChakraLink,
  useColorModeValue,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Member } from '../types';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

interface NavBarProps {
  member?: Member;
  isAuthenticated: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, loading, member } = useAuth();

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner />
      </Center>
    );
  }

  return (
    <Flex direction="column" minHeight="100vh">
      <Navbar member={member} isAuthenticated={isAuthenticated} />
      <Box as="main" flexGrow={1}>
        <Container maxW="container.xl" py={8}>
          {children}
        </Container>
      </Box>
      <Footer />
    </Flex>
  );
};

const Navbar: React.FC<NavBarProps> = ({ member, isAuthenticated }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const NavLinks = () => (
    <>
      {isAuthenticated && (
        <>
          <NavLink to="/interview-signup">Sign up for an interview</NavLink>
          <NavLink to="/interviews">View your interviews</NavLink>
          <NavLink to="/directory">Directory</NavLink>
        </>
      )}
      {!isAuthenticated && <NavLink to="/join-swecc">Join SWECC</NavLink>}
    </>
  );

  return (
    <Box as="nav" boxShadow="sm" position="sticky" top={0} zIndex="sticky">
      <Container maxW="container.xl" py={4}>
        <Flex justify="space-between" align="center">
          <Link to="/">
            <ChakraLink as="span" _hover={{ textDecoration: 'none' }}>
              <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                SWECC
              </Text>
            </ChakraLink>
          </Link>

          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            <NavLinks />
          </HStack>

          <HStack>
            {member && isAuthenticated ? (
              <Button
                colorScheme="brand"
                onClick={() => navigate('/profile')}
                variant="ghost"
              >
                {member.firstName || 'Profile'}
              </Button>
            ) : (
              <Button colorScheme="brand" onClick={() => navigate('/auth')}>
                Sign in
              </Button>
            )}
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              colorScheme="brand"
              onClick={onOpen}
              icon={<HamburgerIcon />}
              aria-label="Open menu"
              variant="ghost"
            />
          </HStack>
        </Flex>
      </Container>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack align="start" spacing={4}>
              <NavLinks />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => {
  return (
    <Link to={to}>
      <ChakraLink
        as="span"
        fontWeight="medium"
        _hover={{ textDecoration: 'none', color: 'blue.500' }}
      >
        {children}
      </ChakraLink>
    </Link>
  );
};

const Footer: React.FC = () => {
  const bg = useColorModeValue('gray.50', 'gray.900');
  const color = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box as="footer" bg={bg} color={color} mt="auto">
      <Container maxW="container.xl" py={12}>
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between">
          <VStack align="start" spacing={4} mb={{ base: 8, md: 0 }}>
            <Text fontWeight="bold">Product</Text>
            <FooterLink to="/features">Features</FooterLink>
            <FooterLink to="/pricing">Pricing</FooterLink>
          </VStack>
          <VStack align="start" spacing={4} mb={{ base: 8, md: 0 }}>
            <Text fontWeight="bold">Company</Text>
            <FooterLink to="/about">About</FooterLink>
            <FooterLink to="/blog">Blog</FooterLink>
          </VStack>
          <VStack align="start" spacing={4} mb={{ base: 8, md: 0 }}>
            <Text fontWeight="bold">Support</Text>
            <FooterLink to="/docs">Documentation</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
          </VStack>
          <VStack align="start" spacing={4}>
            <Text fontWeight="bold">Legal</Text>
            <FooterLink to="/privacy">Privacy</FooterLink>
            <FooterLink to="/terms">Terms</FooterLink>
          </VStack>
        </Flex>
        <Text mt={12} textAlign="center" fontSize="sm">
          © {new Date().getFullYear()} SWECC. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
};

const FooterLink: React.FC<NavLinkProps> = ({ to, children }) => {
  return (
    <Link to={to}>
      <ChakraLink
        as="span"
        fontSize="sm"
        _hover={{ textDecoration: 'none', color: 'blue.500' }}
      >
        {children}
      </ChakraLink>
    </Link>
  );
};

export default Layout;
