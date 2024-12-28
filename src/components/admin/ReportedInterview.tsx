import React from 'react';
import { HydratedInterview } from '../../types';
import { Text, Link as ChakraLink } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ExternalLinkIcon } from '@chakra-ui/icons';

interface Props {
  interview: HydratedInterview;
}

export const ReportedInterview: React.FC<Props> = ({ interview }) => {
  const technicalQuestions = interview.technicalQuestions ?? [];
  const behavioralQuestions = interview.behavioralQuestions ?? [];

  return (
    <>
      <Text fontWeight="semibold">
        Interviewer:{' '}
        <Link to={`/directory/${interview.interviewer.id}`}>
          @{interview.interviewer.username}
        </Link>
      </Text>
      <Text fontWeight="semibold">
        Interviewee:{' '}
        <Link to={`/directory/${interview.interviewee.id}`}>
          @{interview.interviewee.username}
        </Link>
      </Text>
      {technicalQuestions.length > 0 && (
        <Text fontWeight="semibold">
          Technical Questions:
          <br />
          {technicalQuestions.map((question, idx) => (
            <ChakraLink
              href={question.source}
              fontWeight="normal"
              color="blue.400"
              textAlign="center"
              key={idx}
            >
              {question.title} <ExternalLinkIcon fontSize="small" />
            </ChakraLink>
          ))}
        </Text>
      )}
      {behavioralQuestions.length > 0 && (
        <Text fontWeight="semibold">
          Behavioral Questions:{' '}
          {behavioralQuestions.map((question, idx) => (
            <Text fontWeight="normal" key={idx}>
              {question.prompt}
            </Text>
          ))}
        </Text>
      )}
    </>
  );
};
