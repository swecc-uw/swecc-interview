import { Interview, InterviewAvailability } from '../types'
// import api from './api'

export async function getInterviewsForUser (
  userId: string
): Promise<Interview[]> {
  return new Promise((resolve, reject) => {
    reject('Not implemented')
  })
}

export async function getInterviewById (
  interviewId: string
): Promise<Interview> {
  return new Promise((resolve, reject) => {
    reject('Not implemented')
  })
}

export async function getInterviewAvailabilityForUser (
  userId: string
): Promise<InterviewAvailability> {
  return new Promise((resolve, reject) => {
    reject('Not implemented')
  })
}

export async function updateInterviewAvailabilityForUser (
  userId: string,
  availability: InterviewAvailability
): Promise<InterviewAvailability> {
  return new Promise((resolve, reject) => {
    reject('Not implemented')
  })
}

export async function signupForInterviewPool (
  userId: string,
  interviewId: string
): Promise<Interview> {
  return new Promise((resolve, reject) => {
    reject('Not implemented')
  })
}
