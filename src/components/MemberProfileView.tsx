import {
  Box,
  Text,
  VStack,
  Avatar,
  Link,
  useColorModeValue,
  SimpleGrid,
  Divider,
  Stack,
} from '@chakra-ui/react';
import { Member } from '../types';

interface MemberProfileViewProps {
  member: Member;
}

const MemberProfileView: React.FC<MemberProfileViewProps> = ({ member }) => {
  const color = useColorModeValue('gray.700', 'gray.300');

  return (
    <Box p={6} borderRadius="lg" boxShadow="md">
      <Stack
        direction={{ base: 'column', md: 'row' }}
        spacing={6}
        align="center"
      >
        <Avatar
          name={`${member.firstName} ${member.lastName}`}
          src={member.resumeUrl || ''}
          size="xl"
        />
        <VStack align="start" spacing={1} flex="1">
          <Text fontSize="2xl" fontWeight="bold">
            {member.firstName} {member.lastName}
          </Text>
          <Text fontSize="lg" color="gray.500">
            {member.role}
          </Text>
          <Text fontSize="md" color="gray.500">
            {member.email}
          </Text>
        </VStack>
      </Stack>
      <Divider my={4} />
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
        <VStack align="start" spacing={2}>
          <Text fontSize="md" color={color}>
            <b>Major:</b> {member.major}
          </Text>
          <Text fontSize="md" color={color}>
            <b>Graduation Date:</b> {member.gradDate}
          </Text>
          <Text fontSize="md" color={color}>
            <b>Discord:</b> {member.discordUsername}
          </Text>
        </VStack>
        <VStack align="start" spacing={2}>
          <Text fontSize="md" color={color}>
            <b>Location:</b> {member.local}
          </Text>
          <Text fontSize="md" color={color}>
            <b>Bio:</b> {member.bio}
          </Text>
        </VStack>
      </SimpleGrid>
      <Divider my={4} />
      <VStack align="start" spacing={2}>
        {member.resumeUrl && (
          <Text fontSize="md" color={color}>
            <b>Resume:</b>{' '}
            <Link
              href={
                member.resumeUrl.startsWith('http')
                  ? member.resumeUrl
                  : `https://${member.resumeUrl}`
              }
              isExternal
              color="teal.500"
            >
              {member.resumeUrl}
            </Link>
          </Text>
        )}
        {member.linkedin && (
          <Text fontSize="md" color={color}>
            <b>LinkedIn:</b>{' '}
            <Link
              href={
                member.linkedin.username.startsWith('http')
                  ? member.linkedin.username
                  : `https://${member.linkedin.username}`
              }
              isExternal
              color="teal.500"
            >
              {member.linkedin.username}
            </Link>
          </Text>
        )}
        {member.github && (
          <Text fontSize="md" color={color}>
            <b>GitHub:</b>{' '}
            <Link
              href={
                member.github.username.startsWith('http')
                  ? member.github.username
                  : `https://${member.github.username}`
              }
              isExternal
              color="teal.500"
            >
              {member.github.username}
            </Link>
          </Text>
        )}
        {member.leetcode && (
          <Text fontSize="md" color={color}>
            <b>LeetCode:</b>{' '}
            <Link
              href={
                member.leetcode.username.startsWith('http')
                  ? member.leetcode.username
                  : `https://${member.leetcode.username}`
              }
              isExternal
              color="teal.500"
            >
              {member.leetcode.username}
            </Link>
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default MemberProfileView;
