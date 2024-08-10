import { Interview, InterviewAvailability } from '../../types'

export async function getInterviewsForUser (
  userId: number
): Promise<Interview[]> {
  return new Promise(resolve => {
    resolve([
      {
        interviewId: '123e4567-e89b-12d3-a456-426614174000',
        interviewer: {
          id: 2,
          username: 'jane_doe',
          email: 'jane.doe@example.com'
        },
        technicalQuestion: {
          questionId: '223e4567-e89b-12d3-a456-426614174001',
          created: '2024-07-26T00:00:00Z',
          createdBy: {
            id: 2,
            username: 'jane_doe',
            email: 'jane.doe@example.com'
          },
          approvedBy: null,
          lastAssigned: null,
          topic: {
            topicId: '323e4567-e89b-12d3-a456-426614174002',
            created: '2024-07-26T00:00:00Z',
            name: 'Algorithms'
          },
          prompt: 'Explain the quicksort algorithm.',
          solution: 'The quicksort algorithm...',
          followUps: 'How would you optimize it?',
          source: 'LeetCode'
        },
        behavioralQuestions: [
          {
            questionId: '423e4567-e89b-12d3-a456-426614174003',
            created: '2024-07-26T00:00:00Z',
            createdBy: {
              id: 2,
              username: 'jane_doe',
              email: 'jane.doe@example.com'
            },
            approvedBy: null,
            lastAssigned: null,
            prompt: 'Tell me about a time you faced a challenge at work.',
            solution: 'I once faced...',
            followUps: 'What did you learn from this experience?',
            source: 'Glassdoor'
          }
        ],
        interviewee: {
          id: 1,
          username: 'john_doe',
          email: 'john.doe@example.com'
        },
        status: 'pending',
        dateEffective: '2024-08-01T10:00:00Z',
        dateCompleted: null
      }
    ])
  })
}

export async function getInterviewById (
  interviewId: string
): Promise<Interview> {
  return await getInterviewsForUser(1).then(interviews => interviews[0])
}

export async function getInterviewAvailabilityForUser (
  userId: number
): Promise<InterviewAvailability> {
  return new Promise(resolve => {
    resolve({
      member: {
        id: 1,
        username: 'john_doe',
        email: 'john.doe@example.com'
      },
      interviewAvailabilitySlots: Array(7).fill(Array(48).fill(false)),
      mentorAvailabilitySlots: Array(7).fill(Array(48).fill(false))
    })
  })
}

export async function updateInterviewAvailabilityForUser (
  userId: number,
  availability: InterviewAvailability
): Promise<InterviewAvailability> {
  return new Promise(resolve => {
    resolve({
      member: {
        id: 1,
        username: 'john_doe',
        email: 'john.doe@example.com'
      },
      interviewAvailabilitySlots: availability.interviewAvailabilitySlots,
      mentorAvailabilitySlots: availability.mentorAvailabilitySlots
    })
  })
}

export async function signupForInterviewPool (
  userId: number,
  interviewId: string
): Promise<Interview> {
  return new Promise(resolve => {
    resolve({
      interviewId: '123e4567-e89b-12d3-a456-426614174000',
      interviewer: {
        id: 2,
        username: 'jane_doe',
        email: 'jane.doe@example.com'
      },
      technicalQuestion: {
        questionId: '223e4567-e89b-12d3-a456-426614174001',
        created: '2024-07-26T00:00:00Z',
        createdBy: {
          id: 2,
          username: 'jane_doe',
          email: 'jane.doe@example.com'
        },
        approvedBy: null,
        lastAssigned: null,
        topic: {
          topicId: '323e4567-e89b-12d3-a456-426614174002',
          created: '2024-07-26T00:00:00Z',
          name: 'Algorithms'
        },
        prompt: 'Explain the quicksort algorithm.',
        solution: 'The quicksort algorithm...',
        followUps: 'How would you optimize it?',
        source: 'LeetCode'
      },
      behavioralQuestions: [
        {
          questionId: '423e4567-e89b-12d3-a456-426614174003',
          created: '2024-07-26T00:00:00Z',
          createdBy: {
            id: 2,
            username: 'jane_doe',
            email: 'jane.doe@example.com'
          },
          approvedBy: null,
          lastAssigned: null,
          prompt: 'Tell me about a time you faced a challenge at work.',
          solution: 'I once faced...',
          followUps: 'What did you learn from this experience?',
          source: 'Glassdoor'
        }
      ],
      interviewee: {
        id: 1,
        username: 'john_doe',
        email: 'john.doe@example.com'
      },
      status: 'pending',
      dateEffective: '2024-08-01T10:00:00Z',
      dateCompleted: null
    })
  })
}
