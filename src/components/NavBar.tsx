import styled from 'styled-components'

const NavBarContainer = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
  backdrop-filter: blur(5px);
`

const NavButton = styled.button`
  style: none;
  background: none;
  @media (max-width: 600px) {
    margin-bottom: 10px;
    font-size: 0.8em;
  }
`

interface NavBarProps {
  signedIn: boolean
  viewing: string
  setViewing: (view: string) => void
  signOut: () => void
}

export default function NavBar ({
  signedIn,
  viewing,
  setViewing,
  signOut
}: NavBarProps) {

  return (
    <NavBarContainer>
      {signedIn && (
        <NavButton
          onClick={() =>
            viewing === 'account' ? setViewing('form') : setViewing('account')
          }
        >
          {viewing === 'account' ? 'Back to Form' : 'Update Account'}
        </NavButton>
      )}
      {signedIn && <NavButton onClick={signOut}>Sign Out</NavButton>}
      {signedIn && (
        <NavButton
          onClick={() =>
            viewing === 'pairs' ? setViewing('form') : setViewing('pairs')
          }
        >
          {viewing === 'pairs' ? 'Back to Form' : 'View Pairs'}
        </NavButton>
      )}
    </NavBarContainer>
  )
}
