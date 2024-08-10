import { Member } from '../types'

export async function searchMembers(nameQuery: string): Promise<Member[]> {
  return new Promise((resolve, reject) => {
    reject('Not implemented')
  })
}