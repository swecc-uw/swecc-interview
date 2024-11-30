import React from 'react';
import { Link } from 'react-router-dom';
import { Box, VStack, HStack, Text, Avatar, Button } from '@chakra-ui/react';
import { Member } from '../types';
import { resolveName } from './utils/RandomUtils';

interface MemberListProps {
  members: Member[];
}

const MemberList: React.FC<MemberListProps> = ({ members }) => {
  return (
    <VStack spacing={4} align="stretch">
      {members.map((member) => (
        <Box
          key={member.id}
          p={4}
          borderWidth={1}
          borderRadius="lg"
          overflow="hidden"
          boxShadow="sm"
        >
          <HStack spacing={4}>
            <Avatar name={resolveName(member)} src={member.profilePictureUrl} />
            <VStack align="start">
              <Text fontWeight="bold">{member.username}</Text>
              <Text>{resolveName(member)}</Text>
              <Link to={`/directory/${member.id}`}>
                <Button size="sm" colorScheme="brand">
                  View Profile
                </Button>
              </Link>
            </VStack>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};

export default MemberList;
