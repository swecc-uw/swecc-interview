import React from 'react';
import { Member } from '../../types';
import { Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

interface Props {
  member: Member;
}

export const ReportedMember: React.FC<Props> = ({ member }) => {
  return (
    <Text fontWeight="semibold">
      Reported member:{' '}
      <Link to={`/directory/${member.id}`}>@{member.username}</Link>
    </Text>
  );
};
