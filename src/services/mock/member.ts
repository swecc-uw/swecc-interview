import { Member, User } from '../../types'

export async function getCurrentUser (): Promise<User> {
  return new Promise(resolve => {
    resolve({
      id: 1,
      username: 'john_doe',
      email: 'john.doe@example.com'
      // Add other fields as needed
    })
  })
}

export async function getMemberProfile (userId: number): Promise<Member> {
  return new Promise(resolve => {
    resolve({
      user: {
        id: 1,
        username: 'elimelt',
        email: 'elimelt@uw.edu'
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
      bio: 'It has been a lifelong dream of mine to kill myself',
      discordId: 1234567890
    })
  })
}

export async function updateMemberProfile (
  userId: number,
  profile: Partial<Member>
): Promise<Member> {
  return new Promise(resolve => {
    resolve({
      user: {
        id: 1,
        username: 'elimelt',
        email: 'elimelt@uw.edu'
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
      bio: 'It has been a lifelong dream of mine to kill myself',
      discordId: 1234567890
    })
  })
}
