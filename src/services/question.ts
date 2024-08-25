import { TechnicalQuestion, BehavioralQuestion } from '../types';
// import api from './api'

// TODO: Implement this endpoint
export async function getTechnicalQuestionsForInterview(
  _interviewId: string
): Promise<TechnicalQuestion[]> {
  return [];
  return new Promise((_resolve, reject) => {
    reject('Not implemented');
  });
}

// TODO: Implement this endpoint
export async function getBehavioralQuestionsForInterview(
  _interviewId: string
): Promise<BehavioralQuestion[]> {
  return [];
  return new Promise((_resolve, reject) => {
    reject('Not implemented');
  });
}
