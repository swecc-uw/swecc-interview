import React, { useEffect, useState } from 'react';

import {
  Box,
  Heading,
  VStack,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { HydratedInterview } from '../types';
import { InterviewPreview } from '../components/InterviewPreview';
import { getInterviewsHydratedForUser } from '../services/interview';
import { useAuth } from '../hooks/useAuth';
import { devPrint } from '../components/utils/RandomUtils';
import { ViewInterviewPage } from './ViewInterviewPage';

export const ViewInterviewsPage: React.FC = () => {
  // get id from the URL
  const url = window.location.href;
  const currId = url.split('/').pop();
  const [interviews, setInterviews] = useState<HydratedInterview[]>([]);
  const [loading, setLoading] = useState(true);
  const { member } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        if (member) {
          const fetchedInterviews = await getInterviewsHydratedForUser();
          setInterviews(fetchedInterviews);
          setLoading(false);
        }
      } catch (error) {
        devPrint(error);
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

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (currId) {
    const selected = interviews.find(
      (interview) => interview.interviewId === currId
    );
    if (selected) return <ViewInterviewPage interview={selected} />;
  }

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
