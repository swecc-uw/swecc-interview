import {TextCard} from '../shared';
import {getNextMonday} from '../utils/time';

function Welcome() {
	return (
		<TextCard width={'50%'}>
			<p>
        Click the button below to start the sign up process. Keep in mind that
        you will be signing up for the week of{' '}
				{getNextMonday(new Date()).toDateString()}.
			</p>
		</TextCard>
	);
}

export default Welcome;
