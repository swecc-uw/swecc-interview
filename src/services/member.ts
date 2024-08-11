import { User, Member } from "../types";
// import api from './api'

export async function getCurrentUser(): Promise<User> {
  return new Promise((resolve, reject) => {
    reject("Not implemented");
  });
}

export async function getMemberProfile(userId: string): Promise<Member> {
  return new Promise((resolve, reject) => {
    reject("Not implemented");
  });
}

export async function updateMemberProfile(
  userId: string,
  profile: Partial<Member>
): Promise<Member> {
  return new Promise((resolve, reject) => {
    reject("Not implemented");
  });
}
