import { useState, useMemo } from 'react';
import {
  VStack,
  Box,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  HStack,
  Badge,
  useColorModeValue,
  Button,
  Flex,
  Heading,
} from '@chakra-ui/react';
import { Search, Filter, XCircle } from 'lucide-react';
import { TechnicalQuestion } from '../../types';
import TechnicalQuestionCard from '../TechnicalQuestionCard';

interface TechnicalQuestionListProps {
  questions: TechnicalQuestion[];
}

const TechnicalQuestionList = ({ questions }: TechnicalQuestionListProps) => {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');

  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgColor = useColorModeValue('white', 'gray.800');
  const subtleColor = useColorModeValue('gray.600', 'gray.400');

  const topics = useMemo(
    () => Array.from(new Set(questions.map((q) => q.topicName))).sort(),
    [questions]
  );

  const filteredQuestions = useMemo(() => {
    let filtered = questions;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.title.toLowerCase().includes(query) ||
          q.prompt.toLowerCase().includes(query) ||
          q.topicName.toLowerCase().includes(query)
      );
    }

    if (selectedTopic !== 'all') {
      filtered = filtered.filter((q) => q.topicName === selectedTopic);
    }

    return filtered;
  }, [questions, searchQuery, selectedTopic]);

  const toggleExpand = (questionId: string) => {
    setExpandedQuestionId((prevId) =>
      prevId === questionId ? undefined : questionId
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTopic('all');
  };

  return (
    <Box>
      {/* filters */}
      <Box
        mb={6}
        p={4}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        bg={bgColor}
      >
        <VStack spacing={4}>
          <Flex width="full" justify="space-between" align="center">
            <Heading size="sm">filters</Heading>
            {(searchQuery || selectedTopic !== 'all') && (
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<XCircle size={16} />}
                onClick={clearFilters}
              >
                clear filters
              </Button>
            )}
          </Flex>

          <HStack width="full" spacing={4}>
            <InputGroup>
              <InputLeftElement>
                <Search size={16} color={subtleColor} />
              </InputLeftElement>
              <Input
                placeholder="search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            <Select
              width="200px"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              icon={<Filter size={16} />}
            >
              <option value="all">all topics</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </Select>
          </HStack>
        </VStack>
      </Box>

      {/* results  */}
      <HStack mb={4} spacing={3}>
        <Text color={subtleColor}>
          showing {filteredQuestions.length} of {questions.length} questions
        </Text>
        {selectedTopic !== 'all' && (
          <Badge colorScheme="purple" borderRadius="full" px={2}>
            {selectedTopic}
          </Badge>
        )}
      </HStack>

      {/* questions  */}
      <VStack spacing={4} align="stretch">
        {filteredQuestions.length === 0 ? (
          <Box
            p={8}
            textAlign="center"
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
            bg={bgColor}
          >
            <Text color={subtleColor}>no questions match your criteria</Text>
          </Box>
        ) : (
          filteredQuestions.map((question) => (
            <TechnicalQuestionCard
              key={question.questionId}
              question={question}
              isExpanded={expandedQuestionId === question.questionId}
              onToggleExpand={toggleExpand}
            />
          ))
        )}
      </VStack>
    </Box>
  );
};

export default TechnicalQuestionList;
