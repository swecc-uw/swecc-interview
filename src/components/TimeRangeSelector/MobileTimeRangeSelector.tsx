import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Button,
  Select,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  defaultDayLabels,
  defaultTimeLabels,
  getMinAndMaxTimeIndex,
} from '../utils/RandomUtils';

interface MobileTimeRangeSelectorProps {
  availability: boolean[][];
  onChange: (newAvailability: boolean[][]) => void;
  title: string;
  dayLabels?: string[];
  timeLabels?: string[];
}

const MobileTimeRangeSelector: React.FC<MobileTimeRangeSelectorProps> = ({
  availability,
  onChange,
  title,
  dayLabels = defaultDayLabels,
  timeLabels = defaultTimeLabels,
}) => {
  const [minAvailableTimeIdx, maxAvailableTimeIdx] =
    getMinAndMaxTimeIndex(availability);

  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<boolean[][]>(availability);
  const [startTimeIdx, setStartTimeIdx] = useState<number>(minAvailableTimeIdx);
  const [endTimeIdx, setEndTimeIdx] = useState<number>(maxAvailableTimeIdx);

  const toggleTimeSlot = (dayIndex: number, timeIndex: number) => {
    const newSlots = selectedSlots.map((day, i) =>
      i === dayIndex
        ? day.map((slot, j) => (j === timeIndex ? !slot : slot))
        : day
    );
    setSelectedSlots(newSlots);
    onChange(newSlots);
  };

  const handleDayClick = (index: number) => {
    setSelectedDayIndex(index === selectedDayIndex ? null : index);
  };

  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = 'gray.600';

  return (
    <VStack spacing={4} align="stretch" w="100%" p={4}>
      <Text
        fontSize="2xl"
        fontWeight="bold"
        textAlign="center"
        color={textColor}
      >
        {title}
      </Text>
      <HStack justify="space-between" mb={4}>
        {/* Control the start time/end time with a two pointed slider */}
        <Select
          value={startTimeIdx}
          onChange={(e) => setStartTimeIdx(parseInt(e.target.value))}
          colorScheme="brand"
        >
          {timeLabels.map((time, i) => (
            <option key={time} value={i}>
              {time}
            </option>
          ))}
        </Select>
        <Select
          value={endTimeIdx}
          onChange={(e) => setEndTimeIdx(parseInt(e.target.value))}
          colorScheme="brand"
        >
          {timeLabels.map((time, i) => (
            <option key={time} value={i}>
              {time}
            </option>
          ))}
        </Select>
        <Text fontSize="lg">
          {timeLabels[startTimeIdx]} - {timeLabels[endTimeIdx]}
        </Text>
      </HStack>
      {dayLabels.map((day, dayIndex) => (
        <Box
          key={day}
          borderWidth="1px"
          borderRadius="lg"
          borderColor={borderColor}
          w="100%"
          p={3}
        >
          <Text
            fontSize="lg"
            fontWeight="medium"
            onClick={() => handleDayClick(dayIndex)}
            cursor="pointer"
            color={textColor}
          >
            {day}
          </Text>
          {selectedDayIndex === dayIndex && (
            <VStack spacing={2} mt={3}>
              {timeLabels
                .map((time, timeIndex) => ({ time, timeIndex }))
                .slice(startTimeIdx, endTimeIdx)
                .map(({ time, timeIndex }) => (
                  <HStack key={time} w="100%" justifyContent="space-between">
                    <Text fontSize="sm" width="80px">
                      {time}
                    </Text>
                    <Button
                      size="sm"
                      color={
                        selectedSlots[dayIndex][timeIndex] ? 'brand' : 'gray'
                      }
                      onClick={() => toggleTimeSlot(dayIndex, timeIndex)}
                      flex={1}
                    >
                      {selectedSlots[dayIndex][timeIndex]
                        ? 'Available'
                        : 'Unavailable'}
                    </Button>
                  </HStack>
                ))}
            </VStack>
          )}
        </Box>
      ))}
    </VStack>
  );
};

export default MobileTimeRangeSelector;
