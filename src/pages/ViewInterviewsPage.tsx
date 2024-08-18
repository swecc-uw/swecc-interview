import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  VStack,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { Interview } from '../types';
import { InterviewPreview } from '../components/InterviewPreview';
import { getInterviewsForUser } from '../services/interview';
import { useAuth } from '../hooks/useAuth';

export const ViewInterviewsPage: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const { member } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        if (member) {
          const fetchedInterviews = await getInterviewsForUser();
          setInterviews(fetchedInterviews);
          setLoading(false);
        }
      } catch (error) {
        toast({
          title: 'Error fetching interviews',
          description: 'Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchInterviews();
  }, [member, toast]);

  return (
    <Box maxWidth="800px" margin="auto" p={4}>
      <Heading mb={6}>My Interviews</Heading>
      {loading && (
        <Center>
          <Spinner />
        </Center>
      )}

      {!loading && interviews.length === 0 ? (
        <VStack spacing={4} align="stretch">
          <Center marginTop={10}>
            <Heading size="md">Wow, so empty</Heading>
          </Center>
        </VStack>
      ) : (
        <VStack spacing={4} align="stretch">
          {interviews.map((interview) => (
            <InterviewPreview
              key={interview.interviewId}
              interview={interview}
            />
          ))}
        </VStack>
      )}
    </Box>
  );
};
