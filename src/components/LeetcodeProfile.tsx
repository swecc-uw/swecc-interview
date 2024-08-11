import { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Link,
  Text,
  VStack,
  Heading,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';

type LeetcodeProfileProps = {
  username: string;
};

type Stats = {
  easy: number;
  medium: number;
  hard: number;
};

const LeetcodeProfile = ({ username }: LeetcodeProfileProps) => {
  const [submissions, setSubmissions] = useState<Stats | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const profileCache: Record<string, Stats> = useMemo(() => ({}), []);

  useEffect(() => {
    if (profileCache[username]) {
      setSubmissions(profileCache[username]);
      setLoading(false);
    } else {
      setLoading(true);
      const fetchProfile = async () => {
        try {
          const response = await fetch(
            `https://alfa-leetcode-api.onrender.com/${username}/solved`
          );
          const data = await response.json();
          const {
            easySolved: easy,
            mediumSolved: medium,
            hardSolved: hard,
          } = data;
          const stats = { easy, medium, hard };
          profileCache[username] = stats;
          setSubmissions(stats);
        } catch (error) {
          console.error(error);
          setSubmissions({ easy: 0, medium: 0, hard: 0 });
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [username, profileCache]);

  const easyColor = useColorModeValue('green.500', 'green.300');
  const mediumColor = useColorModeValue('orange.500', 'orange.300');
  const hardColor = useColorModeValue('red.500', 'red.300');
  const totalColor = useColorModeValue('orange.500', 'orange.300');

  return loading ? (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Spinner />
    </Box>
  ) : (
    <Box p={6} textAlign="center">
      {submissions === undefined ? (
        <Text>Loading...</Text>
      ) : (
        <VStack spacing={1}>
          <Heading as="h3" size="lg">
            <Link href={`https://leetcode.com/${username}`} isExternal>
              {username}'s profile
            </Link>
          </Heading>
          <Text fontSize="xl" fontWeight="bold" color={totalColor}>
            Total: {submissions.easy + submissions.medium + submissions.hard}
          </Text>
          <Text fontSize="lg" color={easyColor}>
            Easy: {submissions.easy}
          </Text>
          <Text fontSize="lg" color={mediumColor}>
            Medium: {submissions.medium}
          </Text>
          <Text fontSize="lg" color={hardColor}>
            Hard: {submissions.hard}
          </Text>
        </VStack>
      )}
    </Box>
  );
};

export default LeetcodeProfile;
