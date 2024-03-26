import { useState } from 'react'
import styled from 'styled-components'
import { submitSignup } from '../services/signup'
import { getNextMonday } from '../utils/time'
import { FormEndProps } from '../types'

// Styled components
const ConfirmationContainer = styled.div`
  text-align: center;
`

const SharedButton = styled.button`
  margin-top: 20px;
  min-width: 150px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`

const ConfirmationMessage = styled.p`
  margin: 20px 30%;
`

const ButtonsContainer = styled.div``


const readAvailabilityFromLocalStorage = (uid: string): boolean[][] => {
  return JSON.parse(localStorage.getItem(`availability-${uid}`) || '[]')
}

interface ConirmationProps extends FormEndProps {
  uid: string
}

// Confirmation component
function Confirmation ({ prevStep, uid }: ConirmationProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const availability: boolean[][] = readAvailabilityFromLocalStorage(uid);

  const handleSubmit = async () => {
    setLoading(true)

    if (availability.length != 7 || availability[0].length != 24)
      return setError('Availability not set')

    const res = await submitSignup(uid, availability)
    if (!res) {
      setError('An error occurred. Please try again later.')
      setLoading(false)
      return
    }

    const nextMonday = getNextMonday(new Date())

    localStorage.setItem(
      `lastSignup-${uid}`,
      JSON.stringify({
        date: nextMonday.toDateString(),
        dateForWeekOf: nextMonday.toDateString()
      })
    )

    setSuccess('Successfully signed up!')

    setLoading(false)
  }


  return (
    <ConfirmationContainer>
      <ConfirmationMessage>
        Are you sure you want to interview next week? Submitting this form is
        agreeing to participate, and you will be expected to be available for
        your assigned partner.
      </ConfirmationMessage>
      <SharedButton onClick={handleSubmit}>
        {loading ? 'Loading...' : 'Submit'}
      </SharedButton>
      <ButtonsContainer>
        <SharedButton onClick={prevStep}>Previous</SharedButton>
      </ButtonsContainer>
      {success && <p>{success}</p>}
      {error && <p>{error}</p>}
    </ConfirmationContainer>
  )
}

export default Confirmation
