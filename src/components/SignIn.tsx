import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'

import {
  TextInput,
  Button,
  HorizontallyCenteredContainer,
  ErrorMessage
} from '../shared'

type SignInProps = {
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
    <HorizontallyCenteredContainer width='40%'>
      <form onSubmit={handleLogin}>
        <TextInput
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e: any) => {
            setEmail(e.target.value)
          }}
        />
        <TextInput
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e: any) => {
            setPassword(e.target.value)
          }}
        />
        <Button type='submit' disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </form>
    </HorizontallyCenteredContainer>
  )
}

export default SignIn
