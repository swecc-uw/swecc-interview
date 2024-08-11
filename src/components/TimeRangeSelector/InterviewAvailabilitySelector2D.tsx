import React, { useState, useRef } from 'react';
import { Box, Grid, GridItem, Text } from '@chakra-ui/react';

interface TimeSlot {
  day: number;
  time: number;
}

interface InterviewAvailabilitySelectorProps {
  availability: boolean[][];
  onChange: (newAvailability: boolean[][]) => void;
}

/*
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = []
  const daysInWeek = 7
  const slotsPerDay = 48

  for (let time = 0; time < slotsPerDay; time++) {
    for (let day = 0; day < daysInWeek; day++) {
      slots.push({ day, time })
    }
  }
  return slots
}
*/

const InterviewAvailabilitySelector2D: React.FC<
  InterviewAvailabilitySelectorProps
> = ({ availability, onChange }) => {
  const [selectedSlots, setSelectedSlots] = useState<boolean[][]>(availability);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<TimeSlot | null>(null);
  const [isSelecting, setIsSelecting] = useState(true);
  const lastSlotEntered = useRef<TimeSlot | null>(null as any);
  const directionChangePivot = useRef<TimeSlot | null>(null as any);

  // const handleSlotChange = (day: number, time: number) => {
  //   const updatedAvailability = selectedSlots.map((slotRow, rowIndex) =>
  //     rowIndex === day ? slotRow.map((slot, colIndex) => (colIndex === time ? !slot : slot)) : slotRow
  //   );
  //   setSelectedSlots(updatedAvailability);
  //   onChange(updatedAvailability);
  // };

  // if last cell entered is above the pivot cell, then the direction is down
  const wasTravelingDown = () =>
    lastSlotEntered.current &&
    directionChangePivot.current &&
    dragStart &&
    lastSlotEntered.current.time >= directionChangePivot.current.time;
  // if cell we just entered is >= to the last cell entered, then we are traveling dowbn
  const isTravelingDown = (time: number) =>
    lastSlotEntered.current &&
    dragStart &&
    time >= lastSlotEntered.current.time;

  const handleMouseDown = (day: number, time: number) => {
    lastSlotEntered.current = { day, time };
    directionChangePivot.current = { day, time };
    setIsSelecting(!selectedSlots[day][time]);
    setIsDragging(true);
    setDragStart({ day, time });
  };

  const handleMouseEnter = (day: number, time: number) => {
    if (isDragging && dragStart) {
      const wasDown = wasTravelingDown();
      const isDown = isTravelingDown(time);
      const chanedDirection = wasDown !== isDown;
      if (chanedDirection) {
        setIsSelecting((prev) => !prev);
        directionChangePivot.current = { day, time };
      }

      lastSlotEntered.current = { day, time };

      const updatedAvailability = [...selectedSlots];

      if (chanedDirection) {
        if (isDown) {
          setIsSelecting(!selectedSlots[day][time]);
        }
      } else {
        const startTime = Math.min(dragStart.time, time);
        const endTime = Math.max(dragStart.time, time);
        for (let t = startTime; t <= endTime; t++)
          updatedAvailability[dragStart.day][t] = isSelecting;
      }
      setSelectedSlots(updatedAvailability);
    }
  };

  const handleMouseUp = () => {
    const justClickedOnThisSlot =
      dragStart &&
      lastSlotEntered.current &&
      dragStart.day === lastSlotEntered.current.day &&
      dragStart.time === lastSlotEntered.current.time;
    if (justClickedOnThisSlot) {
      setSelectedSlots(
        selectedSlots.map((slotRow, rowIndex) =>
          rowIndex === dragStart.day
            ? slotRow.map((slot, colIndex) =>
                colIndex === dragStart.time ? !slot : slot
              )
            : slotRow
        )
      );
    }

    setIsDragging(false);
    setDragStart(null);
    onChange(selectedSlots);
  };

  const times = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? '00' : '30';
    return `${hour}:${minutes}`;
  });

  return (
    <Box bg="white" p={6} rounded="lg" shadow="md">
      <Text fontSize="2xl" mb={4} textAlign="center">
        Select Your Availability
      </Text>
      <Grid templateColumns={`repeat(8, 1fr)`} gap={2}>
        <GridItem></GridItem>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <GridItem key={day} textAlign="center" fontWeight="bold">
            {day}
          </GridItem>
        ))}
        {times.map((time, timeIndex) => (
          <React.Fragment key={time}>
            <GridItem textAlign="center" fontWeight="bold">
              {time}
            </GridItem>
            {Array.from({ length: 7 }).map((_, dayIndex) => (
              <GridItem
                key={`${dayIndex}-${timeIndex}`}
                bg={
                  selectedSlots[dayIndex][timeIndex] ? 'teal.300' : 'gray.100'
                }
                p={1}
                onMouseDown={() => handleMouseDown(dayIndex, timeIndex)}
                onMouseEnter={() => handleMouseEnter(dayIndex, timeIndex)}
                onMouseUp={handleMouseUp}
              />
            ))}
          </React.Fragment>
        ))}
      </Grid>
    </Box>
  );
};

export default InterviewAvailabilitySelector2D;
