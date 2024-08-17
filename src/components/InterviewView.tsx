import React from 'react';
import { Box, Heading, Text, VStack, HStack, Badge } from '@chakra-ui/react';
import { Interview, TechnicalQuestion, BehavioralQuestion } from '../types';

interface InterviewViewProps {
  interview: Interview;
  technicalQuestions: TechnicalQuestion[];
  behavioralQuestions: BehavioralQuestion[];
}

export const InterviewView: React.FC<InterviewViewProps> = ({
  interview,
  technicalQuestions,
  behavioralQuestions,
}) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={6}>
      <VStack align="stretch" spacing={4}>
        <Heading size="lg">Interview Details</Heading>
        <HStack justify="space-between">
          <Text>
            Status:{' '}
            <Badge
              colorScheme={interview.status === 'active' ? 'green' : 'gray'}
            >
              {interview.status}
            </Badge>
          </Text>
          <Text>
            Date: {new Date(interview.dateEffective).toLocaleDateString()}
          </Text>
        </HStack>
        <Text>Interviewer: {interview.interviewer.username}</Text>
        <Text>Interviewee: {interview.interviewee.username}</Text>

        <Heading size="md" mt={4}>
          Technical Questions
        </Heading>
        {technicalQuestions.map((q, index) => (
          <Box key={q.questionId} p={4} borderWidth="1px" borderRadius="md">
            <Text fontWeight="bold">
              Question {index + 1}: {q.prompt}
            </Text>
            <Text mt={2}>Topic: {q.topic.name}</Text>
          </Box>
        ))}

        <Heading size="md" mt={4}>
          Behavioral Questions
        </Heading>
        {behavioralQuestions.map((q, index) => (
          <Box key={q.questionId} p={4} borderWidth="1px" borderRadius="md">
            <Text fontWeight="bold">
              Question {index + 1}: {q.prompt}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};
