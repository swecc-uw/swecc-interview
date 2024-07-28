// src/context/MemberContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect
} from 'react'
import { Member } from '../types'
import { getMemberProfile, getCurrentUser } from '../services/mock/member'
interface MemberContextProps {
  member: Member | null
  setMember: React.Dispatch<React.SetStateAction<Member | null>>
}

const MemberContext = createContext<MemberContextProps | undefined>(undefined)

export const MemberProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [member, setMember] = useState<Member | null>(null)

  useEffect(() => {
    getCurrentUser().then(user => {
      getMemberProfile(user.id).then(profile => {
        setMember(profile)
      })
    })
  }, [])

  return (
    <MemberContext.Provider value={{ member, setMember }}>
      {children}
    </MemberContext.Provider>
  )
}

export const useMember = () => {
  const context = useContext(MemberContext)
  if (!context) {
    throw new Error('useMember must be used within a MemberProvider')
  }
  return context
}
