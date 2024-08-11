import { TechnicalQuestion, BehavioralQuestion } from '../types';
// import api from './api'

export async function getTechnicalQuestionsForInterview(
  _interviewId: string
): Promise<TechnicalQuestion[]> {
  return new Promise((_resolve, reject) => {
    reject('Not implemented');
  });
}

export async function getBehavioralQuestionsForInterview(
  _interviewId: string
): Promise<BehavioralQuestion[]> {
  return new Promise((_resolve, reject) => {
    reject('Not implemented');
  });
}
