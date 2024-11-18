import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  Button,
  ModalCloseButton,
} from "@chakra-ui/react";
import { HydratedInterview } from "../types";
import { useAuth } from "../hooks/useAuth";
import ReportPopUp from "./ReportPopUp";

interface InterviewViewProps {
  interview: HydratedInterview;
}

// eslint-disable-next-line prettier/prettier
export const InterviewView: React.FC<InterviewViewProps> = ({ interview }) => {
  let { technicalQuestions, behavioralQuestions } = interview;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { interviewer, interviewee } = interview;
  const { member } = useAuth();

  const allFetched = interviewer && interviewee;
  console.log(interviewer, interviewee, member);
  if (!allFetched) {
    return null;
  }

  if (!technicalQuestions) {
    technicalQuestions = [];
  }

  if (!behavioralQuestions) {
    behavioralQuestions = [];
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" p={6}>
      <VStack align="stretch" spacing={4}>
        <Heading size="lg">Interview Details</Heading>
        <HStack justify="space-between">
          <Text>
            Status:{" "}
            <Badge
              colorScheme={interview.status === "active" ? "green" : "gray"}
            >
              {interview.status}
            </Badge>
          </Text>
          <Text>
            Date: {new Date(interview.dateEffective).toLocaleDateString()}
          </Text>
        </HStack>
        <Text>Interviewer: {interviewer.username}</Text>
        <Text>Interviewee: {interviewee.username}</Text>

        <Button onClick={onOpen}>Report Interviewer or Interviewee</Button>

        <Heading size="md" mt={4}>
          Technical Questions
        </Heading>
        {technicalQuestions.map((q, index) => (
          <Box key={q.questionId} p={4} borderWidth="1px" borderRadius="md">
            <Text fontWeight="bold">
              Question {index + 1}: {q.prompt}
            </Text>
            <Text mt={2}>Topic: {q.topicName}</Text>
          </Box>
        ))}

        <Heading size="md" mt={4}>
          Behavioral Questions
        </Heading>
        {behavioralQuestions.map((q, index) => (
          <Box key={q.questionId} p={4} borderWidth="1px" borderRadius="md">
            <Text fontWeight="bold">
              Question {index + 1}: {q.prompt}
            </Text>
          </Box>
        ))}
      </VStack>

      <Modal
        isCentered
        motionPreset="slideInBottom"
        isOpen={isOpen}
        size={"xl"}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent maxH="800px" maxW="700px">
          <ModalCloseButton />
          <ReportPopUp
            associated_id={interview.interviewId}
            reporter_user_id={member?.id || -1}
            onClose={onClose}
          />
        </ModalContent>
      </Modal>
    </Box>
  );
};
