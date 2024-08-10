import { User, Member } from '../types'
import api from './api'

export async function getCurrentUser (): Promise<User> {
  try {
    const url = '/api/members/profile'
    const res: any = await api.get(url)
    console.log('res:', res)

    if (res.status !== 200) {
      throw new Error('Failed to get current user')
    }

    if (!Object.prototype.hasOwnProperty.call(res, 'data')) {
      throw new Error('Failed to get current user')
    }

    return res.data
  } catch (error) {
    console.error('Failed to get current user:', error)
    return {} as User
  }
}

export async function getMemberProfile (userId: number): Promise<Member> {
  try {
    const url = `/api/members/${userId}`
    const res: any = await api.get(url)
    console.log('res:', res)

    if (res.status !== 200) {
      throw new Error('Failed to get member profile')
    }

    if (!Object.prototype.hasOwnProperty.call(res, 'data')) {
      throw new Error('Failed to get member profile')
    }

    return res.data
  } catch (error) {
    console.error('Failed to get member profile:', error)
    return {} as Member
  }
}

export async function updateMemberProfile (
  userId: number,
  profile: Partial<Member>
): Promise<Member> {
  try {
    const url = `/api/members/${userId}`
    const res: any = await api.put(url, profile)
    console.log('res:', res)

    if (res.status !== 200) {
      throw new Error('Failed to update member profile')
    }

    if (!Object.prototype.hasOwnProperty.call(res, 'data')) {
      throw new Error('Failed to update member profile')
    }

    return res.data
  } catch (error) {
    console.error('Failed to update member profile:', error)
    return {} as Member
  }
}
