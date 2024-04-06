import {type UserData} from '../types';
import Welcome from '../components/Welcome';
import Availability from '../components/Availability';
import Confirmation from '../components/Confirmation';
import {
	Button,
	HeaderTitle,
	PageContainer,
	HorizontallyCenteredInlineContainer,
} from '../shared';
import styled from 'styled-components';

type MIFormPageProps = {
	user: React.MutableRefObject<UserData>;
	step: number;
	nextStep: () => void;
	prevStep: () => void;
};

const ButtonContainer = styled.div`
  margin-top: 1em;
`;

export default function MISignupFormPage({
	user,
	step,
	nextStep,
	prevStep,
}: MIFormPageProps) {
	const FormControl = () => {
		return (
			<ButtonContainer>
				<HorizontallyCenteredInlineContainer width='50%' gap='1em'>
					{step > 0 && <Button onClick={prevStep}>Back</Button>}
					{step < 2 && <Button onClick={nextStep}>Next</Button>}
				</HorizontallyCenteredInlineContainer>
			</ButtonContainer>
		);
	};

	const FormPart = () => {
		if (user.current?.user_id === undefined) return <div>loading...</div>;
		switch (step) {
			case 0:
				return <Welcome />;
			case 1:
				return <Availability uid={user.current?.user_id} />;
			case 2:
				return <Confirmation uid={user.current?.user_id} />;
			default:
				return <Welcome />;
		}
	};

	return (
		user.current?.user_id && (
			<PageContainer>
				<HeaderTitle>Mock Interview Sign Up</HeaderTitle>
				<FormPart />
				<FormControl />
			</PageContainer>
		)
	);
}
