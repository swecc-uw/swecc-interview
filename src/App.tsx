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
import ViewPairs from './components/ViewPairs'
import { UserData } from './types'

const RootContainer = styled.div`
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  margin-top: 40px;
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
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
  backdrop-filter: blur(5px);
`

const NavButton = styled.button`
  style: none;
  background: none;
  @media (max-width: 600px) {
    margin-bottom: 10px;
    font-size: 0.8em;
  }
`

function App () {
  // const states = ['login', 'form', 'account', 'pairs']

  const [step, setStep] = useState(0)
  const [signedIn, setSignedIn] = useState(false)
  const [signinOrSignup, setSigninOrSignup] = useState('signin')
  const [viewing, setViewing] = useState('login')
  const [loading, setLoading] = useState(true)
  const [activeFormId, setActiveFormId] = useState<string | null>(null)
  const user = useRef<UserData | null>()

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
      setViewing('form')
    }

    const fetchActiveFormId = async () => {
      const { data, error } = await supabase
        .from('forms')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) {
        console.error(error)
        return
      }

      if (data.length === 0) {
        console.error('no active form found')
        return
      }

      setActiveFormId(String(data[0].id))
    }

    fetchUser().then(() => setLoading(false))
    fetchActiveFormId()
  }, [])

  useEffect(() => {
    if (signedIn) {
      const fetchUser = async () => {
        const userData = await getUser()
        user.current = userData
      }

      fetchUser().then(() => setViewing('form'))
    }
  }, [signedIn])

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const signOut = async () => {
    const uid = user.current?.user_id
    let avail: string | null = null;
    if (uid)
      avail = localStorage.getItem(`availability-${uid}`)

    localStorage.clear()
    if (uid && avail)
      localStorage.setItem(`availability-${uid}`, avail)

    await supabase.auth.signOut()
    setSignedIn(false)
    user.current = null
  }

  const MIFormContainer = () => (
    <FormContainer>
      {step === 0 && <Welcome nextStep={nextStep} />}
      {step === 1 && <Availability nextStep={nextStep} prevStep={prevStep} uid={user.current?.user_id} />}
      {step === 2 && (
        <Confirmation prevStep={prevStep} userData={user.current} />
      )}
    </FormContainer>
  )

  const SigninContainer = () => (
    <div>
      <h2>
        <LinkButton onClick={() => setSigninOrSignup('signin')}>
          Sign In
        </LinkButton>{' '}
        or{' '}
        <LinkButton id="signup" onClick={() => setSigninOrSignup('signup')}>
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

  const Content = () => {
    switch (viewing) {
      case 'login':
        return <SigninContainer />
      case 'form':
        return <MIFormContainer />
      case 'account':
        return <UpdateAccount userRef={user} hide={() => setViewing('form')} />
      case 'pairs':
        return (
          <ViewPairs
            uuid={user?.current?.user_id}
            active_formid={activeFormId}
          />
        )
      default:
        return <SigninContainer />
    }
  }

  return (
    <RootContainer>
      <TopBannerContainer>
        {signedIn && (
          <NavButton
            onClick={() =>
              viewing === 'account' ? setViewing('form') : setViewing('account')
            }
          >
            {viewing === 'account' ? 'Back to Form' : 'Update Account'}
          </NavButton>
        )}
        {signedIn && <NavButton onClick={signOut}>Sign Out</NavButton>}
        {signedIn && (
          <NavButton
            onClick={() =>
              viewing === 'pairs' ? setViewing('form') : setViewing('pairs')
            }
          >
            {viewing === 'pairs' ? 'Back to Form' : 'View Pairs'}
          </NavButton>
        )}
      </TopBannerContainer>
      <HeaderTitle>
        <h1>Mock Interview Sign Up</h1>
        <i>{getNextMonday(new Date()).toDateString()}</i>
      </HeaderTitle>
      <Card>{signedIn ? <Content /> : <SigninContainer />}</Card>
      {renderWarning(null)}
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
