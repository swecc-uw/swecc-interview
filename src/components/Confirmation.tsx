import { useState } from 'react'
import styled from 'styled-components'
import { submitSignup } from '../services/signup'
import { getNextMonday } from '../utils/time'

// Styled components
const ConfirmationContainer = styled.div`
  text-align: center;
`

const ConfirmationMessage = styled.p`
  margin: 20px 30%;
`

const ButtonsContainer = styled.div``


const readAvailabilityFromLocalStorage = (uid: string): boolean[][] => {
  return JSON.parse(localStorage.getItem(`availability-${uid}`) || '[]')
}

interface ConirmationProps {
  uid: string
}

// Confirmation component
function Confirmation ({ uid }: ConirmationProps) {
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
      <button onClick={handleSubmit}>
        {loading ? 'Loading...' : 'Submit'}
      </button>
      {success && <p>{success}</p>}
      {error && <p>{error}</p>}
    </ConfirmationContainer>
  )
}

export default Confirmation
