import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { getNextMonday } from './utils/time'
import { supabase } from './utils/supabaseClient'
import { getUser } from './services/user'
import { UserData } from './types'
import { getActiveInterviewFormID } from './services/signup'
import UpdateAccountPage from './pages/UpdateAccountPage'
import ViewPairs from './components/ViewPairs'
import NavBar from './components/NavBar'
import SignInSignUpPage from './pages/SignInSignUpPage'
import MISignupFormPage from './pages/MISignupFormPage'
import { Route, Routes, useNavigate } from 'react-router-dom'

const RootContainer = styled.div`
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`

function App () {
  const [step, setStep] = useState(0)
  const [signedIn, setSignedIn] = useState(false)
  const [signinOrSignup, setSigninOrSignup] = useState('signin')
  const [loading, setLoading] = useState(true)
  const [activeFormId, setActiveFormId] = useState<number | null>(null)
  const user = useRef<UserData | null>(null)

  const navigate = useNavigate()

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
        .then(() => navigate('/form'))
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

  if (loading) {
    return <></>
  }

  return (
    <RootContainer>
      <NavBar signedIn={signedIn} signOut={signOut} />
      <Routes>
        <Route
          path='/login'
          element={
            <SignInSignUpPage
              setSignedIn={setSignedIn}
              setSigninOrSignup={setSigninOrSignup}
              signinOrSignup={signinOrSignup}
            />
          }
        />
        <Route
          path='/form'
          element={
            <MISignupFormPage
              user={user}
              step={step}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          }
        />
        <Route
          path='/account'
          element={
            <UpdateAccountPage user={user} hide={() => navigate('/form')} />
          }
        />
        <Route
          path='/pairs'
          element={
            <ViewPairs
              uuid={user?.current?.user_id}
              active_formid={activeFormId}
            />
          }
        />
        <Route
          path='*'
          element={
            <SignInSignUpPage
              setSignedIn={setSignedIn}
              setSigninOrSignup={setSigninOrSignup}
              signinOrSignup={signinOrSignup}
            />
          }
        />
      </Routes>
    </RootContainer>
  )
}

export default App
