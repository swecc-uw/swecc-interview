import {useState} from 'react';
import {submitSignup} from '../services/signup';
import {getNextMonday} from '../utils/time';
import {TextCard, Button} from '../shared';

const readAvailabilityFromLocalStorage = (uid: string): boolean[][] => {
	return JSON.parse(localStorage.getItem(`availability-${uid}`) || '[]');
};

type ConirmationProps = {
	uid: string;
};

// Confirmation component
function Confirmation({uid}: ConirmationProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const availability: boolean[][] = readAvailabilityFromLocalStorage(uid);

	const handleSubmit = async () => {
		setLoading(true);

		if (availability.length != 7 || availability[0].length != 24) {
			setError('Availability not set'); return; 
		}

		const res = await submitSignup(uid, availability);
		if (!res) {
			setError('An error occurred. Please try again later.');
			setLoading(false);
			return;
		}

		const nextMonday = getNextMonday(new Date());

		localStorage.setItem(
			`lastSignup-${uid}`,
			JSON.stringify({
				date: nextMonday.toDateString(),
				dateForWeekOf: nextMonday.toDateString(),
			}),
		);

		setSuccess('Successfully signed up!');

		setLoading(false);
	};

	return (
		<div>
			<TextCard width='50%'>
				<p>
          Are you sure you want to interview next week? Submitting this form is
          agreeing to participate, and you will be expected to be available for
          your assigned partner.
				</p>
			</TextCard>
			<Button onClick={handleSubmit}>
				{loading ? 'Loading...' : 'Submit'}
			</Button>
			{success && <p>{success}</p>}
			{error && <p>{error}</p>}
		</div>
	);
}

export default Confirmation;
