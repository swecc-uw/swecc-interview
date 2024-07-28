export interface User {
  id: number
  username: string
  email: string
}

export interface SocialField {
  username: string
  isPrivate: boolean
}

export interface InterviewAvailability {
  member: User
  interviewAvailabilitySlots: boolean[][]
  mentorAvailabilitySlots: boolean[][]
}

export interface InterviewPool {
  member: User
}

type Status = 'pending' | 'active' | 'inactive'

export interface Interview {
  interviewId: string
  interviewer: User
  technicalQuestion: TechnicalQuestion | null
  behavioralQuestions: BehavioralQuestion[]
  interviewee: User
  status: Status
  dateEffective: string // ISO 8601 date string
  dateCompleted: string | null // ISO 8601 date string or null
}

export interface Member {
  user: User
  created: string // ISO 8601 date string
  email: string
  role: string
  firstName: string
  lastName: string
  preview: string | null
  major: string | null
  gradDate: string | null // ISO 8601 date string or null
  discordUsername: string
  linkedin: SocialField | null
  github: SocialField | null
  leetcode: SocialField | null
  resumeUrl: string | null
  local: string | null
  bio: string | null
  discordId: number
}

export interface QuestionTopic {
  topicId: string
  created: string // ISO 8601 date string
  name: string
}

export interface TechnicalQuestion {
  questionId: string
  created: string // ISO 8601 date string
  createdBy: User
  approvedBy: User | null
  lastAssigned: string | null // ISO 8601 date string or null
  topic: QuestionTopic
  prompt: string
  solution: string
  followUps: string | null
  source: string | null
}

export interface BehavioralQuestion {
  questionId: string
  created: string // ISO 8601 date string
  createdBy: User
  approvedBy: User | null
  lastAssigned: string | null // ISO 8601 date string or null
  prompt: string
  solution: string
  followUps: string | null
  source: string | null
}
