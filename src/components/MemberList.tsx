import React from 'react';
import { Link } from 'react-router-dom';
import { Box, VStack, HStack, Text, Avatar, Button } from '@chakra-ui/react';
import { Member } from '../types';

interface MemberListProps {
  members: Member[];
}

const MemberList: React.FC<MemberListProps> = ({ members }) => {
  return (
    <VStack spacing={4} align="stretch">
      {members.map((member) => (
        <Box
          key={member.user.id}
          p={4}
          borderWidth={1}
          borderRadius="lg"
          overflow="hidden"
          bg="white"
          boxShadow="sm"
        >
          <HStack spacing={4}>
            <Avatar name={member.user.username} src={member.user.username} />
            <VStack align="start">
              <Text fontWeight="bold">{member.user.username}</Text>
              <Text>{member.firstName} {member.lastName}</Text>
              <Link to={`/directory/${member.user.id}`}>
                <Button size="sm" colorScheme="teal">View Profile</Button>
              </Link>
            </VStack>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};

export default MemberList;
