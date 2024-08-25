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
  interviewer: number;
  technicalQuestion?: TechnicalQuestion;
  behavioralQuestions: BehavioralQuestion[];
  interviewee: number;
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

export interface RawInterviewData {
  interview_id: string;
  date_effective: string;
  date_completed: string;
  interviewer: number;
  interviewee: number;
  status: Status;
  technical_question: TechnicalQuestion;
  behavioral_questions: BehavioralQuestion[];
}

export interface RawInterviewAvailabilityData {
  user_id: number;
  availability: boolean[][];
}

export interface RawMemberData {
  user: number;
  username: string;
  created: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  preview: string;
  major: string;
  grad_date: string;
  discord_username: string;
  linkedin: SocialField;
  github: SocialField;
  leetcode: SocialField;
  resume_url: string;
  local: string;
  bio: string;
  discord_id: number;
}