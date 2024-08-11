import { useNavigate } from "react-router-dom";
import MemberProfileEdit from "../components/MemberProfileEdit";
import MemberProfileView from "../components/MemberProfileView";
import { useMember } from "../context/MemberContext";
import { Member } from "../types";
import {
  Box,
  Button,
  Container,
  Heading,
  useColorModeValue,
  VStack,
  Stack,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import LeetcodeProfile from "../components/LeetcodeProfile";
import GitHubCalendar, { ThemeInput } from "react-github-calendar";

const selectLastHalfYear = (contributions: any) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const shownMonths = 6;

  return contributions.filter((activity: any) => {
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
    dark: ["#f0f0f0", "#dcd0ff", "#c4a3ff", "#a876ff", "#8a00d4"],
    light: ["#333333", "#62419d", "#7139bf", "#822df2", "#8a00d4"],
  };

  return (
    <Box
      bg={useColorModeValue("white", "gray.800")}
      borderRadius="lg"
      p={6}
      mt={6}
    >
      <Stack direction={{ base: "column", md: "row" }} spacing={4}>
        {member.leetcode && (
          <Box p={4} flex="1">
            <LeetcodeProfile username={member.leetcode.username} />
          </Box>
        )}
        {member.github && (
          <Box p={4} overflowX="auto" flex="1">
            <GitHubCalendar
              username={member.github.username}
              transformData={selectLastHalfYear}
              theme={githubTheme}
              year={new Date().getFullYear()}
              labels={{
                totalCount: "last 6 months: {{count}} commits",
              }}
            />
          </Box>
        )}
      </Stack>
    </Box>
  );
};

const MemberProfilePage: React.FC = () => {
  const { member } = useMember();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const onSave = (member: Partial<Member>) => {};

  useEffect(() => {
    if (!member) {
      navigate("/");
    }
  }, [member, navigate]);

  if (!member) {
    return null;
  }

  const Content: React.FC = () => {
    if (isEditing) {
      return <MemberProfileEdit member={member} onSave={onSave} />;
    } else {
      return <MemberProfileView member={member} />;
    }
  };

  return (
    <Container maxW="container.lg" py={8}>
      <Box p={6} bg={useColorModeValue("white", "gray.800")}>
        <VStack spacing={4} align="stretch">
          <HStack spacing={4}>
            <Heading as="h1" size="lg" flex="1">
              Profile
            </Heading>
            <Button colorScheme="teal" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit"}
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
