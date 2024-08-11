import { TechnicalQuestion, BehavioralQuestion } from "../types";
// import api from './api'

export async function getTechnicalQuestionsForInterview(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _interviewId: string
): Promise<TechnicalQuestion[]> {
  return new Promise((_resolve, reject) => {
    reject("Not implemented");
  });
}

export async function getBehavioralQuestionsForInterview(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _interviewId: string
): Promise<BehavioralQuestion[]> {
  return new Promise((_resolve, reject) => {
    reject("Not implemented");
  });
}
