import React, { useState, useRef, useEffect } from 'react';
import './TimeRangeSelector.css';

interface TimeSlot {
  day: number;
  time: number;
}

interface TimeRangeSelectorProps {
  availability: boolean[][];
  onChange: (newAvailability: boolean[][]) => void;
  title: string;
  dayLabels?: string[];
  timeLabels?: string[];
  selectedColor?: string;
  unselectedColor?: string;
}

const getDefaultDayLabels = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDate();
  const nextSunday = new Date();
  nextSunday.setDate(today + (7 - nextSunday.getDay()));
  return days.map((day, i) => {
    const date = new Date();
    date.setDate(nextSunday.getDate() + i);
    return `${day} ${date.getMonth() + 1}/${date.getDate()}`;
  });
};

const defaultDayLabels = getDefaultDayLabels();
const defaultTimeLabels = Array.from({ length: 48 }, (_, i) => {
  const hour = (Math.floor(i / 2) + 7) % 24;
  const minutes = i % 2 === 0 ? '00' : '30';
  const adjustedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const amPm = hour >= 12 && hour < 24 ? 'PM' : 'AM';
  return `${adjustedHour}:${minutes} ${amPm}`;
});

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  availability,
  onChange,
  title,
  dayLabels = defaultDayLabels,
  timeLabels = defaultTimeLabels,
  selectedColor = 'teal',
  unselectedColor = 'gray',
}) => {
  const [selectedSlots, setSelectedSlots] = useState<boolean[][]>(availability);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<TimeSlot | null>(null);
  const [isSelecting, setIsSelecting] = useState(true);
  const lastSlotEntered = useRef<TimeSlot | null>(null);

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
    <div className="box">
      <div className="title">{title}</div>
      <div className="grid">
        <div className="gridItem"></div>
        {dayLabels.map((day) => (
          <div key={day} className="gridItem dayLabel">
            {day}
          </div>
        ))}
        {timeLabels.map((time, ti) => (
          <React.Fragment key={time}>
            <div className="gridItem timeLabel">{time}</div>
            {Array.from({ length: dayLabels.length }).map((_, di) => (
              <div
                key={`${di}-${ti}`}
                className="gridItem timeSlot"
                style={{
                  backgroundColor: selectedSlots[di][ti]
                    ? selectedColor
                    : unselectedColor,
                }}
                onMouseDown={() => handleMouseDown(di, ti)}
                onMouseEnter={() => handleMouseEnter(di, ti)}
              ></div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TimeRangeSelector;
