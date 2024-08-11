import { Member } from '../../types';

export async function searchMembers(nameQuery: string): Promise<Member[]> {
  return new Promise((resolve, reject) => {
    resolve([
      {
        user: {
          id: 1,
          username: 'elimelt',
          email: 'elimelt@uw.edu',
        },
        created: '2024-07-26T00:00:00Z',
        email: 'elimelt@uw.edu',
        role: 'President',
        firstName: 'Elijah',
        lastName: 'Melton',
        preview:
          'I am a Senior at the University of Washington studying computer engineering.',
        major: 'Computer Engineering',
        gradDate: '2024-06-15',
        discordUsername: 'elimelt',
        linkedin: { username: 'elimelt', isPrivate: false },
        github: { username: 'elimelt', isPrivate: true },
        leetcode: { username: 'elimelt', isPrivate: false },
        resumeUrl: 'https://example.com/resume.pdf',
        local: 'Seattle',
        bio: 'It has been a lifelong dream of mine to go to Italy',
        discordId: 1234567890,
      },
    ]);
  });
}

export async function getMemberById(userId: number): Promise<Member | null> {
  return new Promise((resolve, reject) => {
    resolve({
      user: {
        id: 1,
        username: 'elimelt',
        email: 'elimelt@uw.edu',
      },
      created: '2024-07-26T00:00:00Z',
      email: 'elimelt@uw.edu',
      role: 'President',
      firstName: 'Elijah',
      lastName: 'Melton',
      preview:
        'I am a Senior at the University of Washington studying computer engineering.',
      major: 'Computer Engineering',
      gradDate: '2024-06-15',
      discordUsername: 'elimelt',
      linkedin: { username: 'elimelt', isPrivate: false },
      github: { username: 'elimelt', isPrivate: true },
      leetcode: { username: 'elimelt', isPrivate: false },
      resumeUrl: 'https://example.com/resume.pdf',
      local: 'Seattle',
      bio: 'It has been a lifelong dream of mine to go to Italy',
      discordId: 1234567890,
    });
  });
}
