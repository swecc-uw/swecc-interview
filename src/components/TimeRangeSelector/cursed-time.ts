import { getThisUpcomingSunday } from '../../localization';

const getDefaultDayLabels = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const nextSunday = getThisUpcomingSunday();

  return days.map((day, i) => {
    const date = new Date(nextSunday);
    date.setDate(nextSunday.getDate() + i);
    return `${day} ${date.getMonth() + 1}/${date.getDate()}`;
  });
};

export const defaultTimeLabels = Array.from({ length: 48 }, (_, i) => {
  const hour = (Math.floor(i / 2) + 7) % 24;
  const minutes = i % 2 === 0 ? '00' : '30';
  const adjustedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const amPm = hour >= 12 && hour < 24 ? 'PM' : 'AM';
  return `${adjustedHour}:${minutes} ${amPm}`;
});

export const defaultDayLabels = getDefaultDayLabels();
