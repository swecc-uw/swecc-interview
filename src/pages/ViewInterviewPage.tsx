import React from 'react';
import { Box, Heading, VStack, Spinner } from '@chakra-ui/react';
import { HydratedInterview } from '../types';
import { InterviewView } from '../components/InterviewView';

interface ViewInterviewPageParams {
  interview: HydratedInterview;
}

export const ViewInterviewPage: React.FC<ViewInterviewPageParams> = ({
  interview,
}) => {
  if (!interview) {
    return (
      <Box>
        <Spinner />
      </Box>
    );
  }

  return (
    <Box maxWidth="800px" margin="auto" p={4}>
      <VStack spacing={6} align="stretch">
        <Heading>Interview Details</Heading>
        <InterviewView interview={interview} />
      </VStack>
    </Box>
  );
};
