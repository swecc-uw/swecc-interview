import { Member, RawMemberData } from '../types';
import api from './api';
import { devPrint } from '../components/utils/RandomUtils';
import { AxiosResponse } from 'axios';

function deserializeMember({
  user: id,
  first_name: firstName,
  last_name: lastName,
  grad_date: gradDate,
  discord_username: discordUsername,
  resume_url: resumeUrl,
  discord_id: discordId,
  ...rest
}: RawMemberData): Member {
  return {
    id,
    firstName,
    lastName,
    gradDate,
    discordUsername,
    resumeUrl,
    discordId,
    ...rest,
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
