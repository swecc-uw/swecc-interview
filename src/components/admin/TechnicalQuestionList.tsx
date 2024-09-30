import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, VStack, HStack, Text, Button } from '@chakra-ui/react';
import { TechnicalQuestion } from '../../types';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import ReactMarkdown from 'react-markdown';

interface TechnicalQuestionListProps {
  questions: TechnicalQuestion[];
}

const TechnicalQuestionList: React.FC<TechnicalQuestionListProps> = ({
  questions,
}) => {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    null
  );

  const toggleExpand = (questionId: string) => {
    setExpandedQuestionId((prevId) =>
      prevId === questionId ? null : questionId
    );
  };

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
          <HStack spacing={4} justify="space-between">
            <HStack spacing={4} flex="1">
              <Text fontWeight="bold">{question.title}</Text>
              <Text>{question.topicName}</Text>
            </HStack>
            <Button
              size="sm"
              colorScheme="brand"
              onClick={() => toggleExpand(question.questionId)}
            >
              {expandedQuestionId === question.questionId
                ? 'Hide Details'
                : 'Show Details'}
            </Button>
            <Link to={`/questions/technical/edit/${question.questionId}`}>
              <Button size="sm" colorScheme="brand">
                Edit
              </Button>
            </Link>
          </HStack>

          {expandedQuestionId === question.questionId && (
            <Box mt={4} p={4} borderWidth={1} borderRadius="lg" boxShadow="sm">
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold">Prompt:</Text>
                  <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
                    {question.prompt}
                  </ReactMarkdown>
                </Box>

                <Box>
                  <Text fontWeight="bold">Solution:</Text>
                  <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
                    {question.solution}
                  </ReactMarkdown>
                </Box>

                <Box>
                  <Text fontWeight="bold">Follow Ups:</Text>
                  <Text whiteSpace="pre-wrap">
                    {question.followUps || 'N/A'}
                  </Text>
                </Box>

                <Box>
                  <Text fontWeight="bold">Source:</Text>
                  <Text>
                    <a
                      href={question.source || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {question.source || 'N/A'}
                    </a>
                  </Text>
                </Box>

                <Box>
                  <Text fontWeight="bold">Created by:</Text>
                  <Text whiteSpace="pre-wrap">{question.createdBy}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold">Approved by:</Text>
                  <Text whiteSpace="pre-wrap">
                    {question.approvedBy || 'Admin'}
                  </Text>
                </Box>

                <Box>
                  <Text fontWeight="bold">Last assigned:</Text>
                  <Text whiteSpace="pre-wrap">
                    {question.lastAssigned || 'Never'}
                  </Text>
                </Box>

                <Box>
                  <Text fontWeight="bold">Created:</Text>
                  <Text whiteSpace="pre-wrap">{question.created}</Text>
                </Box>
              </VStack>
            </Box>
          )}
        </Box>
      ))}
    </VStack>
  );
};

export default TechnicalQuestionList;
