export const devPrint = (...data: any[]): void => {
  if (import.meta.env.DEV) {
    console.log(...data);
  }
};

// day index is the zero based index of the day of the week, relative to the start of the current
// week. time index is the zero based index of the 30 minute interval of the day.
export const availabilityCellToDateTime = (
  dayIndex: number,
  timeIndex: number
): Date => {
  const today = new Date();
  const nextSunday = new Date();
  nextSunday.setDate(today.getDate() + (7 - today.getDay()));
  const date = new Date();
  date.setDate(nextSunday.getDate() + dayIndex);
  date.setHours(Math.floor(timeIndex / 2));
  date.setMinutes((timeIndex % 2) * 30);
  return date;
};

export const getDefaultDayLabels = () => {
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

export const defaultDayLabels = getDefaultDayLabels();
export const defaultTimeLabels = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2) % 24;
  const minutes = i % 2 === 0 ? '00' : '30';
  const adjustedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const amPm = hour >= 12 && hour < 24 ? 'PM' : 'AM';
  return `${adjustedHour}:${minutes} ${amPm}`;
});

export function getMinAndMaxTimeIndex(
  availability: boolean[][]
): [number, number] {
  let minAvailableTimeIdx = 47;
  let maxAvailableTimeIdx = 0;

  for (let i = 0; i < availability.length; i++) {
    for (let j = 0; j < availability[i].length; j++) {
      if (availability[i][j]) {
        minAvailableTimeIdx = Math.min(minAvailableTimeIdx, j);
        maxAvailableTimeIdx = Math.max(maxAvailableTimeIdx, j);
      }
    }
  }

  if (minAvailableTimeIdx === 47) minAvailableTimeIdx = 18; // 9:00 AM
  if (maxAvailableTimeIdx === 0) maxAvailableTimeIdx = 33; // 5:00 PM

  return [minAvailableTimeIdx, maxAvailableTimeIdx];
}
