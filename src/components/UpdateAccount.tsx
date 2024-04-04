import { useState, ChangeEvent, FormEvent } from 'react'
import { supabase } from '../utils/supabaseClient'
import styled from 'styled-components'
import { HeaderTitle } from '../shared'

const UpdateSecureDataContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
`

const UpdateSecureDataForm = styled.form`
  display: flex;
  flex-direction: column;
`

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
    <UpdateSecureDataContainer>
      <UpdateSecureDataForm onSubmit={handleUpdateSecureData}>
        <InputField
          type={type}
          placeholder={`New ${type}`}
          value={newVal}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewVal(e.target.value)
          }
        />
        <InputField
          type={type}
          placeholder={`Confirm new ${type}`}
          value={confirmVal}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setConfirmVal(e.target.value)
          }
        />
        <SubmitButton type='submit'>
          {loading ? 'Loading...' : 'Update'}
        </SubmitButton>
      </UpdateSecureDataForm>
    </UpdateSecureDataContainer>
  )
}

const UpdateAccountContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
`

const UpdateAccountForm = styled.form`
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
  const [firstName, setFirstName] = useState<string>(userRef.current?.first_name)
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
      setError("An error occurred. Please try again later.")
      setLoading(false)
      return
    }

    alert('Account updated successfully!')
    hide()
  }

  return (
    <UpdateAccountContainer>
      <UpdateAccountForm onSubmit={handleUpdateAccount}>
        <InputField
          type='text'
          placeholder='First Name'
          value={firstName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFirstName(e.target.value)
          }
        />
        <InputField
          type='text'
          placeholder='Last Name'
          value={lastName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setLastName(e.target.value)
          }
        />
        <InputField
          type='text'
          placeholder='Discord Username'
          value={discord}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setDiscord(e.target.value)
          }
        />
        <InputField
          type='number'
          placeholder='Graduation Year'
          value={gradYear}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setGradYear(parseInt(e.target.value))
          }
        />
        <InputField
          type='text'
          placeholder='Major'
          value={major}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setMajor(e.target.value)
          }
        />
        <SubmitButton type='submit' disabled={loading}>
          {loading ? 'Loading...' : 'Update'}
        </SubmitButton>
      </UpdateAccountForm>
    </UpdateAccountContainer>
  )
}

interface UpdateAccountProps {
  hide: () => void
  userRef: any
}

const UpdateAccount = ({ hide, userRef }: UpdateAccountProps) => {
  const [updating, setUpdating] = useState<'account' | 'password' | 'email'>(
    'account'
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  return (
    <div>
      <HeaderTitle>
        <h1>Update Account</h1>
      </HeaderTitle>
      <Button onClick={() => setUpdating('account')}>Account</Button>
      <Button onClick={() => setUpdating('password')}>Password</Button>
      <Button onClick={() => setUpdating('email')}>Email</Button>
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

const Button = styled.button`
  style: none;
  background: none;
  border: none;
  padding: 10px;
  margin-bottom: 10%;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #333;
  }
`

export default UpdateAccount
