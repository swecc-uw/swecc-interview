import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Availability from './components/Availability'
import SignUp from './components/SignUp'
import Welcome from './components/Welcome'
import Confirmation from './components/Confirmation'
import { getNextMonday } from './utils/time'
import { supabase } from './utils/supabaseClient'
import SignIn from './components/SignIn'
import UpdateAccount from './components/UpdateAccount'
import { getUser } from './services/user'

const RootContainer = styled.div`
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`

const HeaderTitle = styled.header`
  width: 100%;
  margin-bottom: 5em;
`

const Card = styled.div`
  padding: 2em;
`

const FormContainer = styled.div`
  width: 85%;
  margin: 0 auto;
`

const LinkButton = styled.button`
  background: none;
  border: none;
  color: rgb(162, 254, 168);
  cursor: pointer;
  padding: 0;
`

const WarningContainer = styled.div`
  margin-top: 20px;
`

const WarningHeader = styled.h2`
  color: red;
`

const WarningMessage = styled.p`
  color: red;
`

const TopBannerContainer = styled.div`
  position: fixed;
  top: 0;
  padding: 10px;
`

const UpdateAccountButton = styled.button`
  style: none;
  background: none;
`

const SignOutButton = styled.button`
  style: none;
  background: none;
`

function App () {
  const [step, setStep] = useState(0)
  const [signedIn, setSignedIn] = useState(false)
  const [signinOrSignup, setSigninOrSignup] = useState('signin')
  const [updateAccountShowing, setUpdateAccountShowing] = useState(false)
  const [loading, setLoading] = useState(true)
  const user = useRef({})

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (error) {
        // console.error(error);
        return
      }

      if (!(data && data.user)) {
        console.error('No user data found')
        return
      }

      const userData = await getUser()
      user.current = userData
      setSignedIn(true)
    }

    fetchUser().then(() => setLoading(false))
  })

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setSignedIn(false)
  }

  const MIFormContainer = () => (
    <FormContainer>
      {step === 0 && <Welcome nextStep={nextStep} />}
      {step === 1 && <Availability nextStep={nextStep} prevStep={prevStep} />}
      {step === 2 && <Confirmation prevStep={prevStep} userData={user.current} />}
    </FormContainer>
  )

  const SigninContainer = () => (
    <div>
      <h2>
        <LinkButton onClick={() => setSigninOrSignup('signin')}>
          Sign In
        </LinkButton>{' '}
        or{' '}
        <LinkButton onClick={() => setSigninOrSignup('signup')}>
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

  if (loading) {
    return <></>
  }

  return (
    <RootContainer>
      <TopBannerContainer>
        {signedIn && (
          <UpdateAccountButton
            onClick={() => setUpdateAccountShowing(!updateAccountShowing)}
          >
            {updateAccountShowing ? 'Home' : 'Update Account'}
          </UpdateAccountButton>
        )}
        {signedIn && <SignOutButton onClick={signOut}>Sign Out</SignOutButton>}
      </TopBannerContainer>
      <HeaderTitle>
        <h1>
          Mock Interview Sign Up
        </h1>
        <i>{getNextMonday(new Date()).toDateString()}</i>
      </HeaderTitle>
      {signedIn ? (
        <>
          {updateAccountShowing ? (
            <UpdateAccount
              userRef={user}
              hide={() => setUpdateAccountShowing(false)}
            />
          ) : (
            <MIFormContainer />
          )}
        </>
      ) : (
        <Card>
          <SigninContainer />
        </Card>
      )}
    </RootContainer>
  )
}

export default App

// @ts-ignore
const renderWarning = (lastSignup: any) => {
  if (!lastSignup) return null

  const nextMonday = getNextMonday(new Date())
  const lastSignupDateForWeekOf = new Date(lastSignup.dateForWeekOf)

  if (nextMonday.getDate() !== lastSignupDateForWeekOf.getDate()) return null

  return (
    <WarningContainer>
      <WarningHeader>Warning</WarningHeader>
      <WarningMessage>
        You have already signed up for a mock interview for this week. If you
        sign up again, your previous sign up will be overwritten.
      </WarningMessage>
    </WarningContainer>
  )
}
