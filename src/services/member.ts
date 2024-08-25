import { devPrint } from '../components/utils/RandomUtils';
import { Member } from '../types';
import api from './api';

export async function getCurrentUser(): Promise<Member> {
  const url = '/members/profile';
  const res = await api.get(url);
  devPrint('res:', res);

  if (res.status !== 200) throw new Error('Failed to get current user');

  if (!Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to get current user');

  return {
    ...res.data,
    id: res.data.user,
  };
}

export async function getMemberProfile(userId: number): Promise<Member> {
  const url = `/members/${userId}`;
  const res = await api.get(url);
  devPrint('res:', res);

  if (res.status !== 200) throw new Error('Failed to get member profile');

  if (!Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to get member profile');

  return res.data;
}

export async function updateMemberProfile(
  userId: number,
  profile: Partial<Member>
): Promise<Member> {
  try {
    const url = `/members/${userId}`;
    const res = await api.put(url, profile);
    devPrint('res:', res);

    if (res.status !== 200) {
      throw new Error('Failed to update member profile');
    }

    if (!Object.prototype.hasOwnProperty.call(res, 'data')) {
      throw new Error('Failed to update member profile');
    }

    return res.data;
  } catch (error) {
    devPrint('Failed to update member profile:', error);
    return {} as Member;
  }
}
