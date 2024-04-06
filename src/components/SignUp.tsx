import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import styled from 'styled-components'

const SignUpContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
`

const SignUpForm = styled.form`
  display: flex;
  flex-direction: column;
`

const InputField = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`

const SubmitButton = styled.button`
  padding: 10px;
  border-radius: 5px;
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #333;
  }
`

const ErrorMessage = styled.p`
  color: red;
`

interface SignUpProps {
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
      if (user === null)
        return console.error(
          'User is null after sign up. This should not happen.'
        )

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
    <SignUpContainer>
      <SignUpForm onSubmit={handleSignUp}>
        <InputField
          id='first-name'
          type='text'
          placeholder='First Name'
          value={firstName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFirstName(e.target.value)
          }
        />
        <InputField
          id='last-name'
          type='text'
          placeholder='Last Name'
          value={lastName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLastName(e.target.value)
          }
        />
        <InputField
          id='discord'
          type='text'
          placeholder='Discord Username'
          value={discord}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDiscord(e.target.value)
          }
        />
        <InputField
          id='grad-year'
          type='number'
          placeholder='Graduation Year'
          value={gradYear}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setGradYear(parseInt(e.target.value))
          }
        />
        <InputField
          id='major'
          type='text'
          placeholder='Major'
          value={major}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMajor(e.target.value)
          }
        />
        <InputField
          id='email'
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
        <InputField
          id='password'
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        <SubmitButton id='create-account-btn' type='submit' disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </SubmitButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </SignUpForm>
    </SignUpContainer>
  )
}

export default SignUp
