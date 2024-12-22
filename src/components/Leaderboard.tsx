import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Badge,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { ChevronUpIcon } from '@chakra-ui/icons';
import {
  GitHubStats,
  LeetCodeStats,
  LeaderboardType,
  GitHubOrderBy,
  LeetCodeOrderBy,
} from '../types';
import { devPrint } from './utils/RandomUtils';

interface LeaderboardProps {
  data: GitHubStats[] | LeetCodeStats[];
  type: LeaderboardType;
  orderBy: GitHubOrderBy | LeetCodeOrderBy;
}

type Header = {
  key: string;
  label: string;
};

type Row = {
  rank: number;
  username: string;
  totalSolved?: number;
  easySolved?: number;
  mediumSolved?: number;
  hardSolved?: number;
  totalCommits?: number;
  totalPrs?: number;
  followers?: number;
};

const Leaderboard: React.FC<LeaderboardProps> = ({ data, type, orderBy }) => {
  const isGitHub = type === LeaderboardType.GitHub;

  const headers = (): Header[] => {
    if (isGitHub) {
      return [
        { key: 'rank', label: 'Rank' },
        { key: 'username', label: 'Username' },
        { key: 'totalCommits', label: 'Commits' },
        { key: 'totalPrs', label: 'PRs' },
        { key: 'followers', label: 'Followers' },
      ];
    }
    return [
      { key: 'rank', label: 'Rank' },
      { key: 'username', label: 'Username' },
      { key: 'totalSolved', label: 'Total' },
      { key: 'easySolved', label: 'Easy' },
      { key: 'mediumSolved', label: 'Medium' },
      { key: 'hardSolved', label: 'Hard' },
    ];
  };

  const orderColKey = (): string => {
    if (isGitHub) {
      switch (orderBy as GitHubOrderBy) {
        case GitHubOrderBy.Commits:
          return 'totalCommits';
        case GitHubOrderBy.Prs:
          return 'totalPrs';
        case GitHubOrderBy.Followers:
          return 'followers';
        default:
          return '';
      }
    } else {
      switch (orderBy as LeetCodeOrderBy) {
        case LeetCodeOrderBy.Total:
          return 'totalSolved';
        case LeetCodeOrderBy.Easy:
          return 'easySolved';
        case LeetCodeOrderBy.Medium:
          return 'mediumSolved';
        case LeetCodeOrderBy.Hard:
          return 'hardSolved';
        case LeetCodeOrderBy.Completion:
          return 'totalSolved';
        default:
          return '';
      }
    }
  };

  const difficultyColor = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'green.500';
      case 'medium':
        return 'yellow.500';
      case 'hard':
        return 'red.500';
      default:
        return 'gray.500';
    }
  };

  const Cell = (row: Row, header: Header): React.ReactNode => {
    if (
      !headers()
        .map((h) => h.key)
        .includes(header.key)
    ) {
      devPrint('Invalid header key:', header.key);
      return null;
    }

    const key = header.key as keyof Row;

    if (key === 'rank') {
      return (
        <Text fontWeight="bold" fontSize="lg">
          #{row.rank}
        </Text>
      );
    }

    if (['easySolved', 'mediumSolved', 'hardSolved'].includes(key)) {
      return <Text color={difficultyColor(header.label)}>{row[key]}</Text>;
    }

    if (key === 'username') {
      return (
        <Flex align="center" gap={2}>
          <Text>{row[key]}</Text>
          {row.rank <= 3 && (
            <Badge
              colorScheme={
                row.rank === 1 ? 'yellow' : row.rank === 2 ? 'gray' : 'orange'
              }
            >
              {row.rank === 1 ? '👑' : `#${row.rank}`}
            </Badge>
          )}
        </Flex>
      );
    }

    return row[key];
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      shadow="sm"
    >
      <Table variant="simple">
        <Thead bg="gray.50">
          <Tr>
            {headers().map((header) => (
              <Th key={header.key} py={4}>
                <Flex align="center" gap={2}>
                  {header.label}
                  {header.key === orderColKey() && (
                    <Icon as={ChevronUpIcon} color="gray.500" />
                  )}
                </Flex>
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, index) => (
            <Tr
              key={row.username}
              bg={index % 2 === 0 ? 'white' : 'gray.50'}
              _hover={{ bg: 'gray.100' }}
            >
              {headers().map((header) => (
                <Td key={`${row.username}-${header.key}`}>
                  {Cell({ ...row, rank: index + 1 }, header)}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Leaderboard;
