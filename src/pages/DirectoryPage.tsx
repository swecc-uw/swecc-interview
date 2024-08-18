import React, { useState } from 'react';
import {
  Container,
  Input,
  VStack,
  Button,
  Heading,
  Stack,
} from '@chakra-ui/react';
import { searchMembers } from '../services/directory';
import { Member } from '../types';
import MemberList from '../components/MemberList';
import { devPrint } from '../components/utils/RandomUtils';

const DirectoryPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [members, setMembers] = useState<Member[]>([]);

  const handleSearch = async () => {
    try {
      const results = await searchMembers(query);
      setMembers(results);
    } catch (error) {
      devPrint('Error searching for members:', error);
      setMembers([]);
    }
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="lg">
          Member Directory
        </Heading>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
          <Input
            colorScheme="brand"
            placeholder="Search members by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button colorScheme="brand" onClick={handleSearch}>
            Search
          </Button>
        </Stack>
        <MemberList members={members} />
      </VStack>
    </Container>
  );
};

export default DirectoryPage;
