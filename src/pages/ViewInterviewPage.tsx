import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, VStack, Spinner, useToast } from '@chakra-ui/react';
import { Interview, TechnicalQuestion, BehavioralQuestion } from '../types';
import { InterviewView } from '../components/InterviewView';
import {
  getTechnicalQuestionsForInterview,
  getBehavioralQuestionsForInterview,
} from '../services/mock/question';
import { getInterviewById } from '../services/mock/interview';
import { useMember } from '../context/MemberContext';

export const ViewInterviewPage: React.FC = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [technicalQuestions, setTechnicalQuestions] = useState<
    TechnicalQuestion[]
  >([]);
  const [behavioralQuestions, setBehavioralQuestions] = useState<
    BehavioralQuestion[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { member } = useMember();
  const toast = useToast();

  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        if (member && interviewId) {
          const currentInterview = await getInterviewById(interviewId);

          if (currentInterview) {
            setInterview(currentInterview);
            const [technical, behavioral] = await Promise.all([
              getTechnicalQuestionsForInterview(interviewId),
              getBehavioralQuestionsForInterview(interviewId),
            ]);
            setTechnicalQuestions(technical);
            setBehavioralQuestions(behavioral);
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

  if (!interview) {
    return <Heading>Interview not found</Heading>;
  }

  return (
    <Box maxWidth="800px" margin="auto" p={4}>
      <VStack spacing={6} align="stretch">
        <Heading>Interview Details</Heading>
        <InterviewView
          interview={interview}
          technicalQuestions={technicalQuestions}
          behavioralQuestions={behavioralQuestions}
        />
      </VStack>
    </Box>
  );
};
