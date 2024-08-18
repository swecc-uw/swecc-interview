export interface SocialField {
  username: string;
  isPrivate: boolean;
}

export interface InterviewAvailability {
  userId: number; // user id
  availability: boolean[][];
}

export interface InterviewPool {
  member: Member;
}

type Status = 'pending' | 'active' | 'inactive';

export interface Interview {
  interviewId: string;
  interviewer: Member;
  technicalQuestion?: TechnicalQuestion;
  behavioralQuestions: BehavioralQuestion[];
  interviewee: Member;
  status: Status;
  dateEffective: string; // ISO 8601 date string
  dateCompleted?: string; // ISO 8601 date string or null
}

export interface Member {
  id: number; // user id
  username: string;
  created: string; // ISO 8601 date string
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  preview?: string;
  major?: string;
  gradDate?: string; // ISO 8601 date string or null
  discordUsername: string;
  linkedin?: SocialField;
  github?: SocialField;
  leetcode?: SocialField;
  resumeUrl?: string;
  local?: string;
  bio?: string;
  discordId: number;
}

export interface QuestionTopic {
  topicId: string;
  created: string; // ISO 8601 date string
  name: string;
}

export interface TechnicalQuestion {
  questionId: string;
  created: string; // ISO 8601 date string
  createdBy: Member;
  approvedBy?: Member;
  lastAssigned?: string; // ISO 8601 date string or null
  topic: QuestionTopic;
  prompt: string;
  solution: string;
  followUps?: string;
  source?: string;
}

export interface BehavioralQuestion {
  questionId: string;
  created: string; // ISO 8601 date string
  createdBy: Member;
  approvedBy?: Member;
  lastAssigned?: string; // ISO 8601 date string or null
  prompt: string;
  solution: string;
  followUps?: string;
  source?: string;
}

export interface DetailedResponse {
  detail: string;
}
