import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  useToast,
  Code,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import api from '../../services/api';
import { InterviewPoolStatus } from '../../types';
import { getInterviewPoolStatus } from '../../services/interview';
import { ArrowBackIcon, SpinnerIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { devPrint } from '../../components/utils/RandomUtils';

const PairingDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [signal, setSignal] = useState(false);
  const [response, setResponse] = useState('');

  const [signupData, setSignUpData] = useState<InterviewPoolStatus>();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    getInterviewPoolStatus()
      .then((res) => {
        setLoading(true);
        setSignal(!signal);
        devPrint(res);
        if (res) {
          setSignUpData(res);
        }
      })
      .catch((error) => {
        devPrint(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleToggle = () => {
    setLoading(true);
    setSignal(!signal);
    api
      .post('/interview/pair/', { signal: !signal })
      .then((res) => {
        setResponse(res.data);
        toast({
          title: 'Success',
          description: 'Pair interview pool status updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        setResponse(JSON.stringify(error));
        toast({
          title: 'Error',
          description: 'Failed to update pair interview pool status',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleConfirmToggle = () => {
    onClose();
    handleToggle();
  };

  return (
    <Container maxW="container.md" py={8}>
      <Button
        as={Link}
        to="/admin"
        colorScheme="blue"
        leftIcon={<ArrowBackIcon />}
        w="fit-content"
        mb="16px"
      >
        Go Back
      </Button>
      <VStack spacing={6} align="stretch">
        <Box borderWidth={1} borderRadius="lg" p={6} boxShadow="md">
          <VStack spacing={4} align="stretch">
            <Heading size="lg">Pair Interview Pool Dashboard</Heading>
            <Text>Manage the pair interview pool status</Text>

            <HStack justifyContent="space-between">
              <Text fontWeight="medium">Pair Interview Pool</Text>
            </HStack>
            <Text fontWeight="medium">
              {signupData?.numberSignUp || 0} member signup:
            </Text>
            <Code>{JSON.stringify(signupData?.members, null, 2)}</Code>

            <Button
              onClick={onOpen}
              isLoading={loading}
              loadingText="Processing"
              spinnerPlacement="start"
              colorScheme={signal ? 'red' : 'green'}
            >
              {loading ? <SpinnerIcon mr={2} /> : null}
              Pair Interview Pool
            </Button>

            {response && (
              <Box borderWidth={1} borderRadius="md" p={4} bg="gray.50">
                <Text fontWeight="bold" mb={2}>
                  Response:
                </Text>
                <Code display="block" whiteSpace="pre-wrap">
                  {JSON.stringify(response, null, 2)}
                </Code>
              </Box>
            )}
          </VStack>
        </Box>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Action</ModalHeader>
          <ModalBody>
            Are you sure you want to toggle the pair interview pool status?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleConfirmToggle}>
              Yes
            </Button>
            <Button variant="ghost" onClick={onClose}>
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default PairingDashboard;
