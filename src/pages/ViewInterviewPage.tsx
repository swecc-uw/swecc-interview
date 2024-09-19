import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, VStack, Spinner, useToast } from '@chakra-ui/react';
import {
  Interview,
  TechnicalQuestion,
  BehavioralQuestion,
  Member,
} from '../types';
import {
  ActiveInterviewView,
  InactiveCompletedInterviewView,
  InactiveIncompleteInterviewView,
  PendingInterviewView,
} from '../components/InterviewView';
import {
  getTechnicalQuestionsForInterview,
  getBehavioralQuestionsForInterview,
} from '../services/question';
import {
  commitInterviewTime,
  completeInterview,
  getInterviewAvailabilityForUser,
  getInterviewById,
  proposeInterviewTime,
} from '../services/interview';
import { useAuth } from '../hooks/useAuth';
import { getMemberById } from '../services/directory';
import { devPrint } from '../components/utils/RandomUtils';

export const ViewInterviewPage: React.FC = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview>();
  const [interviewer, setInterviewer] = useState<Member>();
  const [interviewee, setInterviewee] = useState<Member | null>(null);
  const [technicalQuestions, setTechnicalQuestions] = useState<
    TechnicalQuestion[]
  >([]);
  const [behavioralQuestions, setBehavioralQuestions] = useState<
    BehavioralQuestion[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [partnerAvailability, setPartnerAvailability] = useState<boolean[][]>();
  const { member } = useAuth();
  const toast = useToast();

  // fetch interview data only once when member and interviewId are available
  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        if (member && interviewId) {
          const currentInterview = await getInterviewById(interviewId);

          if (currentInterview) {
            setInterview(currentInterview);
            const [technical, behavioral, interviewer, interviewee] =
              await Promise.all([
                getTechnicalQuestionsForInterview(interviewId),
                getBehavioralQuestionsForInterview(interviewId),
                getMemberById(currentInterview.interviewer),
                getMemberById(currentInterview.interviewee),
              ]);

            setTechnicalQuestions(technical);
            setBehavioralQuestions(behavioral);
            setInterviewer(interviewer);
            setInterviewee(interviewee);
          } else {
            throw new Error('Interview not found');
          }
        }
      } catch (error) {
        toast({
          title: 'Error fetching interview data',
          description: 'Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
      setLoading(false); // set loading to false after data is fetched
    };

    fetchInterviewData();
  }, [member, interviewId, toast]);

  // fetch availability only when interviewee changes
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!interviewee) return;
      try {
        const availability = await getInterviewAvailabilityForUser(
          interviewee.id
        );
        setPartnerAvailability(availability.availability);
      } catch (error) {
        toast({
          title: 'Failed to fetch availability',
          description: 'Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    if (interviewee) {
      fetchAvailability();
    }
  }, [interviewee, toast]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  const allFetched =
    interview && interviewer && interviewee && partnerAvailability && member;

  if (!allFetched) {
    return (
      <Box>
        <Heading size="md">Interview not found</Heading>
      </Box>
    );
  }

  let IVC;
  switch (interview.status) {
    case 'pending':
      IVC = PendingInterviewView;
      break;
    case 'active':
      IVC = ActiveInterviewView;
      break;
    case 'inactive_incomplete':
      IVC = InactiveIncompleteInterviewView;
      break;
    case 'inactive_completed':
      IVC = InactiveCompletedInterviewView;
      break;
    default:
      throw new Error(`Invalid interview status: ${interview.status}`);
  }

  const handlePropose = async (time: Date) => {
    if (!interview) return;

    proposeInterviewTime(time, interview.interviewId)
      .then((_res) => {
        // TODO: optimistic update
        // updated interview is already in the response
        window.location.reload();
      })
      .catch((error) => {
        devPrint('Failed to propose time', error);
      });
  };

  const handleCommit = (time: Date) => {
    if (!interview) return;

    commitInterviewTime(time, interview.interviewId)
      .then((_res) => {
        // TODO: optimistic update
        // updated interview is already in the response
        window.location.reload();
      })
      .catch((error) => {
        devPrint('Failed to commit time', error);
      });
  };

  const handleComplete = (time: Date) => {
    if (!interview) return;

    completeInterview(time, interview.interviewId)
      .then((_res) => {
        // TODO: optimistic update
        // updated interview is already in the response
        window.location.reload();
      })
      .catch((error) => {
        devPrint('Failed to complete interview', error);
      });
  };

  return (
    <Box maxWidth="800px" margin="auto" p={4}>
      <VStack spacing={6} align="stretch">
        <IVC
          userId={member.id}
          interview={interview}
          setInterview={setInterview}
          interviewee={interviewee}
          interviewer={interviewer}
          technicalQuestions={technicalQuestions}
          behavioralQuestions={behavioralQuestions}
          partnerAvailability={partnerAvailability}
          handlePropose={handlePropose}
          handleCommit={handleCommit}
          handleComplete={handleComplete}
        />
      </VStack>
    </Box>
  );
};
