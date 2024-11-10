import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import { Box, VStack, HStack, Text, Button } from '@chakra-ui/react';
import type { TechnicalQuestion } from '../../types';

interface TechnicalQuestionCardProps {
  question: TechnicalQuestion;
  isExpanded: boolean;
  onToggleExpand: (questionId: string) => void;
}

const TechnicalQuestionCard: React.FC<TechnicalQuestionCardProps> = ({
  question,
  isExpanded,
  onToggleExpand,
}) => {
  return (
    <Box className="p-4 border rounded-lg shadow-sm">
      <HStack className="space-x-4 justify-between">
        <HStack className="space-x-4 flex-1">
          <Text className="font-bold">{question.title}</Text>
          <Text>{question.topicName}</Text>
        </HStack>
        <Button
          onClick={() => onToggleExpand(question.questionId)}
          variant="outline"
          size="sm"
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </Button>
        <Link to={`/questions/technical/edit/${question.questionId}`}>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </Link>
      </HStack>

      {isExpanded && (
        <Box className="mt-4 p-4 border rounded-lg shadow-sm">
          <VStack className="space-y-4">
            <Box className="w-full">
              <Text className="font-bold">Prompt:</Text>
              <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
                {question.prompt}
              </ReactMarkdown>
            </Box>

            <Box className="w-full">
              <Text className="font-bold">Solution:</Text>
              <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
                {question.solution}
              </ReactMarkdown>
            </Box>

            <Box className="w-full">
              <Text className="font-bold">Follow Ups:</Text>
              <Text className="whitespace-pre-wrap">
                {question.followUps || 'N/A'}
              </Text>
            </Box>

            <Box className="w-full">
              <Text className="font-bold">Source:</Text>
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

            <Box className="w-full">
              <Text className="font-bold">Created by:</Text>
              <Text className="whitespace-pre-wrap">{question.createdBy}</Text>
            </Box>

            <Box className="w-full">
              <Text className="font-bold">Approved by:</Text>
              <Text className="whitespace-pre-wrap">
                {question.approvedBy || 'Admin'}
              </Text>
            </Box>

            <Box className="w-full">
              <Text className="font-bold">Last assigned:</Text>
              <Text className="whitespace-pre-wrap">
                {question.lastAssigned || 'Never'}
              </Text>
            </Box>

            <Box className="w-full">
              <Text className="font-bold">Created:</Text>
              <Text className="whitespace-pre-wrap">{question.created}</Text>
            </Box>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default TechnicalQuestionCard;
