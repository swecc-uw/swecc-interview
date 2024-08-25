import { devPrint } from '../components/utils/RandomUtils';
import { Member } from '../types';
import api from './api';

function serializeMember(member: any): Member {
  return {
    id: member.user,
    username: member.username,
    created: member.created,
    email: member.email,
    role: member.role,
    firstName: member.first_name,
    lastName: member.last_name,
    preview: member.preview,
    major: member.major,
    gradDate: member.grad_date,
    discordUsername: member.discord_username,
    linkedin: member.linkedin,
    github: member.github,
    leetcode: member.leetcode,
    resumeUrl: member.resume_url,
    local: member.local,
    bio: member.bio,
    discordId: member.discord_id,
  };
}

export async function getCurrentUser(): Promise<Member> {
  const url = '/members/profile';
  const res = await api.get(url);
  devPrint('res:', res);

  if (res.status !== 200) throw new Error('Failed to get current user');

  if (!Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to get current user');

  return serializeMember(res.data);
}

export async function getMemberProfile(userId: number): Promise<Member> {
  const url = `/members/${userId}`;
  const res = await api.get(url);
  devPrint('res:', res);

  if (res.status !== 200) throw new Error('Failed to get member profile');

  if (!Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to get member profile');

  return serializeMember(res.data);
}

export async function updateMemberProfile(
  profile: Partial<Member>
): Promise<Member> {
  const url = `/members/profile`;

  const res = await api.put(url, profile);
  devPrint('res:', res);

  if (res.status !== 200 || !Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to update member profile');

  return serializeMember(res.data);
}
