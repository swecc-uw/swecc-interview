import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import styled from 'styled-components'

const SignInContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
`

const SignInForm = styled.form`
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

interface SignInProps {
  setSignedIn: any
}

const SignIn = ({ setSignedIn }: SignInProps) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (event: any) => {
    event.preventDefault()

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError(error.message)
    } else {
      setSignedIn(true)
    }
    setLoading(false)
  }

  return (
    <SignInContainer>
      <SignInForm onSubmit={handleLogin}>
        <InputField
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
        />
        <InputField
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
        />
        <SubmitButton type='submit' disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </SubmitButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </SignInForm>
    </SignInContainer>
  )
}

export default SignIn
