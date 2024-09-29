import React from 'react';
import { Link } from 'react-router-dom';
import { Box, VStack, HStack, Text, Button } from '@chakra-ui/react';
import { TechnicalQuestion } from '../../types';

interface MemberListProps {
  questions: TechnicalQuestion[];
}

const TechnicalQuestionList: React.FC<MemberListProps> = ({ questions }) => {
  return (
    <VStack spacing={4} align="stretch">
      {questions.map((question) => (
        <Box
          key={question.questionId}
          p={4}
          borderWidth={1}
          borderRadius="lg"
          overflow="hidden"
          boxShadow="sm"
        >
          <HStack spacing={4}>
            <Text fontWeight="bold">{question.title}</Text>
            <Text>{question.topicName}</Text>
            <Link to={`/questions/technical/edit/${question.questionId}`}>
              <Button size="sm" colorScheme="brand">
                Edit
              </Button>
            </Link>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};

export default TechnicalQuestionList;
