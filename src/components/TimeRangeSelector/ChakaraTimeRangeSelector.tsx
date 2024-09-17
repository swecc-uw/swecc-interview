import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  HStack,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  defaultDayLabels,
  defaultTimeLabels,
  getMinAndMaxTimeIndex,
} from '../utils/RandomUtils';
import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from '@chakra-ui/react';

interface TimeSlot {
  day: number;
  time: number;
}

interface TimeRangeSelectorProps {
  availability: boolean[][];
  onChange: (newAvailability: boolean[][]) => void;
  title: string;
  dayLabels?: string[]; // Custom labels for days
  timeLabels?: string[]; // Custom labels for times
  selectedColor?: string; // Custom color for selected slots
  unselectedColor?: string; // Custom color for unselected slots
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  availability,
  onChange,
  title,
  dayLabels = defaultDayLabels,
  timeLabels = defaultTimeLabels,
  selectedColor = 'teal.400',
  unselectedColor = 'gray.100',
}) => {
  const [minAvailableTimeIdx, maxAvailableTimeIdx] =
    getMinAndMaxTimeIndex(availability);

  const [selectedSlots, setSelectedSlots] = useState<boolean[][]>(availability);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<TimeSlot | null>(null);
  const [isSelecting, setIsSelecting] = useState(true);
  const [startTimeIdx, setStartTimeIdx] = useState<number>(minAvailableTimeIdx);
  const [endTimeIdx, setEndTimeIdx] = useState<number>(maxAvailableTimeIdx);
  const lastSlotEntered = useRef<TimeSlot | null>(null);
  const textColor = useColorModeValue('gray.800', 'white');

  useEffect(() => {
    setSelectedSlots(availability);
  }, [availability]);

  // Handle global mouse up event
  useEffect(() => {
    const handleMouseUp = () => {
      if (
        dragStart &&
        lastSlotEntered.current &&
        dragStart.day === lastSlotEntered.current.day &&
        dragStart.time === lastSlotEntered.current.time
      ) {
        setSelectedSlots((slots) =>
          slots.map((row, rowIndex) =>
            rowIndex === dragStart.day
              ? row.map((slot, colIndex) =>
                  colIndex === dragStart.time ? !slot : slot
                )
              : row
          )
        );
      }
      setIsDragging(false);
      setDragStart(null);
      onChange(selectedSlots);
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragStart, lastSlotEntered, selectedSlots, onChange]);

  const handleMouseDown = (day: number, time: number) => {
    lastSlotEntered.current = { day, time };
    setIsSelecting(!selectedSlots[day][time]);
    setIsDragging(true);
    setDragStart({ day, time });
  };

  const handleMouseEnter = (day: number, time: number) => {
    if (!isDragging || !dragStart) return;

    lastSlotEntered.current = { day, time };

    const updatedAvailability = [...selectedSlots];
    const startDay = Math.min(dragStart.day, day);
    const endDay = Math.max(dragStart.day, day);
    const startTime = Math.min(dragStart.time, time);
    const endTime = Math.max(dragStart.time, time);

    for (let d = startDay; d <= endDay; d++) {
      for (let t = startTime; t <= endTime; t++) {
        updatedAvailability[d][t] = isSelecting;
      }
    }

    setSelectedSlots(updatedAvailability);
  };

  return (
    <Box p={6}>
      <Text fontSize="2xl" mb={4} textAlign="center" fontWeight="bold">
        {title}
      </Text>
      <HStack justify="space-between" mb={4}>
        {/* Control the start time/end time with a two pointed slider */}
        <RangeSlider
          min={0}
          max={48}
          step={1}
          width={600}
          defaultValue={[startTimeIdx, endTimeIdx]}
          onChange={(values) => {
            setStartTimeIdx(values[0]);
            setEndTimeIdx(values[1]);
          }}
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <Tooltip label={timeLabels[startTimeIdx]} aria-label="Start time">
            <RangeSliderThumb index={0} />
          </Tooltip>
          <Tooltip label={timeLabels[endTimeIdx]} aria-label="End time">
            <RangeSliderThumb index={1} />
          </Tooltip>
        </RangeSlider>
        <Text fontSize="lg" color={textColor}>
          {timeLabels[startTimeIdx]} - {timeLabels[endTimeIdx]}
        </Text>
      </HStack>

      <Grid templateColumns={`repeat(${dayLabels.length + 1}, 1fr)`} gap={0}>
        <GridItem></GridItem>
        {dayLabels.map((day) => (
          <GridItem
            key={day}
            textAlign="center"
            fontWeight="bold"
            color={textColor}
            userSelect="none"
          >
            {day}
          </GridItem>
        ))}
        {timeLabels
          .map((time, ti) => ({ time, ti }))
          .slice(startTimeIdx, endTimeIdx)
          .map(({ time, ti }) => (
            <React.Fragment key={time}>
              <GridItem
                textAlign="center"
                fontWeight="bold"
                color={textColor}
                userSelect="none"
              >
                {time}
              </GridItem>
              {Array.from({ length: dayLabels.length }).map((_, di) => (
                <Tooltip
                  key={`${di}-${ti}`}
                  label={`Day ${di + 1}, Time ${time}`}
                  aria-label={`Tooltip for day ${di + 1} and time ${time}`}
                >
                  <GridItem
                    bg={selectedSlots[di][ti] ? selectedColor : unselectedColor}
                    p={2}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="gray.200"
                    cursor="pointer"
                    _hover={{
                      bg: selectedSlots[di][ti] ? selectedColor : 'gray.200',
                    }}
                    onMouseDown={() => handleMouseDown(di, ti)}
                    onMouseEnter={() => handleMouseEnter(di, ti)}
                  />
                </Tooltip>
              ))}
            </React.Fragment>
          ))}
      </Grid>
    </Box>
  );
};

export default TimeRangeSelector;
