import {
  DetailedResponse,
  Interview,
  InterviewAvailability,
  RawInterviewData,
  RawInterviewAvailabilityData,
} from '../types';
import api from './api';

function deserializeInterview({
  interview_id: interviewId,
  date_effective: dateEffective,
  date_completed: dateCompleted,
  technical_question: technicalQuestion,
  behavioral_questions: behavioralQuestions,
  proposed_time: proposedTime,
  proposed_by: proposedBy,
  committed_time: committedTime,
  ...rest
}: RawInterviewData): Interview {
  return {
    interviewId,
    dateEffective,
    dateCompleted,
    technicalQuestion,
    behavioralQuestions,
    proposedTime,
    proposedBy,
    committedTime,
    ...rest,
  };
}

function deserializeInterviewAvailability(
  data: RawInterviewAvailabilityData
): InterviewAvailability {
  return {
    userId: data.user_id,
    availability: data.availability,
  };
}

export async function getInterviewsForUser(): Promise<Interview[]> {
  const res = await api.get('/interview/interviews');

  return res.data.map(deserializeInterview);
}

export async function getInterviewById(
  interviewId: string
): Promise<Interview> {
  const res = await api.get(`/interview/interviews/${interviewId}`);

  return deserializeInterview(res.data);
}

export async function getInterviewAvailabilityForCurrentUser(): Promise<InterviewAvailability> {
  const res = await api.get('/interview/availability');
  return deserializeInterviewAvailability(res.data);
}

export async function getInterviewAvailabilityForUser(
  userId: number
): Promise<InterviewAvailability> {
  const res = await api.get(`/interview/availability?member_id=${userId}`);
  return deserializeInterviewAvailability(res.data);
}

export async function updateInterviewAvailabilityForCurrentUser(
  availability: InterviewAvailability
): Promise<InterviewAvailability> {
  const res = await api.put('/interview/availability', availability);
  return deserializeInterviewAvailability(res.data);
}

export async function isCurrentUserSignedUpForInterviewPool(): Promise<boolean> {
  const res = await api.get('/interview/pool/');
  return res.data.sign_up;
}

export async function signupCurrentUserForInterviewPool(
  availability: InterviewAvailability
): Promise<DetailedResponse> {
  const res = await api.post('/interview/pool/', availability);
  return res.data;
}

export async function deleteCurrentUserFromInterviewPool(): Promise<DetailedResponse> {
  const res = await api.delete('/interview/pool/');
  return res.data;
}

export async function proposeInterviewTime(
  time: Date,
  interviewId: string
): Promise<{
  detail: string;
  interview: Interview;
}> {
  const res = await api.post(`/interview/interviews/${interviewId}/propose/`, {
    time: time.toISOString(),
  });

  return {
    detail: res.data.detail,
    interview: deserializeInterview(res.data.interview),
  };
}

export async function commitInterviewTime(
  time: Date,
  interviewId: string
): Promise<{
  detail: string;
  interview: Interview;
}> {
  const res = await api.post(`/interview/interviews/${interviewId}/commit/`, {
    time: time.toISOString(),
  });

  return {
    detail: res.data.detail,
    interview: deserializeInterview(res.data.interview),
  };
}

export async function completeInterview(
  time: Date,
  interviewId: string
): Promise<{
  detail: string;
  interview: Interview;
}> {
  const res = await api.post(`/interview/interviews/${interviewId}/complete/`, {
    time: time.toISOString(),
  });

  return {
    detail: res.data.detail,
    interview: deserializeInterview(res.data.interview),
  };
}
