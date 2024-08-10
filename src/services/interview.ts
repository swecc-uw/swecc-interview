import { Interview, InterviewAvailability } from '../types'
// import api from './api'

export async function getInterviewsForUser (
  userId: number
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
  userId: number
): Promise<InterviewAvailability> {
  return new Promise((resolve, reject) => {
    reject('Not implemented')
  })
}

export async function updateInterviewAvailabilityForUser (
  userId: number,
  availability: InterviewAvailability
): Promise<InterviewAvailability> {
  return new Promise((resolve, reject) => {
    reject('Not implemented')
  })
}

export async function signupForInterviewPool (
  userId: number,
  interviewId: string
): Promise<Interview> {
  return new Promise((resolve, reject) => {
    reject('Not implemented')
  })
}
