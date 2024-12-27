import React from 'react';
import { Member } from '../../types';
import { Text, Link as ChakraLink } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

interface Props {
  member: Member;
}

export const ReportedMember: React.FC<Props> = ({ member }) => {
  return (
    <Text fontWeight={'semibold'}>
      Reported member:{' '}
      <ChakraLink fontWeight="normal">
        <Link to={`/directory/${member.id}`}>@{member.username}</Link>
      </ChakraLink>
    </Text>
  );
};
