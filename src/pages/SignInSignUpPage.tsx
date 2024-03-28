import styled from 'styled-components'
import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'

const LinkButton = styled.button`
  background: none;
  border: none;
  color: rgb(162, 254, 168);
  cursor: pointer;
  padding: 0;
`

interface SignInProps {
  setSignedIn: (signedIn: boolean) => void
  setSigninOrSignup: (signinOrSignup: string) => void
  signinOrSignup: string
}

export default function SignInSignUpPage ({
  setSignedIn,
  setSigninOrSignup,
  signinOrSignup
}: SignInProps) {
  return (
    <div>
      <h2>
        <LinkButton onClick={() => setSigninOrSignup('signin')}>
          Sign In
        </LinkButton>{' '}
        or{' '}
        <LinkButton id='signup' onClick={() => setSigninOrSignup('signup')}>
          Sign Up
        </LinkButton>{' '}
        to get started
      </h2>
      {signinOrSignup === 'signin' ? (
        <SignIn setSignedIn={setSignedIn} />
      ) : (
        <SignUp setSignedIn={setSignedIn} />
      )}
    </div>
  )
}
