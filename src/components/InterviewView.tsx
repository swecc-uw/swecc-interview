import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
} from '@chakra-ui/react';
import AvailabilityPicker from './AvailabilityPicker';
import {
  Interview,
  TechnicalQuestion,
  BehavioralQuestion,
  Member,
} from '../types';

import { availabilityCellToDateTime } from './utils/RandomUtils';

interface InterviewViewProps {
  userId: number;
  interview: Interview;
  setInterview: (interview: Interview) => void;
  interviewer: Member;
  interviewee: Member;
  technicalQuestions: TechnicalQuestion[];
  behavioralQuestions: BehavioralQuestion[];
  partnerAvailability: boolean[][];
  handlePropose: (time: Date) => void;
  handleCommit: (time: Date) => void;
  handleComplete: (time: Date) => void;
}

const ProposeSelector: React.FC<{
  partnerAvailability: boolean[][];
  proposedTime: Date | undefined;
  setProposedTime: (time: Date) => void;
  handlePropose: () => void;
}> = ({
  partnerAvailability,
  proposedTime,
  setProposedTime,
  handlePropose,
}) => (
  <Box>
    <AvailabilityPicker
      availability={partnerAvailability}
      onPick={(dayIndex, timeIndex) =>
        setProposedTime(availabilityCellToDateTime(dayIndex, timeIndex))
      }
      title="Propose a time"
    />
    <Text my={2}>
      Selected time: {proposedTime?.toLocaleString() || 'None'}
    </Text>
    {proposedTime && (
      <Button colorScheme="brand" size="sm" onClick={handlePropose}>
        Propose
      </Button>
    )}
  </Box>
);

const CommitSelector: React.FC<{
  proposedTime: Date;
  handleCommit: (time: Date) => void;
  togglePropose: () => void;
}> = ({ proposedTime, handleCommit, togglePropose }) => (
  <VStack spacing={2}>
    <Text>Proposed time: {proposedTime.toLocaleString()}</Text>
    <Button
      width="80%"
      colorScheme="brand"
      size="sm"
      onClick={() => handleCommit(proposedTime)}
    >
      Commit
    </Button>
    <Button colorScheme="brand" size="sm" width="80%" onClick={togglePropose}>
      Propose Another Time
    </Button>
  </VStack>
);

export const PendingInterviewView: React.FC<InterviewViewProps> = ({
  userId,
  interview,
  interviewer,
  interviewee,
  partnerAvailability,
  handlePropose,
  handleCommit,
}) => {
  const [proposedTime, setProposedTime] = useState<Date>();
  const [isProposing, setIsProposing] = useState<boolean>(false);

  const togglePropose = () => {
    setIsProposing((prev) => !prev);
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={6}>
      <VStack align="stretch" spacing={4}>
        <Heading size="lg">Pending Interview Details</Heading>
        <HStack justify="space-between">
          <Text>
            Status: <Badge colorScheme="yellow">{interview.status}</Badge>
          </Text>
          <Text>
            Date: {new Date(interview.dateEffective).toLocaleDateString()}
          </Text>
        </HStack>
        {interview.proposedTime &&
        interview.proposedBy !== userId &&
        !isProposing ? (
          <CommitSelector
            proposedTime={new Date(interview.proposedTime)}
            handleCommit={handleCommit}
            togglePropose={togglePropose}
          />
        ) : isProposing || !interview.proposedTime ? (
          <ProposeSelector
            partnerAvailability={partnerAvailability}
            proposedTime={proposedTime}
            setProposedTime={setProposedTime}
            handlePropose={() => handlePropose(proposedTime!)}
          />
        ) : (
          <Text>
            Proposed Time: {new Date(interview.proposedTime).toLocaleString()}
          </Text>
        )}
        <Text>Interviewer: {interviewer.username}</Text>
        <Text>Interviewee: {interviewee.username}</Text>
      </VStack>
    </Box>
  );
};

export const ActiveInterviewView: React.FC<InterviewViewProps> = ({
  userId,
  interview,
  interviewer,
  interviewee,
  technicalQuestions,
  behavioralQuestions,
  handleComplete,
}) => {
  if (!interview.committedTime)
    throw new Error('Active interview must have a committed time');

  let actions;

  const committedTimeParsed = new Date(interview.committedTime);
  const now = new Date();

  // hasn't happened yet
  if (committedTimeParsed > now) {
    actions = <Text>Scheduled for {committedTimeParsed.toLocaleString()}</Text>;
    // already passed
  } else if (committedTimeParsed < now) {
    // if the user is the interviewer
    // they can mark the interview as completed
    if (userId === interview.interviewer) {
      actions = (
        <>
          <Text>
            Interview occurred on {committedTimeParsed.toLocaleString()}
          </Text>
          <Button
            colorScheme="brand"
            size="sm"
            onClick={() => handleComplete(now)}
          >
            Mark as Completed
          </Button>
        </>
      );
      // if the user is the interviewee
      // they don't have any actions to take
    } else {
      actions = (
        <>
          <Text>
            Interview occurred on {committedTimeParsed.toLocaleString()}
          </Text>
          <Text>Interviewer must mark the interview as completed</Text>
        </>
      );
    }
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" p={6}>
      <VStack align="stretch" spacing={4}>
        <Heading size="lg">Active Interview Details</Heading>
        <HStack justify="space-between">
          <Text>
            Status: <Badge colorScheme="green">{interview.status}</Badge>
          </Text>
          <Text>
            Date: {new Date(interview.dateEffective).toLocaleDateString()}
          </Text>
        </HStack>
        {actions}
        <Text>Interviewer: {interviewer.username}</Text>
        <Text>Interviewee: {interviewee.username}</Text>
        {/* Add active interview-specific content here */}
      </VStack>
    </Box>
  );
};

export const InactiveIncompleteInterviewView: React.FC<InterviewViewProps> = ({
  interview,
  interviewer,
  interviewee,
}) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={6}>
      <VStack align="stretch" spacing={4}>
        <Heading size="lg">Incomplete Interview Details</Heading>
        <HStack justify="space-between">
          <Text>
            Status: <Badge colorScheme="orange">{interview.status}</Badge>
          </Text>
          <Text>
            Date: {new Date(interview.dateEffective).toLocaleDateString()}
          </Text>
        </HStack>
        <Text>Interviewer: {interviewer.username}</Text>
        <Text>Interviewee: {interviewee.username}</Text>
        {/* Add incomplete interview-specific content here */}
      </VStack>
    </Box>
  );
};

export const InactiveCompletedInterviewView: React.FC<InterviewViewProps> = ({
  interview,
  interviewer,
  interviewee,
  technicalQuestions,
  behavioralQuestions,
}) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={6}>
      <VStack align="stretch" spacing={4}>
        <Heading size="lg">Completed Interview Details</Heading>
        <HStack justify="space-between">
          <Text>
            Status: <Badge colorScheme="blue">{interview.status}</Badge>
          </Text>
          <Text>
            Date: {new Date(interview.dateEffective).toLocaleDateString()}
          </Text>
        </HStack>
        <Text>Interviewer: {interviewer.username}</Text>
        <Text>Interviewee: {interviewee.username}</Text>
        {/* Add completed interview-specific content, such as feedback or results */}
      </VStack>
    </Box>
  );
};
