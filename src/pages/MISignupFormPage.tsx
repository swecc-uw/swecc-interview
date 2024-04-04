import { UserData } from '../types'
import Welcome from '../components/Welcome'
import Availability from '../components/Availability'
import Confirmation from '../components/Confirmation'
import { HeaderTitle, PageContainer } from '../shared'
import styled from 'styled-components'

interface MIFormPageProps {
  user: React.MutableRefObject<UserData | null>
  step: number
  nextStep: () => void
  prevStep: () => void
}

const ControlButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 5%;
  margin: 0 auto;
`

export default function MISignupFormPage ({
  user,
  step,
  nextStep,
  prevStep
}: MIFormPageProps) {
  const FormControl = () => {
    return (
      <ControlButtonContainer>
        { step > 0 && <button onClick={prevStep}>Back</button> }
        { step < 2 && <button onClick={nextStep}>Next</button> }
      </ControlButtonContainer>
    )
  }

  return (
    user.current?.user_id && (
      <PageContainer>
        <HeaderTitle>Mock Interview Sign Up</HeaderTitle>
        {step === 0 && <Welcome />}
        {step === 1 && (
          <Availability
            uid={user.current?.user_id}
          />
        )}
        {step === 2 && (
          <Confirmation uid={user.current.user_id} />
        )}
        <FormControl />
      </PageContainer>
    )
  )
}
