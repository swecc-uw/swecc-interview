import { Member, RawMemberData } from '../types';
import api from './api';
import { devPrint } from '../components/utils/RandomUtils';
import { AxiosResponse } from 'axios';

function deserializeMember(data: RawMemberData): Member {
  return {
    id: data.user,
    username: data.username,
    created: data.created,
    email: data.email,
    role: data.role,
    firstName: data.first_name,
    lastName: data.last_name,
    preview: data.preview,
    major: data.major,
    gradDate: data.grad_date,
    discordUsername: data.discord_username,
    linkedin: data.linkedin,
    github: data.github,
    leetcode: data.leetcode,
    resumeUrl: data.resume_url,
    local: data.local,
    bio: data.bio,
    discordId: data.discord_id,
  };
}

export async function searchMembers(nameQuery: string): Promise<Member[]> {
  const url = `/directory/search/?q=${nameQuery}`;
  const res: AxiosResponse = await api.get(url);
  devPrint('res:', res);

  if (res.status !== 200) {
    throw new Error('Failed to search for members');
  }

  if (!Object.prototype.hasOwnProperty.call(res, 'data')) {
    throw new Error('Failed to search for members');
  }

  return res.data.map(deserializeMember);
}

export async function getMemberById(userId: number): Promise<Member> {
  const url = `/directory/${userId}`;
  const res: AxiosResponse = await api.get(url);
  devPrint('res:', res);

  if (res.status !== 200) throw new Error('Failed to get member profile');

  if (!Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to get member profile');

  return deserializeMember(res.data);
}
