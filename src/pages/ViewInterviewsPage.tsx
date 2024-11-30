import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  VStack,
  useToast,
  Spinner,
  Center,
  HStack,
  Select,
  Text,
  Input,
  Badge,
  Flex,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react';
import { Calendar } from 'lucide-react';
import { HydratedInterview, Status } from '../types';
import { getInterviewsHydratedForUser } from '../services/interview';
import { useAuth } from '../hooks/useAuth';
import { devPrint, resolveName } from '../components/utils/RandomUtils';
import { ViewInterviewPage } from './ViewInterviewPage';
import { DISABLE_INTERVIEW_STATUS_FLAG } from '../feature-flag';
import {
  formatDate,
  parseAnyDate,
  toDateInputFormat,
  getLastSunday,
} from '../localization';

interface DateRange {
  start: string;
  end: string;
}

interface InterviewStatusBadgeProps {
  status: Status;
}

interface InterviewPreviewProps {
  interview: HydratedInterview;
}

const InterviewStatusBadge: React.FC<InterviewStatusBadgeProps> = ({
  status,
}) => {
  const statusColors = {
    active: 'green',
    pending: 'yellow',
    inactive: 'gray',
  };

  return (
    <Badge colorScheme={statusColors[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const InterviewPreview: React.FC<InterviewPreviewProps> = ({ interview }) => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const subtleColor = useColorModeValue('gray.600', 'gray.400');

  const { interviewer, interviewee } = interview;

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={6}
      bg={bgColor}
      borderColor={borderColor}
      cursor="pointer"
      transition="all 0.2s"
      _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
      onClick={() => navigate(`/interviews/${interview.interviewId}`)}
    >
      <Flex direction="column" gap={4}>
        {/* status and date */}
        <Flex justifyContent="space-between" alignItems="center">
          <HStack spacing={2}>
            <Calendar size={16} />
            <Text fontSize="sm" color={subtleColor}>
              {formatDate(interview.dateEffective)}
            </Text>
          </HStack>
          {!DISABLE_INTERVIEW_STATUS_FLAG && (
            <InterviewStatusBadge status={interview.status} />
          )}
        </Flex>

        {/* participants */}
        <Flex justifyContent="space-between" gap={4}>
          <Flex alignItems="center" gap={3}>
            <Avatar
              size="md"
              name={resolveName(interviewer)}
              src={interviewer.profilePictureUrl}
            />
            <Box>
              <Text fontWeight="bold" color={textColor}>
                {resolveName(interviewer)}
              </Text>
              <Badge colorScheme="blue">Interviewer</Badge>
              <Text fontSize="sm" color={subtleColor}>
                {interviewer.role}
              </Text>
            </Box>
          </Flex>

          <Flex alignItems="center" gap={3}>
            <Box textAlign="right">
              <Text fontWeight="bold" color={textColor}>
                {resolveName(interviewee)}
              </Text>
              <Badge colorScheme="green">Interviewee</Badge>
              {interviewee.major && interviewee.major.length > 0 && (
                <Text fontSize="sm" color={subtleColor}>
                  {interviewee.major}
                </Text>
              )}
            </Box>
            <Avatar
              size="md"
              name={resolveName(interviewee)}
              src={interviewee.profilePictureUrl}
            />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export const ViewInterviewsPage: React.FC = () => {
  const url = window.location.href;
  const currId = url.split('/').pop();
  const [interviews, setInterviews] = useState<HydratedInterview[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<
    HydratedInterview[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: toDateInputFormat(getLastSunday()),
    end: '',
  });
  const [statusFilter, setStatusFilter] = useState<'all' | Status>('all');
  const { member } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        if (member) {
          const fetchedInterviews = await getInterviewsHydratedForUser();
          setInterviews(fetchedInterviews);
          setFilteredInterviews(fetchedInterviews);
          setLoading(false);
        }
      } catch (error) {
        devPrint(error);
        toast({
          title: 'Error fetching interviews',
          description: 'Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchInterviews();
  }, [member, toast]);

  useEffect(() => {
    let filtered = [...interviews];

    // date filter
    if (dateRange.start) {
      filtered = filtered.filter(
        (interview) =>
          parseAnyDate(interview.dateEffective) >= parseAnyDate(dateRange.start)
      );
    }
    if (dateRange.end) {
      filtered = filtered.filter(
        (interview) =>
          parseAnyDate(interview.dateEffective) <= parseAnyDate(dateRange.end)
      );
    }

    // status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (interview) => interview.status === statusFilter
      );
    }

    filtered.sort(
      (a, b) =>
        new Date(b.dateEffective).getTime() -
        new Date(a.dateEffective).getTime()
    );

    setFilteredInterviews(filtered);
  }, [interviews, dateRange, statusFilter]);

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (currId) {
    const selected = interviews.find(
      (interview) => interview.interviewId === currId
    );

    // epitome of programming right here
    if (selected) return <ViewInterviewPage interview={selected} />;
  }

  return (
    <Box maxWidth="800px" margin="auto" p={4}>
      <VStack spacing={6} align="stretch">
        <Heading>My Interviews</Heading>

        {/* filters control */}
        <HStack spacing={4} wrap="wrap">
          <Box flex="1" minW="200px">
            <Text mb={2} fontSize="sm">
              Start Date
            </Text>
            <Input
              type="date"
              value={toDateInputFormat(dateRange.start)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDateRange((prev) => ({ ...prev, start: e.target.value }))
              }
            />
          </Box>
          <Box flex="1" minW="200px">
            <Text mb={2} fontSize="sm">
              End Date
            </Text>
            <Input
              type="date"
              value={toDateInputFormat(dateRange.end)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDateRange((prev) => ({ ...prev, end: e.target.value }))
              }
            />
          </Box>
          {!DISABLE_INTERVIEW_STATUS_FLAG && (
            <Box flex="1" minW="200px">
              <Text mb={2} fontSize="sm">
                Status
              </Text>
              <Select
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setStatusFilter(e.target.value as 'all' | Status)
                }
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </Select>
            </Box>
          )}
        </HStack>

        {/* results */}
        {filteredInterviews.length === 0 ? (
          <Center p={8}>
            <VStack spacing={2}>
              <Text fontSize="lg" fontWeight="medium">
                No interviews found
              </Text>
              <Text color="gray.500">Try adjusting your filters</Text>
            </VStack>
          </Center>
        ) : (
          <VStack spacing={4} align="stretch">
            {filteredInterviews.map((interview) => (
              <InterviewPreview
                key={interview.interviewId}
                interview={interview}
              />
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
};
