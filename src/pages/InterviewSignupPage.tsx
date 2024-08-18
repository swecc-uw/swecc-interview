import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Center,
  Spinner,
  Text,
  Button,
} from '@chakra-ui/react';
import InterviewSignupForm from '../components/InterviewSignupForm';
import {
  getInterviewAvailabilityForCurrentUser,
  isCurrentUserSignedUpForInterviewPool,
  deleteCurrentUserFromInterviewPool,
} from '../services/interview';
import { useAuth } from '../hooks/useAuth';
import { devPrint } from '../components/utils/RandomUtils';

interface DeleteExistingSignupViewProps {
  setIsUserSignedUp: (isSignedUp: boolean) => void;
}

const DeleteExistingSignupView: React.FC<DeleteExistingSignupViewProps> = ({
  setIsUserSignedUp,
}) => {
  const actuallyDeleteSignup = () => {
    deleteCurrentUserFromInterviewPool()
      .then(() => setIsUserSignedUp(false))
      .catch((error) => {
        devPrint('Error deleting signup:', error);
      });
  };

  return (
    <Box borderRadius="lg" boxShadow="md" p={6}>
      <Center>
        <Text>Change or delete your existing signup</Text>
      </Center>

      <Center mt={50}>
        <Button colorScheme="brand" onClick={() => setIsUserSignedUp(false)}>
          Change Signup
        </Button>
      </Center>
      <Center mt={5}>
        <Button colorScheme="brand" onClick={actuallyDeleteSignup}>
          Delete Signup
        </Button>
      </Center>
    </Box>
  );
};

interface SignUpForNewInterviewViewProps {
  availability: boolean[][];
  handleAvailabilityChange: (newAvailability: boolean[][]) => void;
}

const SignUpForNewInterviewView: React.FC<SignUpForNewInterviewViewProps> = ({
  availability,
  handleAvailabilityChange,
}) => (
  <Box borderRadius="lg" boxShadow="md" p={6}>
    {availability ? (
      <InterviewSignupForm
        title="Select Your Availability for the following week..."
        availability={availability}
        onChange={handleAvailabilityChange}
      />
    ) : (
      <Box>
        <Center>
          <Spinner />
        </Center>
      </Box>
    )}
  </Box>
);

const InterviewSignupPage: React.FC = () => {
  const { member } = useAuth();
  const [availability, setAvailability] = useState<boolean[][]>();
  const [isUserSignedUp, setIsUserSignedUp] = useState<boolean>(false);

  useEffect(() => {
    if (member) {
      getInterviewAvailabilityForCurrentUser()
        .then((availability) => {
          setAvailability(availability.availability);
        })
        .catch((error) => {
          devPrint('Error fetching availability:', error);
        });

      isCurrentUserSignedUpForInterviewPool()
        .then(setIsUserSignedUp)
        .catch((error) => {
          devPrint('Error fetching signup status:', error);
        });
    }
  }, [member]);

  const handleAvailabilityChange = (newAvailability: boolean[][]) => {
    setAvailability(newAvailability);
  };

  return (
    <Container maxW="container.lg" py={8}>
      {isUserSignedUp ? (
        <DeleteExistingSignupView setIsUserSignedUp={setIsUserSignedUp} />
      ) : availability ? (
        <SignUpForNewInterviewView
          availability={availability}
          handleAvailabilityChange={handleAvailabilityChange}
        />
      ) : (
        <Box>
          <Center>
            <Spinner />
          </Center>
        </Box>
      )}
    </Container>
  );
};

export default InterviewSignupPage;
