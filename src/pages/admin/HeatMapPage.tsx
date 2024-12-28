import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Spinner,
  Center,
  HStack,
  Input,
  Button,
} from '@chakra-ui/react';
import { DAY } from '../../localization';
import { getSignupTimeline } from '../../services/interview';
import { RawSignup } from '../../types';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { AxiosError } from 'axios';
import DayTimeline from '../../components/DayTimeline';
import DayGrid from '../../components/DayGrid';

export const HeatMapPage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(
    Math.floor(Date.now() / DAY) * DAY
  );
  const [signups, setSignups] = useState<RawSignup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [daysInput, setDaysInput] = useState<number>();
  const [daysDisplayed, setDaysDisplayed] = useState(14);
  const navigate = useNavigate();
  const fetchData = async () => {
    setIsLoading(true);
    getSignupTimeline(daysDisplayed)
      .then((data: RawSignup[]) => setSignups(data))
      .catch((err: AxiosError) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [daysDisplayed]);

  if (isLoading) {
    return (
      <Center h="200px">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="200px">
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  return (
    <Box maxW="1200px" mx="auto" p={[4, 8]}>
      <VStack spacing={[4, 8]} align="stretch">
        <Button
          colorScheme="blue"
          onClick={() => navigate('/admin')}
          alignSelf="flex-start"
          leftIcon={<ArrowBackIcon />}
        >
          Go back
        </Button>
        <Text fontSize={['xl', '2xl']} fontWeight="bold">
          Current pool signup timeline
        </Text>
        <form
          onSubmit={(e) => {
            if (!daysInput) return;
            e.preventDefault();
            setDaysDisplayed(daysInput);
          }}
        >
          <HStack>
            <Input
              type="number"
              placeholder="Enter number of days to display (default 14)"
              value={daysInput}
              onChange={(e) =>
                setDaysInput(Math.max(1, Number(e.target.value)))
              }
            />
            <Button type="submit" colorScheme="blue">
              Refresh
            </Button>
          </HStack>
        </form>
        <DayGrid
          signups={signups}
          daysDisplayed={daysDisplayed}
          onSelectDay={setSelectedDay}
          selectedDay={selectedDay}
        />
        <Box overflowX="auto" width="100%">
          <DayTimeline
            signups={signups}
            selectedDay={selectedDay}
            height={120}
          />
        </Box>
      </VStack>
    </Box>
  );
};

export default HeatMapPage;
