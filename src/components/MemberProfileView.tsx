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
  Badge,
} from '@chakra-ui/react';
import { Member } from '../types';

interface MemberProfileViewProps {
  member: Member;
}

const MemberProfileView: React.FC<MemberProfileViewProps> = ({ member }) => {
  const linkColor = useColorModeValue('brand.500', 'brand.300');

  return (
    <Box
      p={8}
      borderRadius="xl"
      boxShadow="lg"
      bg={useColorModeValue('gray.800', 'gray.800')}
    >
      <Stack
        direction={{ base: 'column', md: 'row' }}
        spacing={8}
        align="center"
      >
        <Avatar name={`${member.firstName} ${member.lastName}`} size="2xl" />
        <VStack align="start" spacing={2} flex="1">
          <Text fontSize="3xl" fontWeight="bold">
            {member.firstName} {member.lastName}
          </Text>
          <Badge colorScheme="brand" fontSize="lg">
            {member.role}
          </Badge>
          <Text fontSize="md" color="gray.500">
            {member.email}
          </Text>
        </VStack>
      </Stack>
      <Divider my={6} />
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mt={6}>
        <VStack align="start" spacing={3}>
          {member.major && (
            <Text fontSize="md">
              <b>Major:</b> {member.major}
            </Text>
          )}
          {member.gradDate && (
            <Text fontSize="md">
              <b>Graduation Date:</b> {member.gradDate}
            </Text>
          )}
          <Text fontSize="md">
            <b>Discord:</b> {member.discordUsername}
          </Text>
        </VStack>
        <VStack align="start" spacing={3}>
          {member.local && (
            <Text fontSize="md">
              <b>Location:</b> {member.local}
            </Text>
          )}
          {member.bio && (
            <Text fontSize="md">
              <b>Bio:</b> {member.bio}
            </Text>
          )}
        </VStack>
      </SimpleGrid>
      <Divider my={6} />
      <VStack align="start" spacing={3}>
        {member.resumeUrl && (
          <Text fontSize="md">
            <b>Resume:</b>{' '}
            <Link
              href={
                member.resumeUrl.startsWith('http')
                  ? member.resumeUrl
                  : `https://${member.resumeUrl}`
              }
              isExternal
              color={linkColor}
            >
              View Resume
            </Link>
          </Text>
        )}
        {member.linkedin?.username && (
          <Text fontSize="md">
            <b>LinkedIn:</b>{' '}
            <Link href={member.linkedin.username} isExternal color={linkColor}>
              {member.linkedin.username}
            </Link>
          </Text>
        )}
        {member.github?.username && (
          <Text fontSize="md">
            <b>GitHub:</b>{' '}
            <Link
              href={`https://github.com/${member.github.username}`}
              isExternal
              color={linkColor}
            >
              {member.github.username}
            </Link>
          </Text>
        )}
        {member.leetcode?.username && (
          <Text fontSize="md">
            <b>LeetCode:</b>{' '}
            <Link
              href={`https://leetcode.com/u/${member.leetcode.username}`}
              isExternal
              color={linkColor}
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
