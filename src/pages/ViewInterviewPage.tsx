import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, VStack, Spinner, useToast } from '@chakra-ui/react';
import { Interview, TechnicalQuestion, BehavioralQuestion, Member } from '../types';
import { InterviewView } from '../components/InterviewView';
import {
  getTechnicalQuestionsForInterview,
  getBehavioralQuestionsForInterview,
} from '../services/question';
import { getInterviewById } from '../services/interview';
import { useAuth } from '../hooks/useAuth';
import { getMemberById } from '../services/directory';

export const ViewInterviewPage: React.FC = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [interviewer, setInterviewer] = useState<Member | null>(null);
  const [interviewee, setInterviewee] = useState<Member | null>(null);
  const [technicalQuestions, setTechnicalQuestions] = useState<
    TechnicalQuestion[]
  >([]);
  const [behavioralQuestions, setBehavioralQuestions] = useState<
    BehavioralQuestion[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { member } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        if (member && interviewId) {
          const currentInterview = await getInterviewById(interviewId);

          if (currentInterview) {
            setInterview(currentInterview);
            const [technical, behavioral, interviewer, interviewee] = await Promise.all([
              getTechnicalQuestionsForInterview(interviewId),
              getBehavioralQuestionsForInterview(interviewId),
              getMemberById(currentInterview.interviewer),
              getMemberById(currentInterview.interviewee)
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
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewData();
  }, [member, interviewId, toast]);

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

  const allFetched = interview && interviewer && interviewee;
  if (!allFetched) {
    return (
      <Box>
        <Heading size="md">Interview not found</Heading>
      </Box>
    );
  }

  return (
    <Box maxWidth="800px" margin="auto" p={4}>
      <VStack spacing={6} align="stretch">
        <Heading>Interview Details</Heading>
        <InterviewView
          interview={interview}
          interviewee={interviewee}
          interviewer={interviewer}
          technicalQuestions={technicalQuestions}
          behavioralQuestions={behavioralQuestions}
        />
      </VStack>
    </Box>
  );
};
