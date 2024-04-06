import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import {HeaderTitle, LinkButton, PageContainer} from '../shared';

type SignInSignUpProps = {
	setSignedIn: (signedIn: boolean) => void;
	setSigninOrSignup: (signinOrSignup: string) => void;
	signinOrSignup: string;
};

export default function SignInSignUpPage({
	setSignedIn,
	setSigninOrSignup,
	signinOrSignup,
}: SignInSignUpProps) {
	return (
		<PageContainer>
			<HeaderTitle>
				<LinkButton onClick={() => {
					setSigninOrSignup('signin'); 
				}}>
          Sign In
				</LinkButton>{' '}
        or{' '}
				<LinkButton id='signup' onClick={() => {
					setSigninOrSignup('signup'); 
				}}>
          Sign Up
				</LinkButton>{' '}
        to get started
			</HeaderTitle>
			{signinOrSignup === 'signin' ? (
				<SignIn setSignedIn={setSignedIn} />
			) : (
				<SignUp setSignedIn={setSignedIn} />
			)}
		</PageContainer>
	);
}
