import React, { useEffect, useState } from 'react';
import TimeSelector from '../TimeSelector/TimeSelector';
import { hntotime, timetohn, getNextMonday } from '../../utils/time';

function Availability() {

  const [startTime, setStartTime] = useState(7);
  const [endTime, setEndTime] = useState(17);
  const [availability, setAvailability] = useState<boolean[][]>([]);

  const numDays = 7;
  const today = new Date();
  const nextMonday = getNextMonday(today);

  useEffect(() => {
    const availabilityString = localStorage.getItem('availability');
    if (availabilityString)
      setAvailability(JSON.parse(availabilityString)
        .map((day: number[]) =>
          day.map(hour => hour === 1)
      ));
    else
      setAvailability(Array.from(
        { length: numDays }, () =>
          Array(24).fill(false)
      ));
  }
  , []);

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const t: string = e.target.value;
    setStartTime(timetohn(t));
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const t: string = e.target.value;
    setEndTime(timetohn(t));
  };

  const handleSave = () => {
    localStorage.setItem('availability', JSON.stringify(
      availability.map(day => day.map(hour => hour ? 1 : 0))));
  }

  const Options = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i); // Array containing numbers from 0 to 23

    return (
      <div className="options">
        <label>
          Start Time:
          <select value={hntotime(startTime)} onChange={handleStartTimeChange}>
            {hours.map(hour => (
              <option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>
            ))}
          </select>
        </label>
        <br/>
        <label>
          End Time:
          <select value={hntotime(endTime)} onChange={handleEndTimeChange}>
            {hours.map(hour => (
              <option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>
            ))}
          </select>
        </label>
      </div>
    );
  };

  return (
    <>
      <h2>Enter Availability</h2>
      <Options />
      <TimeSelector
        startDate={nextMonday}
        numDays={numDays}
        startTime={startTime}
        endTime={endTime}
        availability={availability}
        setAvailability={setAvailability}
      />
      <button onClick={handleSave}>Save</button>
    </>
  );
}

export default Availability;
