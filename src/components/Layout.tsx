import React from 'react'
import {
  Box,
  Flex,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Link as ChakraLink,
  useColorModeValue
} from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { Member } from '../types'
import { useMember } from '../context/MemberContex'
import { useAuth } from '../hooks/useAuth'

interface LayoutProps {
  children: React.ReactNode
}

interface NavLinkProps {
  to: string
  children: React.ReactNode
}

interface NavBarProps {
  member: Member | null
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { member } = useMember()

  return (
    <Flex direction='column' minHeight='100vh'>
      <Navbar member={member} />
      <Box as='main' flexGrow={1}>
        <Container maxW='container.xl' py={8}>
          {children}
        </Container>
      </Box>
      <Footer />
    </Flex>
  )
}

const Navbar: React.FC<NavBarProps> = ({ member }) => {
  const bg = useColorModeValue('white', 'gray.800')
  const navigate = useNavigate()

  const { isAuthenticated } = useAuth();

  const SignUpOrSignIn: React.FC = () => {
    return (
      <HStack>
        <Button colorScheme='blue' onClick={() => navigate("/auth")}>Sign in or register</Button>
      </HStack>
    )
  }

  const ProfileIcon: React.FC<NavBarProps> = ({ member }) => {
    return (
      <HStack>
        <Text fontSize='lg' fontWeight='bold' marginRight={3}>
          {member?.firstName}
        </Text>
        <Button
          onClick={() => navigate('/profile')}
          colorScheme='blue'
          variant='outline'
        >
          Profile
        </Button>
      </HStack>
    )
  }

  return (
    <Box as='nav' bg={bg} boxShadow='sm'>
      <Container maxW='container.xl' py={4}>
        <Flex justify='space-between' align='center'>
          <Link to='/'>
            <ChakraLink as='span' _hover={{ textDecoration: 'none' }}>
              <HStack spacing={2}>
                <Text fontSize='xl' fontWeight='bold'>
                  SWECC
                </Text>
              </HStack>
            </ChakraLink>
          </Link>
          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            {isAuthenticated && <NavLink to='/interview-signup'>Sign up for an interview</NavLink>}
            {isAuthenticated && <NavLink to='/interviews'>View your interviews</NavLink>}
            {isAuthenticated && <NavLink to='/protected'>protected</NavLink>}
            {isAuthenticated && <NavLink to='/directory'>Directory</NavLink>}
            {!isAuthenticated && <NavLink to='/join-swecc'>Join SWECC</NavLink>}
          </HStack>
          <HStack spacing={8}>
            {member && isAuthenticated ? <ProfileIcon member={member} /> : <SignUpOrSignIn />}
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => {
  return (
    <Link to={to}>
      <ChakraLink
        as='span'
        fontWeight='medium'
        _hover={{ textDecoration: 'none', color: 'blue.500' }}
      >
        {children}
      </ChakraLink>
    </Link>
  )
}

const Footer: React.FC = () => {
  const bg = useColorModeValue('gray.50', 'gray.900')
  const color = useColorModeValue('gray.700', 'gray.200')

  return (
    <Box as='footer' bg={bg} color={color}>
      <Container maxW='container.xl' py={12}>
        <Flex direction={{ base: 'column', md: 'row' }} justify='space-between'>
          <VStack align='start' spacing={4} mb={{ base: 8, md: 0 }}>
            <Text fontWeight='bold'>Product</Text>
            <FooterLink to='/features'>Features</FooterLink>
            <FooterLink to='/pricing'>Pricing</FooterLink>
          </VStack>
          <VStack align='start' spacing={4} mb={{ base: 8, md: 0 }}>
            <Text fontWeight='bold'>Company</Text>
            <FooterLink to='/about'>About</FooterLink>
            <FooterLink to='/blog'>Blog</FooterLink>
          </VStack>
          <VStack align='start' spacing={4} mb={{ base: 8, md: 0 }}>
            <Text fontWeight='bold'>Support</Text>
            <FooterLink to='/docs'>Documentation</FooterLink>
            <FooterLink to='/contact'>Contact</FooterLink>
          </VStack>
          <VStack align='start' spacing={4}>
            <Text fontWeight='bold'>Legal</Text>
            <FooterLink to='/privacy'>Privacy</FooterLink>
            <FooterLink to='/terms'>Terms</FooterLink>
          </VStack>
        </Flex>
        <Text mt={12} textAlign='center' fontSize='sm'>
          Created with ❤️ by SWECC
        </Text>
      </Container>
    </Box>
  )
}

const FooterLink: React.FC<NavLinkProps> = ({ to, children }) => {
  return (
    <Link to={to}>
      <ChakraLink
        as='span'
        fontSize='sm'
        _hover={{ textDecoration: 'none', color: 'blue.500' }}
      >
        {children}
      </ChakraLink>
    </Link>
  )
}

export default Layout
