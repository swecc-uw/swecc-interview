import { useNavigate } from 'react-router-dom';
import MemberProfileEdit from '../components/MemberProfileEdit';
import MemberProfileView from '../components/MemberProfileView';
import { useAuth } from '../hooks/useAuth';
import { Member } from '../types';
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  Stack,
  HStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import LeetcodeProfile from '../components/LeetcodeProfile';
import GitHubCalendar, { Activity, ThemeInput } from 'react-github-calendar';
import { updateMemberProfile } from '../services/member';
import { devPrint } from '../components/utils/RandomUtils';

const selectLastHalfYear = (contributions: Activity[]) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const shownMonths = 6;

  return contributions.filter((activity) => {
    const date = new Date(activity.date);
    const monthOfDay = date.getMonth();

    return (
      date.getFullYear() === currentYear &&
      monthOfDay > currentMonth - shownMonths &&
      monthOfDay <= currentMonth
    );
  });
};

const Widgets: React.FC<{ member: Member }> = ({ member }) => {
  const githubTheme: ThemeInput = {
    dark: ['#f0f0f0', '#dcd0ff', '#c4a3ff', '#a876ff', '#8a00d4'],
    light: ['#333333', '#62419d', '#7139bf', '#822df2', '#8a00d4'],
  };

  return (
    <Box borderRadius="lg" p={6} mt={6}>
      <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
        {member.leetcode && (
          <Box p={4} flex="1">
            <LeetcodeProfile username={member.leetcode.username} />
          </Box>
        )}
        {member.github && member.github.username.length > 0 && (
          <Box p={4} overflowX="auto" flex="1">
            <GitHubCalendar
              username={member.github.username}
              transformData={selectLastHalfYear}
              theme={githubTheme}
              year={new Date().getFullYear()}
              labels={{
                totalCount: 'last 6 months: {{count}} commits',
              }}
            />
          </Box>
        )}
      </Stack>
    </Box>
  );
};

const MemberProfilePage: React.FC = () => {
  const { logout, member: authMember } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [member, setMember] = useState<Member | null>(authMember || null);

  const onSave = (member: Partial<Member>) => {
    updateMemberProfile(member)
      .then(() => {
        setIsEditing(false);
      })
      .catch((error) => {
        devPrint('Error updating profile:', error);
      })
      .finally(() => {
        setMember((prevMember) => {
          if (!prevMember) {
            return prevMember;
          }
          return {
            ...prevMember,
            ...member,
          };
        });
      });
  };

  useEffect(() => {
    if (!member) {
      navigate('/');
    }
  }, [member, navigate]);

  if (!member) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const Content: React.FC = () => {
    if (isEditing) {
      return <MemberProfileEdit member={member} onSave={onSave} />;
    } else {
      return <MemberProfileView member={member} />;
    }
  };

  return (
    <Container maxW="container.lg" py={8}>
      <Box p={6}>
        <VStack spacing={4} align="stretch">
          <HStack spacing={4}>
            <Heading as="h1" size="lg" flex="1">
              Profile
            </Heading>
            <Button colorScheme="brand" onClick={() => setIsEditing((p) => !p)}>
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
            <Button colorScheme="brand" onClick={handleLogout}>
              Logout
            </Button>
          </HStack>
          <Content />
        </VStack>
        {!isEditing && (
          <VStack spacing={4} align="stretch">
            <Widgets member={member} />
          </VStack>
        )}
      </Box>
    </Container>
  );
};

export default MemberProfilePage;
