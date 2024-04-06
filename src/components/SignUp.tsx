import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import {
  TextInput,
  Button,
  HorizontallyCenteredContainer,
  ErrorMessage
} from '../shared'

type SignUpProps = {
  setSignedIn: any
}

const SignUp = ({ setSignedIn }: SignUpProps) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [discord, setDiscord] = useState('')
  const [gradYear, setGradYear] = useState(2025)
  const [major, setMajor] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignUp = async (event: any) => {
    event.preventDefault()

    setLoading(true)
    const { error, data } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      console.error(error)
      setError(JSON.stringify(error))
    } else {
      const user = data?.user
      if (user === null) {
        console.error('User is null after sign up. This should not happen.')
        return
      }

      const { error } = await supabase.from('users').insert({
        user_id: user.id,
        email,
        major,
        discord,
        first_name: firstName,
        last_name: lastName,
        grad_year: gradYear
      })

      if (error) {
        console.error(error)
        setError(JSON.stringify(error))
      }

      setSignedIn(true)
      setLoading(false)
    }
  }

  return (
    <HorizontallyCenteredContainer width='40%'>
      <form onSubmit={handleSignUp}>
        <TextInput
          id='first-name'
          type='text'
          placeholder='First Name'
          value={firstName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFirstName(e.target.value)
          }}
        />
        <TextInput
          id='last-name'
          type='text'
          placeholder='Last Name'
          value={lastName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setLastName(e.target.value)
          }}
        />
        <TextInput
          id='discord'
          type='text'
          placeholder='Discord Username'
          value={discord}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setDiscord(e.target.value)
          }}
        />
        <TextInput
          id='grad-year'
          type='number'
          placeholder='Graduation Year'
          value={gradYear}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setGradYear(parseInt(e.target.value))
          }}
        />
        <TextInput
          id='major'
          type='text'
          placeholder='Major'
          value={major}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setMajor(e.target.value)
          }}
        />
        <TextInput
          id='email'
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value)
          }}
        />
        <TextInput
          id='password'
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value)
          }}
        />
        <Button id='create-account-btn' type='submit' disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </form>
    </HorizontallyCenteredContainer>
  )
}

export default SignUp
