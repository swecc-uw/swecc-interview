import styled from 'styled-components'
import { UserData } from '../types'
import Welcome from '../components/Welcome'
import Availability from '../components/Availability'
import Confirmation from '../components/Confirmation'
const FormContainer = styled.div`
  width: 85%;
  margin: 0 auto;
`

interface MIFormPageProps {
  user: React.MutableRefObject<UserData | null>
  step: number
  nextStep: () => void
  prevStep: () => void
}

export default function MISignupFormPage ({
  user,
  step,
  nextStep,
  prevStep
}: MIFormPageProps) {
  return (
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
  )
}
