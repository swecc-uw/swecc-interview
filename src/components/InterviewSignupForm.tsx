import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  useDisclosure,
  useToast,
  Text,
  ModalFooter,
} from '@chakra-ui/react';
import ChakaraTimeRangeSelector from './TimeRangeSelector/ChakaraTimeRangeSelector';
import MobileTimeRangeSelector from './TimeRangeSelector/MobileTimeRangeSelector';
import { signupCurrentUserForInterviewPool } from '../services/interview';
import { InterviewAvailability } from '../types';
import { devPrint } from './utils/RandomUtils';
import { useAuth } from '../hooks/useAuth';
import { formatDate, getThisUpcomingSunday } from '../localization';

interface InterviewSignupFormProps {
  title: string;
  availability: boolean[][];
  onChange: (newAvailability: boolean[][]) => void;
  dayLabels?: string[];
  timeLabels?: string[];
}

// TODO: Add register to server to save current signup period
const InterviewSignupForm: React.FC<InterviewSignupFormProps> = ({
  title,
  availability,
  onChange,
  dayLabels,
  timeLabels,
}) => {
  const { member } = useAuth();
  const toast = useToast();

  const isMobile = window.innerWidth < 768;
  devPrint('isMobile', isMobile);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleConfirm = async () => {
    if (!member) {
      alert('You must be logged in to sign up for an interview');
      return;
    }

    const interviewAvailability: InterviewAvailability = {
      userId: member.id,
      availability: availability,
    };

    try {
      await signupCurrentUserForInterviewPool(interviewAvailability);
      toast({
        title: 'Successfully signed up for an interview',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      devPrint('Error signing up for interview:', error);
      toast({
        title: 'Error signing up for interview',
        description: 'Please try again later',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={'1.7vw'}>Confirm Mock Interview</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="1vw">
              You are signing up for a mock interview for the week of{' '}
              <em>{formatDate(getThisUpcomingSunday())}</em>. Please confirm
              that you are available for the times selected. We take no shows{' '}
              <em>very</em> seriously and will ban you from the platform if you
              do not show up.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              bgColor={'red.500'}
              size="lg"
              color="white"
              onClick={onClose}
              _hover={{
                bgColor: 'red.700',
              }}
            >
              Cancel
            </Button>
            <Button
              bgColor={'green.500'}
              color="white"
              size="lg"
              _hover={{
                bgColor: 'green.700',
              }}
              onClick={async () => {
                await handleConfirm();
                onClose();
              }}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <VStack spacing={6} align="stretch">
        <Box position="relative" height="500px" overflowY={'auto'}>
          {isMobile ? (
            <MobileTimeRangeSelector
              title={title}
              availability={availability}
              onChange={onChange}
              dayLabels={dayLabels}
              timeLabels={timeLabels}
            />
          ) : (
            <ChakaraTimeRangeSelector
              title={title}
              availability={availability}
              onChange={onChange}
              dayLabels={dayLabels}
              timeLabels={timeLabels}
            />
          )}
        </Box>
        <Box display="flex" justifyContent="center">
          <Button colorScheme="brand" size="lg" onClick={onOpen}>
            Submit
          </Button>
        </Box>
      </VStack>
    </>
  );
};

export default InterviewSignupForm;
