import React from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Avatar,
  Link,
  Badge,
  useColorModeValue,
  SimpleGrid,
  Divider,
  Stack,
  Icon,
  Flex,
  Tooltip,
  Button,
  useClipboard,
  useToast,
} from '@chakra-ui/react';
import {
  FaGithub,
  FaLinkedin,
  FaExternalLinkAlt,
  FaDiscord,
  FaCode,
  FaCalendar,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaEnvelope,
  FaClock,
  FaIdBadge,
  FaUsers,
  FaCopy,
} from 'react-icons/fa';

interface SocialField {
  username: string;
}

interface Member {
  id: number;
  username: string;
  created: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  discordUsername: string;
  discordId: number;
  preview?: string;
  major?: string;
  gradDate?: string;
  linkedin?: SocialField;
  github?: SocialField;
  leetcode?: SocialField;
  resumeUrl?: string;
  local?: string;
  bio?: string;
  groups?: { name: string }[];
}

interface MemberProfileViewProps {
  member: Member;
}

const MemberProfileView: React.FC<MemberProfileViewProps> = ({ member }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconColor = useColorModeValue('gray.600', 'gray.400');
  const hoverColor = useColorModeValue('blue.500', 'blue.300');
  const sectionBg = useColorModeValue('gray.50', 'gray.700');

  const toast = useToast();
  const { onCopy: onDiscordCopy } = useClipboard(member.discordId?.toString());
  const { onCopy: onEmailCopy } = useClipboard(member.email);

  const formatDate = (dateString: string, includeTime: boolean = false) => {
    const date = new Date(dateString);
    const dateOptions: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };
    if (includeTime) {
      return date.toLocaleString('en-US', {
        ...dateOptions,
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return date.toLocaleDateString('en-US', dateOptions);
  };

  const SocialLink = ({
    icon,
    label,
    href,
    username,
  }: {
    icon: any;
    label: string;
    href: string;
    username: string;
  }) => (
    <Tooltip label={label}>
      <Link
        href={href}
        isExternal
        _hover={{ color: hoverColor, textDecoration: 'none' }}
        display="flex"
        alignItems="center"
        gap={2}
      >
        <Icon as={icon} boxSize={5} />
        <Text fontSize="sm">{username}</Text>
      </Link>
    </Tooltip>
  );

  const InfoItem = ({
    icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string | React.ReactNode;
  }) => (
    <Flex align="start" gap={2}>
      <Icon as={icon} color={iconColor} mt={1} />
      <Box>
        <Text fontWeight="semibold" fontSize="sm" color="gray.500">
          {label}
        </Text>
        <Text>{value}</Text>
      </Box>
    </Flex>
  );

  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      boxShadow="xl"
      border="1px"
      borderColor={borderColor}
      overflow="hidden"
      maxW="4xl"
      w="full"
    >
      {/* header */}
      <Box px={8} py={6}>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={8}
          align="center"
        >
          <Avatar
            size="2xl"
            name={`${member.firstName} ${member.lastName}`}
            src={member.preview}
            bg="blue.500"
          />
          <VStack align={{ base: 'center', md: 'start' }} spacing={3} flex="1">
            <Box>
              <Text fontSize="3xl" fontWeight="bold" lineHeight="shorter">
                {member.firstName} {member.lastName}
              </Text>
              <Text color="gray.500" fontSize="md">
                @{member.username}
              </Text>
            </Box>
            <HStack spacing={2} flexWrap="wrap">
              <Badge colorScheme="purple" fontSize="sm">
                {member.role}
              </Badge>
              {member.groups?.map((group) => (
                <Badge key={group.name} colorScheme="blue" fontSize="sm">
                  {group.name}
                </Badge>
              ))}
            </HStack>
          </VStack>
        </Stack>
      </Box>

      <Divider />

      {/* contact */}
      <Box px={8} py={6} bg={sectionBg}>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Contact Information
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <HStack spacing={2}>
            <Icon as={FaEnvelope} color={iconColor} />
            <Text flex="1">{member.email}</Text>
            <Button
              size="sm"
              leftIcon={<FaCopy />}
              onClick={() => {
                onEmailCopy();
                toast({
                  title: 'Email copied',
                  status: 'success',
                  duration: 2000,
                });
              }}
            >
              Copy
            </Button>
          </HStack>
          <HStack spacing={2}>
            <Icon as={FaDiscord} color={iconColor} />
            <Text flex="1">{member.discordUsername}</Text>
            <Button
              size="sm"
              leftIcon={<FaCopy />}
              onClick={() => {
                onDiscordCopy();
                toast({
                  title: 'Discord ID copied',
                  status: 'success',
                  duration: 2000,
                });
              }}
            >
              Copy ID
            </Button>
          </HStack>
        </SimpleGrid>
      </Box>

      <Divider />

      {/* profile info */}
      <Box px={8} py={6}>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Profile Details
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <VStack align="start" spacing={4}>
            <InfoItem
              icon={FaIdBadge}
              label="I am member number..."
              value={`#${member.id}`}
            />
            <InfoItem
              icon={FaClock}
              label="Member Since"
              value={formatDate(member.created, true)}
            />
            {member.major && (
              <InfoItem
                icon={FaGraduationCap}
                label="Major"
                value={member.major}
              />
            )}
            {member.gradDate && (
              <InfoItem
                icon={FaCalendar}
                label="Expected Graduation"
                value={formatDate(member.gradDate)}
              />
            )}
          </VStack>

          <VStack align="start" spacing={4}>
            {member.local && (
              <InfoItem
                icon={FaMapMarkerAlt}
                label="Location"
                value={member.local}
              />
            )}
            {member.groups && (
              <InfoItem
                icon={FaUsers}
                label="Groups"
                value={
                  <HStack spacing={2} flexWrap="wrap">
                    {member.groups.map((group) => (
                      <Badge key={group.name} colorScheme="green">
                        {group.name}
                      </Badge>
                    ))}
                  </HStack>
                }
              />
            )}
            {member.bio && (
              <Box>
                <Text fontWeight="semibold" fontSize="sm" color="gray.500">
                  Bio
                </Text>
                <Text mt={1}>{member.bio}</Text>
              </Box>
            )}
          </VStack>
        </SimpleGrid>
      </Box>

      <Divider />

      {/* social */}
      <Box px={8} py={6}>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          External Profiles & Links
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {member.github?.username && (
            <SocialLink
              icon={FaGithub}
              label="GitHub Profile"
              href={`https://github.com/${member.github.username}`}
              username={member.github.username}
            />
          )}
          {member.linkedin?.username && (
            <SocialLink
              icon={FaLinkedin}
              label="LinkedIn Profile"
              href={member.linkedin.username}
              username={member.linkedin.username}
            />
          )}
          {member.leetcode?.username && (
            <SocialLink
              icon={FaCode}
              label="LeetCode Profile"
              href={`https://leetcode.com/u/${member.leetcode.username}`}
              username={member.leetcode.username}
            />
          )}
          {member.resumeUrl && (
            <SocialLink
              icon={FaExternalLinkAlt}
              label="Resume"
              href={
                member.resumeUrl.startsWith('http')
                  ? member.resumeUrl
                  : `https://${member.resumeUrl}`
              }
              username="View Resume"
            />
          )}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default MemberProfileView;
