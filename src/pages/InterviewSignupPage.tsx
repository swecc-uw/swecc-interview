import React, { useEffect, useState } from 'react';
import { Container, Box, Center, Spinner } from '@chakra-ui/react';
import InterviewSignupForm from '../components/InterviewSignupForm';
import { getInterviewAvailabilityForCurrentUser } from '../services/interview';
import { useAuth } from '../hooks/useAuth';
import { devPrint } from '../components/utils/RandomUtils';

const InterviewSignupPage: React.FC = () => {
  const { member } = useAuth();
  const [availability, setAvailability] = useState<boolean[][]>();

  useEffect(() => {
    if (member) {
      getInterviewAvailabilityForCurrentUser()
        .then((availability) => {
          setAvailability(availability.availability);
        })
        .catch((error) => {
          devPrint('Error fetching availability:', error);
        });
    }
  }, [member]);

  const handleAvailabilityChange = (newAvailability: boolean[][]) => {
    setAvailability(newAvailability);
  };

  return (
    <Container maxW="container.lg" py={8}>
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
    </Container>
  );
};

export default InterviewSignupPage;
