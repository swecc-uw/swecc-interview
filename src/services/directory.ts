import { Member } from '../types'
import api from '../api'

export async function searchMembers(nameQuery: string): Promise<Member[]> {
  try {
    const url = `/api/directory/search/?q=${nameQuery}`
    const res: any = await api.get(url)
    console.log('res:', res)

    if (res.status !== 200) {
      throw new Error('Failed to search for members')
    }

    if (!Object.prototype.hasOwnProperty.call(res, 'data')) {
    throw new Error('Failed to search for members')
    }

    return res.data

  } catch (error) {
    console.error('Failed to search for members:', error)
    return []
  }
}

export async function getMemberById(userId: number): Promise<Member> {
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