import React, { useState } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Button,
  HStack,
  FormHelperText,
  useColorModeValue,
  Text,
  SimpleGrid,
  Divider,
  Stack,
  Avatar,
  Icon,
  Tooltip,
  Badge,
} from '@chakra-ui/react';
import {
  FaGithub,
  FaLinkedin,
  FaCode,
  FaCalendar,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaUserEdit,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { Member, SocialField } from '../types';
import ProfilePictureUpload from './ProfilePictureUpload';

interface MemberProfileEditProps {
  member: Member;
  onSave: (profile: Partial<Member>) => void;
}

const isSocialField = (field: keyof Member): boolean => {
  return field === 'linkedin' || field === 'github' || field === 'leetcode';
};

const FormSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Box w="full">
    <Text fontSize="lg" fontWeight="bold" mb={4}>
      {title}
    </Text>
    {children}
  </Box>
);

const MemberProfileEdit: React.FC<MemberProfileEditProps> = ({
  member,
  onSave,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconColor = useColorModeValue('gray.600', 'gray.400');
  const sectionBg = useColorModeValue('gray.50', 'gray.700');

  const [profile, setProfile] = useState<Partial<Member>>({
    firstName: member.firstName,
    lastName: member.lastName,
    bio: member.bio,
    major: member.major,
    gradDate: member.gradDate,
    linkedin: member.linkedin,
    github: member.github,
    leetcode: member.leetcode,
    local: member.local,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [field, key] = e.target.name.split('.');
    if (!isSocialField(field as keyof Member)) return;

    setProfile((prev) => ({
      ...prev,
      [field]: {
        ...((prev[field as keyof Member] as SocialField) || {}),
        [key]: e.target.value,
      },
    }));
  };

  const handleSocialFieldToggle = (field: keyof Member) => {
    field = field.split('.')[0] as keyof Member;
    if (!isSocialField(field)) return;

    setProfile((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field] as SocialField),
        isPrivate: !(prev[field] as SocialField)?.isPrivate,
      },
    }));
  };
  const githubRegex = new RegExp(
    '^(https?:\\/\\/)?(www\\.)?github\\.com\\/.+$'
  );
  const leetcodeRegex = new RegExp(
    '^(https?:\\/\\/)?(www\\.)?leetcode\\.com\\/.+$'
  );

  const githubIsInvalid: boolean =
    profile.github?.username !== undefined &&
    profile.github?.username !== '' &&
    !githubRegex.test(profile.github?.username);
  const leetcodeIsInvalid: boolean =
    profile.leetcode?.username !== undefined &&
    profile.leetcode?.username !== '' &&
    !leetcodeRegex.test(profile.leetcode?.username);

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
            name={`${profile.firstName} ${profile.lastName}`}
            src={member.preview}
            bg="blue.500"
          />
          <VStack align={{ base: 'center', md: 'start' }} spacing={3} flex="1">
            <HStack spacing={2}>
              <Icon as={FaUserEdit} color={iconColor} />
              <Text fontSize="lg" fontWeight="bold">
                Edit Profile
              </Text>
            </HStack>
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

      {/* profile info */}
      <Box px={8} py={6} bg={sectionBg}>
        <FormSection title="Basic Information">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl>
              <FormLabel>First Name</FormLabel>
              <Input
                name="firstName"
                value={profile.firstName || ''}
                onChange={handleChange}
                placeholder="Enter your first name"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Last Name</FormLabel>
              <Input
                name="lastName"
                value={profile.lastName || ''}
                onChange={handleChange}
                placeholder="Enter your last name"
              />
            </FormControl>
          </SimpleGrid>
        </FormSection>
      </Box>

      <Divider />

      <Box px={8} py={6}>
        <FormSection title="Academic Information">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl>
              <FormLabel>
                <HStack spacing={2}>
                  <Icon as={FaGraduationCap} color={iconColor} />
                  <Text>Major</Text>
                </HStack>
              </FormLabel>
              <Input
                name="major"
                value={profile.major || ''}
                onChange={handleChange}
                placeholder="Enter your major"
              />
            </FormControl>
            <FormControl>
              <FormLabel>
                <HStack spacing={2}>
                  <Icon as={FaCalendar} color={iconColor} />
                  <Text>Graduation Date</Text>
                </HStack>
              </FormLabel>
              <Input
                name="gradDate"
                type="date"
                value={profile.gradDate || ''}
                onChange={handleChange}
              />
            </FormControl>
          </SimpleGrid>
        </FormSection>
      </Box>

      <Divider />

      <Box px={8} py={6} bg={sectionBg}>
        <FormSection title="Additional Information">
          <VStack spacing={6}>
            <FormControl>
              <FormLabel>
                <HStack spacing={2}>
                  <Icon as={FaMapMarkerAlt} color={iconColor} />
                  <Text>Location</Text>
                </HStack>
              </FormLabel>
              <Input
                name="local"
                value={profile.local || ''}
                onChange={handleChange}
                placeholder="Enter your location"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Bio</FormLabel>
              <Input
                name="bio"
                value={profile.bio || ''}
                onChange={handleChange}
                placeholder="Tell us about yourself"
              />
            </FormControl>
          </VStack>
        </FormSection>
      </Box>

      <Divider />

      {/* socials */}
      <Box px={8} py={6}>
        <FormSection title="Social Links">
          <VStack spacing={6}>
            <FormControl>
              <FormLabel>
                <HStack spacing={2}>
                  <Icon as={FaLinkedin} color={iconColor} />
                  <Text>LinkedIn</Text>
                </HStack>
              </FormLabel>
              <HStack spacing={2}>
                <Input
                  name="linkedin.username"
                  value={profile.linkedin?.username || ''}
                  onChange={handleSocialFieldChange}
                  placeholder="Enter your LinkedIn URL"
                />
                <Tooltip
                  label={
                    profile.linkedin?.username
                      ? 'Toggle visibility'
                      : 'Add username first'
                  }
                >
                  <Switch
                    isDisabled={!profile.linkedin?.username}
                    isChecked={profile.linkedin?.isPrivate}
                    onChange={() => handleSocialFieldToggle('linkedin')}
                  />
                </Tooltip>
              </HStack>
            </FormControl>

            <FormControl isInvalid={githubIsInvalid}>
              <FormLabel>
                <HStack spacing={2}>
                  <Icon as={FaGithub} color={iconColor} />
                  <Text>GitHub</Text>
                </HStack>
              </FormLabel>
              <HStack spacing={2}>
                <Input
                  name="github.username"
                  value={profile.github?.username || ''}
                  onChange={handleSocialFieldChange}
                  placeholder="Enter your GitHub username"
                />
                <Tooltip
                  label={
                    profile.github?.username
                      ? 'Toggle visibility'
                      : 'Add username first'
                  }
                >
                  <Switch
                    isDisabled={!profile.github?.username}
                    isChecked={profile.github?.isPrivate}
                    onChange={() => handleSocialFieldToggle('github')}
                  />
                </Tooltip>
              </HStack>
              {githubIsInvalid && (
                <FormHelperText color="red.500">
                  <Icon as={FaExclamationTriangle} mr={1} />
                  Please enter a valid GitHub username
                </FormHelperText>
              )}
            </FormControl>

            <FormControl isInvalid={leetcodeIsInvalid}>
              <FormLabel>
                <HStack spacing={2}>
                  <Icon as={FaCode} color={iconColor} />
                  <Text>LeetCode</Text>
                </HStack>
              </FormLabel>
              <HStack spacing={2}>
                <Input
                  name="leetcode.username"
                  value={profile.leetcode?.username || ''}
                  onChange={handleSocialFieldChange}
                  placeholder="Enter your LeetCode username"
                />
                <Tooltip
                  label={
                    profile.leetcode?.username
                      ? 'Toggle visibility'
                      : 'Add username first'
                  }
                >
                  <Switch
                    isDisabled={!profile.leetcode?.username}
                    isChecked={profile.leetcode?.isPrivate}
                    onChange={() => handleSocialFieldToggle('leetcode')}
                  />
                </Tooltip>
              </HStack>
              {leetcodeIsInvalid && (
                <FormHelperText color="red.500">
                  <Icon as={FaExclamationTriangle} mr={1} />
                  Please enter a valid LeetCode username
                </FormHelperText>
              )}
            </FormControl>
          </VStack>
        </FormSection>
      </Box>

      <Divider />

      {/* save */}
      <Box px={8} py={6} textAlign="right">
        <Button
          colorScheme="blue"
          size="lg"
          isDisabled={githubIsInvalid || leetcodeIsInvalid}
          onClick={() => onSave(profile)}
          leftIcon={<Icon as={FaUserEdit} />}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default MemberProfileEdit;
