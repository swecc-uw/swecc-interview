import React from "react";
import {
  Box,
  VStack,
  Spinner,
  Grid,
  GridItem,
  Heading,
  Text,
  Badge,
  Avatar,
  Divider,
  Card,
  CardHeader,
  CardBody,
  HStack,
  useColorModeValue,
  Button,
  useDisclosure,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import {
  Calendar,
  Clock,
  User,
  Book,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  BehavioralQuestion,
  HydratedInterview,
  Member,
  TechnicalQuestion,
} from "../types";
import { resolveName } from "../components/utils/RandomUtils";
import { useAuth } from "../hooks/useAuth";
import ReportPopUp from "../components/ReportPopUp";

const InterviewView = ({ interview }: { interview: HydratedInterview }) => {
  const { member } = useAuth();
  const isInterviewer = member?.id === interview.interviewer.id;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("white", "gray.800");
  const subtleColor = useColorModeValue("gray.600", "gray.400");
  const cardBg = useColorModeValue("gray.50", "gray.700");

  const {
    interviewer,
    interviewee,
    technicalQuestions = [],
    behavioralQuestions = [],
    dateEffective,
    dateCompleted,
    status,
  } = interview;

  const statusColors = {
    active: "green",
    pending: "yellow",
    inactive: "gray",
  };

  const startDateStr = new Date(dateEffective).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const endDate = new Date(dateEffective);
  endDate.setDate(endDate.getDate() + 7);
  const endDateStr = endDate.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <VStack
      spacing={6}
      align="stretch"
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
    >
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
      {/* header */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
        <GridItem>
          <HStack>
            <Calendar size={16} />
            <Text fontSize="sm" color={subtleColor}>
              scheduled for
            </Text>
          </HStack>
          <Text fontSize="lg" fontWeight="medium">
            {startDateStr} to
          </Text>
          <Text fontSize="lg" fontWeight="medium">
            {endDateStr}
          </Text>
        </GridItem>
        {dateCompleted && (
          <GridItem>
            <HStack>
              <Clock size={16} />
              <Text fontSize="sm" color={subtleColor}>
                completed on
              </Text>
            </HStack>
            <Text fontSize="lg" fontWeight="medium">
              {new Date(dateCompleted).toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </GridItem>
        )}
        <GridItem justifySelf={{ base: "start", md: "end" }}>
          <Badge colorScheme={statusColors[status]} fontSize="md" px={3} py={1}>
            {status.toUpperCase()}
          </Badge>
        </GridItem>
        <GridItem>
          <Button onClick={onOpen}>Report Interviewer or Interviewee</Button>
        </GridItem>
      </Grid>

      <Divider />

      {/* participants */}
      <VStack align="stretch" spacing={4}>
        <HStack>
          <User size={16} />
          <Heading size="md">participants</Heading>
        </HStack>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
          <ParticipantCard
            participant={interviewer}
            role="Interviewer"
            cardBg={cardBg}
            subtleColor={subtleColor}
          />
          <ParticipantCard
            participant={interviewee}
            role="Interviewee"
            cardBg={cardBg}
            subtleColor={subtleColor}
          />
        </Grid>
      </VStack>

      <Divider />

      <VStack align="stretch" spacing={4}>
        <HStack>
          <Book size={16} />
          <Heading size="md">questions</Heading>
        </HStack>
        {technicalQuestions.length > 0 && (
          <VStack align="stretch" spacing={3}>
            {technicalQuestions.map((q, i) => (
              <QuestionCard
                key={q.questionId}
                question={q}
                index={i}
                type="technical"
                isInterviewer={isInterviewer}
                cardBg={cardBg}
              />
            ))}
          </VStack>
        )}
        {behavioralQuestions.length > 0 && (
          <VStack align="stretch" spacing={3}>
            {behavioralQuestions.map((q, i) => (
              <QuestionCard
                key={q.questionId}
                question={q}
                index={i}
                type="behavioral"
                isInterviewer={isInterviewer}
                cardBg={cardBg}
              />
            ))}
          </VStack>
        )}
        {technicalQuestions.length === 0 &&
          behavioralQuestions.length === 0 && (
            <Text color={subtleColor} textAlign="center" py={4}>
              no questions assigned yet
            </Text>
          )}
      </VStack>
    </VStack>
  );
};

export const ViewInterviewPage = ({
  interview,
}: {
  interview: HydratedInterview;
}) => {
  if (!interview) {
    return (
      <Box>
        <Spinner />
      </Box>
    );
  }

  return (
    <Box maxWidth="1000px" margin="auto" p={4}>
      <InterviewView interview={interview} />
    </Box>
  );
};

const QuestionCard = ({
  question,
  index,
  type,
  isInterviewer,
  cardBg,
}: {
  question: TechnicalQuestion | BehavioralQuestion;
  index: number;
  type: "technical" | "behavioral";
  isInterviewer: boolean;
  cardBg: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const subtleColor = useColorModeValue("gray.600", "gray.400");
  const solutionBg = useColorModeValue("gray.50", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.600");
  const borderColor = useColorModeValue("gray.100", "gray.600");

  return (
    <Card
      bg={cardBg}
      transition="all 0.2s"
      _hover={{ transform: "translateY(-2px)", shadow: "md" }}
      borderWidth="1px"
      borderColor={borderColor}
    >
      <CardHeader pb={0}>
        <HStack justify="space-between" mb={3}>
          <HStack spacing={3}>
            <Badge
              colorScheme={type === "technical" ? "purple" : "orange"}
              px={3}
              py={1}
              borderRadius="full"
            >
              {type === "technical" ? "Technical" : "Behavioral"}
            </Badge>
            {"topicName" in question && (
              <Badge variant="subtle" borderRadius="full" colorScheme="blue">
                {question.topicName}
              </Badge>
            )}
          </HStack>
          <Text fontSize="sm" color={subtleColor} fontWeight="medium">
            #{index + 1}
          </Text>
        </HStack>
        {"title" in question && (
          <Text fontWeight="bold" fontSize="lg" mb={2}>
            {question.title}
          </Text>
        )}
      </CardHeader>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Text fontSize="md" lineHeight="tall">
            {question.prompt}
          </Text>

          {isInterviewer && question.solution && (
            <Box>
              <Button
                onClick={() => setIsOpen(!isOpen)}
                size="sm"
                variant="ghost"
                width="full"
                justifyContent="space-between"
                rightIcon={
                  isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                }
                _hover={{ bg: hoverBg }}
                fontWeight="medium"
                color={subtleColor}
                height="36px"
              >
                {isOpen ? "hide solution" : "show solution"}
              </Button>
              {isOpen && (
                <Box
                  mt={3}
                  p={4}
                  bg={solutionBg}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <VStack align="stretch" spacing={4}>
                    <Box>
                      <Text
                        fontWeight="semibold"
                        mb={2}
                        fontSize="sm"
                        color={subtleColor}
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        solution
                      </Text>
                      <Text whiteSpace="pre-wrap" lineHeight="tall">
                        {question.solution}
                      </Text>
                    </Box>

                    {question.followUps && (
                      <Box>
                        <Text
                          fontWeight="semibold"
                          mb={2}
                          fontSize="sm"
                          color={subtleColor}
                          textTransform="uppercase"
                          letterSpacing="wide"
                        >
                          follow-up questions
                        </Text>
                        <Text whiteSpace="pre-wrap" lineHeight="tall">
                          {question.followUps}
                        </Text>
                      </Box>
                    )}
                  </VStack>
                </Box>
              )}
            </Box>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

const ParticipantCard = ({
  participant,
  role,
  cardBg,
  subtleColor,
}: {
  participant: Member;
  role: string;
  cardBg: string;
  subtleColor: string;
}) => (
  <Card bg={cardBg}>
    <CardHeader pb={2}>
      <HStack spacing={4}>
        <Avatar
          size="lg"
          name={resolveName(participant)}
          src={participant.profilePictureUrl}
        />
        <Box>
          <Text fontWeight="bold" fontSize="lg">
            {resolveName(participant)}
          </Text>
          <Badge colorScheme={role === "Interviewer" ? "blue" : "green"}>
            {role}
          </Badge>
        </Box>
      </HStack>
    </CardHeader>
    <CardBody pt={2}>
      <Grid templateColumns="auto 1fr" gap={2} fontSize="sm">
        {participant.role && (
          <>
            <Text color={subtleColor}>role:</Text>
            <Text>{participant.role}</Text>
          </>
        )}
        {participant.major && (
          <>
            <Text color={subtleColor}>major:</Text>
            <Text>{participant.major}</Text>
          </>
        )}
        {participant.gradDate && (
          <>
            <Text color={subtleColor}>graduation:</Text>
            <Text>{new Date(participant.gradDate).toLocaleDateString()}</Text>
          </>
        )}
      </Grid>
    </CardBody>
  </Card>
);
