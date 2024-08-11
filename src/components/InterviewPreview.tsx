import React from 'react';
import { Box, Text, Badge, Flex, useColorModeValue } from '@chakra-ui/react';
import { Interview } from '../types';
import { useNavigate } from 'react-router-dom';

interface InterviewPreviewProps {
  interview: Interview;
}

export const InterviewPreview: React.FC<InterviewPreviewProps> = ({
  interview,
}) => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      mb={4}
      bg={bgColor}
      borderColor={borderColor}
      cursor="pointer"
      onClick={() => navigate(`/interviews/${interview.interviewId}`)}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontWeight="bold">
          Interview with {interview.interviewee.username}
        </Text>
        <Badge colorScheme={interview.status === 'active' ? 'green' : 'gray'}>
          {interview.status}
        </Badge>
      </Flex>
      <Text mt={2}>Interviewer: {interview.interviewer.username}</Text>
      <Text>
        Date: {new Date(interview.dateEffective).toLocaleDateString()}
      </Text>
    </Box>
  );
};
