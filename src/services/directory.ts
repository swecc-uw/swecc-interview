import { Member } from '../types';
import api from './api';
import { devPrint } from '../components/utils/RandomUtils';

export async function searchMembers(nameQuery: string): Promise<Member[]> {
  const url = `/directory/search/?q=${nameQuery}`;
  const res: any = await api.get(url);
  devPrint('res:', res);

  if (res.status !== 200) {
    throw new Error('Failed to search for members');
  }

  if (!Object.prototype.hasOwnProperty.call(res, 'data')) {
    throw new Error('Failed to search for members');
  }

  return res.data.map((member: any) => {
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
  });
}

export async function getMemberById(userId: number): Promise<Member> {
  const url = `/directory/${userId}`;
  const res: any = await api.get(url);
  devPrint('res:', res);

  if (res.status !== 200) throw new Error('Failed to get member profile');

  if (!Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to get member profile');

  return res.data;
}
