import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';

interface MobileTimeRangeSelectorProps {
  availability: boolean[][];
  onChange: (newAvailability: boolean[][]) => void;
  title: string;
  dayLabels?: string[];
  timeLabels?: string[];
}

const defaultDayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const defaultTimeLabels = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minutes}`;
});

const MobileTimeRangeSelector: React.FC<MobileTimeRangeSelectorProps> = ({
  availability,
  onChange,
  title,
  dayLabels = defaultDayLabels,
  timeLabels = defaultTimeLabels,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<boolean[][]>(availability);

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

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <VStack spacing={4} align="stretch" w="100%" bg={bgColor} p={4}>
      <Text
        fontSize="2xl"
        fontWeight="bold"
        textAlign="center"
        color={textColor}
      >
        {title}
      </Text>
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
              {timeLabels.map((time, timeIndex) => (
                <HStack key={time} w="100%" justifyContent="space-between">
                  <Text fontSize="sm" width="80px">
                    {time}
                  </Text>
                  <Button
                    size="sm"
                    colorScheme={
                      selectedSlots[dayIndex][timeIndex] ? 'teal' : 'gray'
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
