import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { getNextMonday } from './utils/time'
import { supabase } from './utils/supabaseClient'
import { getUser } from './services/user'
import { UserData } from './types'
import { getActiveInterviewFormID } from './services/signup'

import Availability from './components/Availability'
import Welcome from './components/Welcome'
import Confirmation from './components/Confirmation'
import UpdateAccount from './components/UpdateAccount'
import ViewPairs from './components/ViewPairs'
import NavBar from './components/NavBar'
import SignInSignUpPage from './pages/SignInSignUpPage'

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

const WarningContainer = styled.div`
  margin-top: 20px;
`

const WarningHeader = styled.h2`
  color: red;
`

const WarningMessage = styled.p`
  color: red;
`

function App () {
  // const states = ['login', 'form', 'account', 'pairs']

  const [step, setStep] = useState(0)
  const [signedIn, setSignedIn] = useState(false)
  const [signinOrSignup, setSigninOrSignup] = useState('signin')
  const [viewing, setViewing] = useState('login')
  const [loading, setLoading] = useState(true)
  const [activeFormId, setActiveFormId] = useState<number | null>(null)
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
      const fid = await getActiveInterviewFormID()

      setActiveFormId(fid)
    }

    fetchUser().then(() => setLoading(false))
    fetchActiveFormId()
  }, [])

  useEffect(() => {
    if (signedIn) {
      const fetchUser = async () => {
        setLoading(true)
        const userData = await getUser()
        user.current = userData
      }

      fetchUser()
        .then(() => setViewing('form'))
        .then(() => setLoading(false))
        .then(() => setStep(0))
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
    let avail: string | null = null
    if (uid) avail = localStorage.getItem(`availability-${uid}`)

    localStorage.clear()
    if (uid && avail) localStorage.setItem(`availability-${uid}`, avail)

    await supabase.auth.signOut()
    setSignedIn(false)
    user.current = null
  }

  const MIFormContainer = () =>
    user.current?.user_id && (
      <FormContainer>
        {step === 0 && <Welcome nextStep={nextStep} />}
        {step === 1 && (
          <Availability
            nextStep={nextStep}
            prevStep={prevStep}
            uid={user.current?.user_id}
          />
        )}
        {step === 2 && (
          <Confirmation prevStep={prevStep} uid={user.current.user_id} />
        )}
      </FormContainer>
    )

  if (loading) {
    return <></>
  }

  const Content = () => {
    switch (viewing) {
      case 'login':
        return (
          <SignInSignUpPage
            setSignedIn={setSignedIn}
            setSigninOrSignup={setSigninOrSignup}
            signinOrSignup={signinOrSignup}
          />
        )
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
        return (
          <SignInSignUpPage
            setSignedIn={setSignedIn}
            setSigninOrSignup={setSigninOrSignup}
            signinOrSignup={signinOrSignup}
          />
        )
    }
  }

  return (
    <RootContainer>
      <NavBar
        signedIn={signedIn}
        viewing={viewing}
        setViewing={setViewing}
        signOut={signOut}
      />
      <HeaderTitle>
        <h1>Mock Interview Sign Up</h1>
        <i>{getNextMonday(new Date()).toDateString()}</i>
      </HeaderTitle>
      <Card>
        {signedIn ? (
          <Content />
        ) : (
          <SignInSignUpPage
            setSignedIn={setSignedIn}
            setSigninOrSignup={setSigninOrSignup}
            signinOrSignup={signinOrSignup}
          />
        )}
      </Card>
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
