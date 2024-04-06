import { useState, ChangeEvent, FormEvent } from 'react'
import { supabase } from '../utils/supabaseClient'
import { Button } from '../shared'
import styled from 'styled-components'
import { TextInput, HorizontallyCenteredContainer } from '../shared'

interface UpdateSecureDataProps {
  type: 'password' | 'email'
  setError: (error: string) => void
  setLoading: (loading: boolean) => void
  loading: boolean
}

const UpdateSecureData = ({
  type,
  setError,
  setLoading,
  loading
}: UpdateSecureDataProps) => {
  const [newVal, setNewVal] = useState<string>('')
  const [confirmVal, setConfirmVal] = useState<string>('')

  const handleUpdateSecureData = async (event: FormEvent) => {
    event.preventDefault()

    if (newVal !== confirmVal) {
      setError('New value and confirmation must match.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({
      [type]: newVal
    })

    if (error) {
      setError(error.message)
    } else {
      setError('')
    }

    setLoading(false)
  }

  return (
    <HorizontallyCenteredContainer width='50%'>
      <form onSubmit={handleUpdateSecureData}>
        <TextInput
          type={type}
          placeholder={`New ${type}`}
          value={newVal}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewVal(e.target.value)
          }
        />
        <TextInput
          type={type}
          placeholder={`Confirm new ${type}`}
          value={confirmVal}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setConfirmVal(e.target.value)
          }
        />
        <Button type='submit'>{loading ? 'Loading...' : 'Update'}</Button>
      </form>
    </HorizontallyCenteredContainer>
  )
}

interface UpdateAccountSectionProps {
  hide: () => void
  userRef: any
  setError: (error: string) => void
  setLoading: (loading: boolean) => void
  loading: boolean
}

const UpdateAccountData = ({
  hide,
  userRef,
  setError,
  setLoading,
  loading
}: UpdateAccountSectionProps) => {
  const [firstName, setFirstName] = useState<string>(
    userRef.current?.first_name
  )
  const [lastName, setLastName] = useState<string>(userRef.current?.last_name)
  const [discord, setDiscord] = useState<string>(userRef.current?.discord)
  const [gradYear, setGradYear] = useState<number>(userRef.current?.grad_year)
  const [major, setMajor] = useState<string>(userRef.current?.major)

  if (!userRef.current) return null
  const handleUpdateAccount = async (event: FormEvent) => {
    event.preventDefault()
    const vals = {
      major,
      first_name: firstName,
      last_name: lastName,
      grad_year: gradYear,
      discord: discord
    }

    const { error } = await supabase
      .from('users')
      .update(vals)
      .eq('user_id', userRef.current.user_id)

    if (error) {
      console.error(error)
      setError('An error occurred. Please try again later.')
      setLoading(false)
      return
    }

    alert('Account updated successfully!')
    hide()
  }

  return (
    <HorizontallyCenteredContainer width='50%'>
      <form onSubmit={handleUpdateAccount}>
        <TextInput
          type='text'
          placeholder='First Name'
          value={firstName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFirstName(e.target.value)
          }
        />
        <TextInput
          type='text'
          placeholder='Last Name'
          value={lastName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setLastName(e.target.value)
          }
        />
        <TextInput
          type='text'
          placeholder='Discord Username'
          value={discord}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setDiscord(e.target.value)
          }
        />
        <TextInput
          type='number'
          placeholder='Graduation Year'
          value={gradYear}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setGradYear(parseInt(e.target.value))
          }
        />
        <TextInput
          type='text'
          placeholder='Major'
          value={major}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setMajor(e.target.value)
          }
        />
        <Button type='submit' disabled={loading}>
          {loading ? 'Loading...' : 'Update'}
        </Button>
      </form>
    </HorizontallyCenteredContainer>
  )
}

interface UpdateAccountProps {
  hide: () => void
  userRef: any
  updating: 'account' | 'password' | 'email'
}

const UpdateAccount = ({ hide, userRef, updating }: UpdateAccountProps) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  console.log(updating)
  return (
    <div>
      {updating === 'account' && (
        <UpdateAccountData
          hide={hide}
          userRef={userRef}
          setError={setError}
          setLoading={setLoading}
          loading={loading}
        />
      )}
      {updating === 'password' && (
        <UpdateSecureData
          setError={setError}
          setLoading={setLoading}
          type='password'
          loading={loading}
        />
      )}
      {updating === 'email' && (
        <UpdateSecureData
          setError={setError}
          setLoading={setLoading}
          type='email'
          loading={loading}
        />
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  )
}

const ErrorMessage = styled.p`
  color: red;
`

export default UpdateAccount
