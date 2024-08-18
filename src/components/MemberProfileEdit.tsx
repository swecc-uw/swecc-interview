import { useState } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  HStack,
} from '@chakra-ui/react';
import { Member } from '../types';

interface MemberProfileEditProps {
  member: Member;
  onSave: (profile: Partial<Member>) => void;
}

const MemberProfileEdit: React.FC<MemberProfileEditProps> = ({
  member,
  onSave,
}) => {
  const [profile, setProfile] = useState<Partial<Member>>(member);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleSave = () => {
    onSave(profile);
  };

  return (
    <Box p={8} rounded="lg" shadow="lg">
      <VStack spacing={4} align="stretch">
        <HStack spacing={4}>
          <FormControl>
            <FormLabel>First Name</FormLabel>
            <Input
              colorScheme="brand"
              name="firstName"
              value={profile.firstName || ''}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Last Name</FormLabel>
            <Input
              colorScheme="brand"
              name="lastName"
              value={profile.lastName || ''}
              onChange={handleChange}
            />
          </FormControl>
        </HStack>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            colorScheme="brand"
            name="email"
            value={profile.email || ''}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Major</FormLabel>
          <Input
            colorScheme="brand"
            name="major"
            value={profile.major || ''}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Graduation Date</FormLabel>
          <Input
            colorScheme="brand"
            name="gradDate"
            value={profile.gradDate || ''}
            onChange={handleChange}
            type="date"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Discord Username</FormLabel>
          <Input
            name="discordUsername"
            value={profile.discordUsername || ''}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Location</FormLabel>
          <Input
            colorScheme="brand"
            name="local"
            value={profile.local || ''}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Bio</FormLabel>
          <Textarea
            colorScheme="brand"
            name="bio"
            value={profile.bio || ''}
            onChange={handleChange}
          />
        </FormControl>
        <Button colorScheme="brand" onClick={handleSave} alignSelf="end">
          Save
        </Button>
      </VStack>
    </Box>
  );
};

export default MemberProfileEdit;
