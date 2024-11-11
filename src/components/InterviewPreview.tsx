import {
  Box,
  Text,
  Badge,
  Flex,
  Avatar,
  useColorModeValue,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { HydratedInterview } from '../types';
import { useNavigate } from 'react-router-dom';
import { resolveName } from './utils/RandomUtils';

interface InterviewPreviewProps {
  interview: HydratedInterview;
}

export const InterviewPreview: React.FC<InterviewPreviewProps> = ({
  interview,
}) => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'gray.200');

  const interviewer = interview.interviewer;
  const interviewee = interview.interviewee;

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      mb={4}
      bg={bgColor}
      borderColor={borderColor}
      cursor="pointer"
      onClick={() => navigate(`/interviews/${interview.interviewId}`)}
      transition="all 0.2s"
      _hover={{ boxShadow: 'md' }}
    >
      {interviewer && interviewee ? (
        <>
          <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
              <Avatar
                size="md"
                name={resolveName(interviewer)}
                src={interviewer.profilePictureUrl || interviewer.username}
                mr={3}
              />
              <Box>
                <Text fontWeight="bold" color={textColor}>
                  {resolveName(interviewer) || 'Loading...'}
                </Text>
                <Badge colorScheme="blue">Interviewer</Badge>
              </Box>
            </Flex>
            <Flex alignItems="center">
              <Box textAlign="right" mr={3}>
                <Text fontWeight="bold" color={textColor}>
                  {resolveName(interviewee) || 'Loading...'}
                </Text>
                <Badge colorScheme="green">Interviewee</Badge>
              </Box>
              <Avatar
                size="md"
                name={resolveName(interviewee)}
                src={interviewee.profilePictureUrl || interviewee.username}
              />
            </Flex>
          </Flex>
          <Flex mt={4} justifyContent="space-between">
            <Text fontSize="sm" color={textColor}>
              Date: {new Date(interview.dateEffective).toLocaleDateString()}
            </Text>
          </Flex>
        </>
      ) : (
        <Center h={20}>
          <Spinner />
        </Center>
      )}
    </Box>
  );
};
