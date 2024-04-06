const hntotime = (h: number): string => `${h}:00`;

const timetohn = (t: string): number => parseInt(t.split(':')[0]);

const getNextMonday = (today: Date): Date => {
	const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
	const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek; // Calculate days until next Monday
	const nextMonday = new Date(today); // Create a copy of today's date
	nextMonday.setDate(today.getDate() + daysUntilMonday); // Add days until Monday
	return nextMonday;
};

export {hntotime, timetohn, getNextMonday};
