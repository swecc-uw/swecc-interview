import React, { useState } from 'react'
import './TimeSelector.css'

interface TimeSelectorProps {
  startDate: Date
  numDays: number
  startTime: number
  endTime: number
  availability: boolean[][]
  setAvailability: (availability: boolean[][]) => void
}

const TimeSelector: React.FC<TimeSelectorProps> = ({
  startDate,
  numDays,
  startTime,
  endTime,
  availability,
  setAvailability
}) => {

  const timeLabels = Array.from(
    { length: endTime - startTime + 1 },
    (_, i) => `${startTime + i}:00`
  );

  const toggleAvailability = (dayIndex: number, hourIndex: number) => {
    const updatedAvailability = [...availability]
    updatedAvailability[dayIndex][hourIndex] =
      !updatedAvailability[dayIndex][hourIndex]
    setAvailability(updatedAvailability)
  }

  const renderTimeSlots = () => {
    const timeSlots: JSX.Element[] = [];

    const dayAbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < numDays; i++) {
      const dayAvailability = availability[i];

      const daySlots = [
        (<div key={`day-${i}-label`} className='day-label'>
          {dayAbr[(startDate.getDay() + i) % 7]}
        </div>)
      ];

      for (let j = startTime; j <= endTime; j++) {
        const available = dayAvailability ? dayAvailability[j] : false;

        daySlots.push(
          <div
            key={`day-${i}-hour-${j}`}
            className={`time-slot ${available ? 'available' : ''}`}
            onClick={() => toggleAvailability(i, j)}
          >
            {timeLabels[j - startTime]} {/* Adjusted index to start from startTime */}
          </div>
        );
      }

      timeSlots.push(
        <div key={`day-${i}`} className='day'>
          {daySlots}
        </div>
      );
    }

    return timeSlots;
  };

  return <div className='time-selector'>{renderTimeSlots()}</div>
}

export default TimeSelector
