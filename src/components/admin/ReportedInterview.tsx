import React from 'react';
import { HydratedInterview } from '../../types';
import { Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

interface Props {
  interview: HydratedInterview;
}

export const ReportedInterview: React.FC<Props> = ({ interview }) => {
  return (
    <>
      <Text fontWeight={'semibold'}>
        Interviewer:{' '}
        <Link to={`/directory/${interview.interviewer.id}`}>
          @{interview.interviewer.username}
        </Link>
      </Text>
    </>
  );
};
