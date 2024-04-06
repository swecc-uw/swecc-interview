import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

const NavBarContainer = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  padding: 20px;
  margin-bottom: 20px;
  margin-top: 10px;
  margin-left: 10px;
  width: 100%;
  backdrop-filter: blur(5px);
`

const NavButton = styled(NavLink)`
  style: none;
  background: none;
  text-decoration: none;
  color: inherit;
  font-size: 1.3em;
  cursor: pointer;
  margin-right: 20px;
  @media (max-width: 600px) {
    margin-bottom: 10px;
    font-size: 0.8em;
  }
`

type NavBarProps = {
  signedIn: boolean
  signOut: () => void
}

export default function NavBar ({ signedIn, signOut }: NavBarProps) {
  return (
    <NavBarContainer>
      {signedIn && <NavButton to='/account'>Update Account</NavButton>}
      {signedIn && (
        <NavButton to='/signout' onClick={signOut}>
          Sign Out
        </NavButton>
      )}
      {signedIn && <NavButton to='/pairs'>View Pairs</NavButton>}
      {signedIn && <NavButton to='/form'>Interview Signup</NavButton>}
    </NavBarContainer>
  )
}
