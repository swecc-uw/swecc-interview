import {
  DetailedResponse,
  Interview,
  InterviewAvailability,
  RawInterviewData,
  RawInterviewAvailabilityData,
  HydratedInterview,
  RawMemberData,
} from '../types';
import api from './api';
import { deserializeMember } from './member';

function deserializeInterview({
  interview_id: interviewId,
  date_effective: dateEffective,
  date_completed: dateCompleted,
  technical_question: technicalQuestion,
  behavioral_questions: behavioralQuestions,
  ...rest
}: RawInterviewData): Interview {
  return {
    ...rest,
    interviewId,
    dateEffective,
    dateCompleted,
    technicalQuestion,
    behavioralQuestions,
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
  const res = await api.get('/interview/interviews/');

  return res.data.map(deserializeInterview);
}

interface InterviewsResponse {
  interviews: Array<
    RawInterviewData & {
      interviewer: RawMemberData;
      interviewee: RawMemberData;
    }
  >;
}

export async function getInterviewsHydratedForUser(): Promise<
  Array<HydratedInterview>
> {
  const res = await api.get<InterviewsResponse>('/interview/all/details');
  const interviews = res.data.interviews;

  return interviews.map((interview) => {
    const iv = deserializeInterview(interview);
    return {
      ...iv,
      interviewer: deserializeMember(interview.interviewer),
      interviewee: deserializeMember(interview.interviewee),
    };
  });
}

export async function getInterviewById(
  interviewId: string
): Promise<Interview> {
  const res = await api.get(`/interview/interviews/${interviewId}/`);

  return deserializeInterview(res.data);
}

export async function getInterviewAvailabilityForCurrentUser(): Promise<InterviewAvailability> {
  const res = await api.get('/interview/availability/');
  return deserializeInterviewAvailability(res.data);
}

export async function getInterviewAvailabilityForUser(
  userId: number
): Promise<InterviewAvailability> {
  const res = await api.get(`/interview/availability/?member_id=${userId}`);
  return deserializeInterviewAvailability(res.data);
}

export async function updateInterviewAvailabilityForCurrentUser(
  availability: InterviewAvailability
): Promise<InterviewAvailability> {
  const res = await api.put('/interview/availability/', availability);
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
