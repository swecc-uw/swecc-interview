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
} from '@chakra-ui/react';
import { Member, SocialField } from '../types';

interface MemberProfileEditProps {
  member: Member;
  onSave: (profile: Partial<Member>) => void;
}

const isSocialField = (field: keyof Member): boolean => {
  return field === 'linkedin' || field === 'github' || field === 'leetcode';
};

const shapeSocialField = (field: SocialField): SocialField => {
  return {
    username: field.username,
    isPrivate: field.isPrivate || false,
  };
};

const MemberProfileEdit: React.FC<MemberProfileEditProps> = ({
  member,
  onSave,
}) => {
  const [profile, setProfile] = useState<Partial<Member>>({
    bio: member.bio,
    major: member.major,
    gradDate: member.gradDate,
    linkedin: member.linkedin ? shapeSocialField(member.linkedin) : undefined,
    github: member.github ? shapeSocialField(member.github) : undefined,
    leetcode: member.leetcode ? shapeSocialField(member.leetcode) : undefined,
    local: member.local,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSocialFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [field, key] = e.target.name.split('.');

    if (!isSocialField(field as keyof Member)) return;

    setProfile((prevProfile) => ({
      ...prevProfile,
      [field]: {
        ...((prevProfile[field as keyof Member] as SocialField) || {}),
        [key]: e.target.value,
      },
    }));
  };

  const handleSocialFieldToggle = (field: keyof Member) => {
    field = field.split('.')[0] as keyof Member;

    if (!isSocialField(field)) return;

    setProfile((prevProfile) => {
      const socialField = prevProfile[field] as SocialField;
      return {
        ...prevProfile,
        [field]: {
          ...socialField,
          isPrivate: !socialField.isPrivate,
        },
      };
    });
  };

  const handleSave = () => {
    onSave(profile);
  };

  const githubIsInvalid =
    profile.github?.username.includes('http') ||
    profile.github?.username.includes('/');
  const leetcodeIsInvalid =
    profile.leetcode?.username.includes('http') ||
    profile.leetcode?.username.includes('/');

  return (
    <Box p={8} borderRadius="xl" boxShadow="lg">
      <VStack spacing={6}>
        <FormControl>
          <FormLabel colorScheme="brand">Bio</FormLabel>
          <Input
            colorScheme="brand"
            name="bio"
            value={profile.bio || ''}
            onChange={handleChange}
            placeholder="Enter your bio"
          />
        </FormControl>

        <FormControl>
          <FormLabel colorScheme="brand">Major</FormLabel>
          <Input
            colorScheme="brand"
            name="major"
            value={profile.major || ''}
            onChange={handleChange}
            placeholder="Enter your major"
          />
        </FormControl>

        <FormControl>
          <FormLabel colorScheme="brand">Graduation Date</FormLabel>
          <Input
            colorScheme="brand"
            name="gradDate"
            type="date"
            value={profile.gradDate || ''}
            onChange={handleChange}
            placeholder="Enter your graduation date"
          />
        </FormControl>

        <FormControl>
          <FormLabel colorScheme="brand">Location</FormLabel>
          <Input
            colorScheme="brand"
            name="local"
            value={profile.local || ''}
            onChange={handleChange}
            placeholder="Enter your location"
          />
        </FormControl>

        <FormControl>
          <FormLabel colorScheme="brand">LinkedIn</FormLabel>
          <HStack justifyContent="space-between" w="100%">
            <Input
              colorScheme="brand"
              name="linkedin.username"
              value={profile.linkedin?.username || ''}
              onChange={handleSocialFieldChange}
              placeholder="Enter your LinkedIn URL"
            />
            <Switch
              isDisabled={!profile.linkedin?.username}
              isChecked={profile.linkedin?.isPrivate}
              onChange={() => handleSocialFieldToggle('linkedin')}
            />
          </HStack>
        </FormControl>

        <FormControl>
          <FormLabel colorScheme="brand">GitHub</FormLabel>
          <HStack justifyContent="space-between" w="100%">
            <Input
              isInvalid={githubIsInvalid}
              colorScheme="brand"
              name="github.username"
              value={profile.github?.username || ''}
              onChange={handleSocialFieldChange}
              placeholder="Enter your GitHub URL"
            />
            <Switch
              isDisabled={!profile.github?.username}
              isChecked={profile.github?.isPrivate}
              onChange={() => handleSocialFieldToggle('github')}
            />
          </HStack>
          {githubIsInvalid && (
            <FormHelperText>
              Please enter a valid GitHub username
            </FormHelperText>
          )}
        </FormControl>

        <FormControl>
          <FormLabel colorScheme="brand">LeetCode</FormLabel>
          <HStack justifyContent="space-between" w="100%">
            <Input
              colorScheme="brand"
              isInvalid={leetcodeIsInvalid}
              name="leetcode.username"
              value={profile.leetcode?.username || ''}
              onChange={handleSocialFieldChange}
              placeholder="Enter your LeetCode URL"
            />
            <Switch
              isDisabled={!profile.leetcode?.username}
              isChecked={profile.leetcode?.isPrivate}
              onChange={() => handleSocialFieldToggle('leetcode')}
            />
          </HStack>
          {leetcodeIsInvalid && (
            <FormHelperText>
              Please enter a valid LeetCode username
            </FormHelperText>
          )}
        </FormControl>
        {!(githubIsInvalid || leetcodeIsInvalid) && (
          <Button colorScheme="brand" onClick={handleSave}>
            Save Changes
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default MemberProfileEdit;
