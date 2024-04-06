import { useState } from 'react'
import { HeaderTitle, PageContainer, DropdownText } from '../shared'
import UpdateAccount from '../components/UpdateAccount'
import { type UserData } from '../types'

type UpdateAccountPageProps = {
  user: React.MutableRefObject<UserData>
  hide: () => void
}

export default function UpdateAccountPage ({
  user,
  hide
}: UpdateAccountPageProps) {
  const [updating, setUpdating] = useState<'account' | 'password' | 'email'>(
    'account'
  )
  return (
    <PageContainer>
      <HeaderTitle>
        Upate &nbsp;
        {
          <DropdownText
            name='update'
            id='update'
            onChange={e => {
              setUpdating(e.target.value as 'account' | 'password' | 'email')
            }}
          >
            <option value='account'>account</option>
            <option value='password'>password</option>
            <option value='email'>email</option>
          </DropdownText>
        }
      </HeaderTitle>
      <UpdateAccount userRef={user} hide={hide} updating={updating} />
    </PageContainer>
  )
}
