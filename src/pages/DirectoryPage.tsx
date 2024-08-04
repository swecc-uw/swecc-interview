import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Input, VStack, Button, Heading, Stack, Text } from '@chakra-ui/react';
import { searchMembers } from '../services/mock/directory';
import { Member } from '../types';
import MemberList from '../components/MemberList';

const DirectoryPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    const results = await searchMembers(query);
    setMembers(results);
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="lg">Member Directory</Heading>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
          <Input
            placeholder="Search members by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button colorScheme="teal" onClick={handleSearch}>Search</Button>
        </Stack>
        <MemberList members={members} />
      </VStack>
    </Container>
  );
};

export default DirectoryPage;
