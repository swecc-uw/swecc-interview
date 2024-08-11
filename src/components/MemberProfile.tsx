import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Avatar,
  Stack,
} from '@chakra-ui/react';
import { Member } from '../types';
import { getMemberById } from '../services/mock/directory';

const MemberProfile: React.FC = () => {
  const { userId } = useParams();
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      if (!userId) {
        console.error('No user ID provided in URL');
        alert('No user ID provided in URL');
        return;
      }

      let parsedUserId;
      try {
        parsedUserId = parseInt(userId);
      } catch (error) {
        console.error('Invalid user ID provided in URL');
        return;
      }

      const memberData = await getMemberById(parsedUserId);
      setMember(memberData);
    };

    fetchMember();
  }, [userId]);

  if (!member) {
    return <Text>Loading...</Text>;
  }

  return (
    <Container maxW="container.lg" py={8}>
      <Box p={6} bg="white" borderRadius="lg" boxShadow="sm">
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
          <Avatar
            name={member.user.username}
            src={member.user.username}
            size="2xl"
          />
          <VStack align="start">
            <Heading as="h2" size="lg">
              {member.firstName} {member.lastName}
            </Heading>
            <Text>Username: {member.user.username}</Text>
            <Text>Email: {member.user.email}</Text>
            <Text>Major: {member.major}</Text>
            <Text>Graduation Date: {member.gradDate}</Text>
            <Text>Bio: {member.bio}</Text>
            <Text>Location: {member.local}</Text>
            {member.linkedin && (
              <Text>LinkedIn: {member.linkedin.username}</Text>
            )}
            {member.github && <Text>GitHub: {member.github.username}</Text>}
            {member.leetcode && (
              <Text>LeetCode: {member.leetcode.username}</Text>
            )}
          </VStack>
        </Stack>
      </Box>
    </Container>
  );
};

export default MemberProfile;
