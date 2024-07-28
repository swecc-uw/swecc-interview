import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Grid,
  GridItem,
  Text,
  Tooltip,
  useColorModeValue
} from '@chakra-ui/react'

interface TimeSlot {
  day: number
  time: number
}

interface TimeRangeSelectorProps {
  availability: boolean[][]
  onChange: (newAvailability: boolean[][]) => void
  title: string
  dayLabels?: string[] // Custom labels for days
  timeLabels?: string[] // Custom labels for times
  selectedColor?: string // Custom color for selected slots
  unselectedColor?: string // Custom color for unselected slots
}

const defaultDayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const defaultTimeLabels = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2)
  const minutes = i % 2 === 0 ? '00' : '30'
  return `${hour}:${minutes}`
})

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  availability,
  onChange,
  title,
  dayLabels = defaultDayLabels,
  timeLabels = defaultTimeLabels,
  selectedColor = 'teal.400',
  unselectedColor = 'gray.100'
}) => {
  const [selectedSlots, setSelectedSlots] = useState<boolean[][]>(availability)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<TimeSlot | null>(null)
  const [isSelecting, setIsSelecting] = useState(true)
  const lastSlotEntered = useRef<TimeSlot | null>(null)

  // Handle global mouse up event
  useEffect(() => {
    const handleMouseUp = () => {
      if (
        dragStart &&
        lastSlotEntered.current &&
        dragStart.day === lastSlotEntered.current.day &&
        dragStart.time === lastSlotEntered.current.time
      ) {
        setSelectedSlots(slots =>
          slots.map((row, rowIndex) =>
            rowIndex === dragStart.day
              ? row.map((slot, colIndex) =>
                  colIndex === dragStart.time ? !slot : slot
                )
              : row
          )
        )
      }
      setIsDragging(false)
      setDragStart(null)
      onChange(selectedSlots)
    }

    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragStart, lastSlotEntered, selectedSlots, onChange])

  const handleMouseDown = (day: number, time: number) => {
    lastSlotEntered.current = { day, time }
    setIsSelecting(!selectedSlots[day][time])
    setIsDragging(true)
    setDragStart({ day, time })
  }

  const handleMouseEnter = (day: number, time: number) => {
    if (!isDragging || !dragStart) return

    lastSlotEntered.current = { day, time }

    const updatedAvailability = [...selectedSlots]
    const startDay = Math.min(dragStart.day, day)
    const endDay = Math.max(dragStart.day, day)
    const startTime = Math.min(dragStart.time, time)
    const endTime = Math.max(dragStart.time, time)

    for (let d = startDay; d <= endDay; d++) {
      for (let t = startTime; t <= endTime; t++) {
        updatedAvailability[d][t] = isSelecting
      }
    }

    setSelectedSlots(updatedAvailability)
  }

  return (
    <Box bg='white' p={6} rounded='lg' shadow='lg' borderWidth='1px'>
      <Text fontSize='2xl' mb={4} textAlign='center' fontWeight='bold'>
        {title}
      </Text>
      <Grid templateColumns={`repeat(${dayLabels.length + 1}, 1fr)`} gap={0}>
        <GridItem></GridItem>
        {dayLabels.map(day => (
          <GridItem
            key={day}
            textAlign='center'
            fontWeight='bold'
            color={useColorModeValue('gray.700', 'gray.300')}
            userSelect='none'
          >
            {day}
          </GridItem>
        ))}
        {timeLabels.map((time, ti) => (
          <React.Fragment key={time}>
            <GridItem
              textAlign='center'
              fontWeight='bold'
              color={useColorModeValue('gray.700', 'gray.300')}
              userSelect='none'
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
                  borderRadius='md'
                  borderWidth='1px'
                  borderColor='gray.200'
                  cursor='pointer'
                  _hover={{
                    bg: selectedSlots[di][ti] ? selectedColor : 'gray.200'
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
  )
}

export default TimeRangeSelector
