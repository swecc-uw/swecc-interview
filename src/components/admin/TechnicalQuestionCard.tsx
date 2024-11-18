import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Collapse,
  Divider,
  Grid,
  GridItem,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Calendar,
  Link as LinkIcon,
  User,
  CheckCircle,
  Clock,
  FileText,
} from 'lucide-react';
import type { TechnicalQuestion } from '../../types';

interface TechnicalQuestionCardProps {
  question: TechnicalQuestion;
  isExpanded: boolean;
  onToggleExpand: (questionId: string) => void;
}

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}) => {
  const labelColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <HStack spacing={3} align="flex-start">
      <Box color={labelColor}>{icon}</Box>
      <VStack align="stretch" spacing={0}>
        <Text fontSize="sm" color={labelColor} fontWeight="medium">
          {label}
        </Text>
        <Text>{value}</Text>
      </VStack>
    </HStack>
  );
};

const TechnicalQuestionCard = ({
  question,
  isExpanded,
  onToggleExpand,
}: TechnicalQuestionCardProps) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgColor = useColorModeValue('white', 'gray.800');
  const expandedBg = useColorModeValue('gray.50', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <Card
      variant="outline"
      bg={bgColor}
      borderColor={borderColor}
      transition="all 0.2s"
      _hover={{ shadow: 'md' }}
    >
      <CardHeader>
        <HStack justify="space-between" spacing={4}>
          <HStack spacing={4} flex={1}>
            <VStack align="flex-start" spacing={2}>
              <Text fontWeight="bold" fontSize="lg">
                {question.title}
              </Text>
              <Badge colorScheme="purple" px={2} py={1} borderRadius="full">
                {question.topicName}
              </Badge>
            </VStack>
          </HStack>
          <HStack spacing={2}>
            <Button
              onClick={() => onToggleExpand(question.questionId)}
              variant="ghost"
              size="sm"
              rightIcon={
                isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />
              }
              _hover={{ bg: hoverBg }}
            >
              {isExpanded ? 'Hide Details' : 'Show Details'}
            </Button>
            <Link to={`/questions/technical/edit/${question.questionId}`}>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Edit2 size={16} />}
                _hover={{ bg: hoverBg }}
              >
                Edit
              </Button>
            </Link>
          </HStack>
        </HStack>
      </CardHeader>

      <Collapse in={isExpanded}>
        <CardBody pt={0}>
          <Divider my={4} />
          <VStack spacing={6} align="stretch">
            <Box>
              <Text fontWeight="semibold" mb={2}>
                prompt
              </Text>
              <Box p={4} bg={expandedBg} borderRadius="md">
                <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
                  {question.prompt}
                </ReactMarkdown>
              </Box>
            </Box>

            <Box>
              <Text fontWeight="semibold" mb={2}>
                solution
              </Text>
              <Box p={4} bg={expandedBg} borderRadius="md">
                <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
                  {question.solution}
                </ReactMarkdown>
              </Box>
            </Box>

            {question.followUps && (
              <Box>
                <Text fontWeight="semibold" mb={2}>
                  follow-up questions
                </Text>
                <Box p={4} bg={expandedBg} borderRadius="md">
                  <Text whiteSpace="pre-wrap">{question.followUps}</Text>
                </Box>
              </Box>
            )}

            <Divider />

            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
              gap={4}
            >
              <GridItem>
                <InfoRow
                  icon={<User size={16} />}
                  label="created by"
                  value={question.createdBy}
                />
              </GridItem>
              <GridItem>
                <InfoRow
                  icon={<CheckCircle size={16} />}
                  label="approved by"
                  value={question.approvedBy || 'Admin'}
                />
              </GridItem>
              <GridItem>
                <InfoRow
                  icon={<Clock size={16} />}
                  label="last assigned"
                  value={question.lastAssigned || 'Never'}
                />
              </GridItem>
              <GridItem>
                <InfoRow
                  icon={<Calendar size={16} />}
                  label="created"
                  value={new Date(question.created).toLocaleDateString()}
                />
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <InfoRow
                  icon={<LinkIcon size={16} />}
                  label="source"
                  value={
                    question.source ? (
                      <a
                        href={question.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: 'blue.500',
                          textDecoration: 'underline',
                        }}
                      >
                        {question.source}
                      </a>
                    ) : (
                      'N/A'
                    )
                  }
                />
              </GridItem>
            </Grid>
          </VStack>
        </CardBody>
      </Collapse>
    </Card>
  );
};

export default TechnicalQuestionCard;
