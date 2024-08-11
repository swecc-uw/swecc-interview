import { TechnicalQuestion, BehavioralQuestion } from '../../types';

export async function getTechnicalQuestionsForInterview(
  interviewId: string
): Promise<TechnicalQuestion[]> {
  return new Promise((resolve) => {
    resolve([
      {
        questionId: '223e4567-e89b-12d3-a456-426614174001',
        created: '2024-07-26T00:00:00Z',
        createdBy: {
          id: 2,
          username: 'jane_doe',
          email: 'jane.doe@example.com',
        },
        approvedBy: null,
        lastAssigned: null,
        topic: {
          topicId: '323e4567-e89b-12d3-a456-426614174002',
          created: '2024-07-26T00:00:00Z',
          name: 'Algorithms',
        },
        prompt: 'Explain the quicksort algorithm.',
        solution: 'The quicksort algorithm...',
        followUps: 'How would you optimize it?',
        source: 'LeetCode',
      },
    ]);
  });
}

export async function getBehavioralQuestionsForInterview(
  interviewId: string
): Promise<BehavioralQuestion[]> {
  return new Promise((resolve) => {
    resolve([
      {
        questionId: '423e4567-e89b-12d3-a456-426614174003',
        created: '2024-07-26T00:00:00Z',
        createdBy: {
          id: 2,
          username: 'jane_doe',
          email: 'jane.doe@example.com',
        },
        approvedBy: null,
        lastAssigned: null,
        prompt: 'Tell me about a time you faced a challenge at work.',
        solution: 'I once faced...',
        followUps: 'What did you learn from this experience?',
        source: 'Glassdoor',
      },
    ]);
  });
}
