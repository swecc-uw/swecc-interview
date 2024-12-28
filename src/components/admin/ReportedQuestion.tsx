import React from 'react';
import { TechnicalQuestion } from '../../types';
import { Text, Link as ChakraLink, HStack } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { formatDate } from '../../localization';

interface Props {
  question: TechnicalQuestion;
}

export const ReportedQuestion: React.FC<Props> = ({ question }) => {
  return (
    <>
      <Text fontWeight="semibold">
        Reported question:{' '}
        <ChakraLink
          href={question.source}
          fontWeight="normal"
          color="blue.400"
          textAlign="center"
        >
          {question.title} <ExternalLinkIcon fontSize="small" />
        </ChakraLink>
      </Text>
      <HStack gap={1} alignItems="flex-start">
        <Text fontWeight="semibold">Approved by:</Text>
        <Text>
          {question.approvedBy ? `@${question.approvedBy}` : 'No one :('}
        </Text>
      </HStack>
      <HStack gap={1} alignItems="flex-start">
        <Text fontWeight="semibold">Last Assigned:</Text>
        <Text>
          {question.lastAssigned
            ? formatDate(question.lastAssigned, false)
            : 'Never'}
        </Text>
      </HStack>
    </>
  );
};
