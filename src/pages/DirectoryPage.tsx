import React, { useState } from 'react';
import {
  Container,
  Input,
  VStack,
  Button,
  Heading,
  Stack,
  FormControl,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { searchMembers } from '../services/directory';
import { Member } from '../types';
import MemberList from '../components/MemberList';
import { devPrint } from '../components/utils/RandomUtils';

const DirectoryPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const results = await searchMembers(query);
      setMembers(results);
    } catch (error) {
      devPrint('Error searching for members:', error);
      setMembers([]);
    }
    setLoading(false);
  };

  const qChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value);

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="lg">
          Member Directory
        </Heading>
        <form onSubmit={handleSearch}>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
            <FormControl>
              <Input colorScheme="brand" value={query} onChange={qChange} />
            </FormControl>
            <Button colorScheme="brand" type="submit">
              Search
            </Button>
          </Stack>
        </form>
        {loading ? (
          <Center mt={10}>
            <Spinner />
          </Center>
        ) : (
          <MemberList members={members} />
        )}
      </VStack>
    </Container>
  );
};

export default DirectoryPage;
