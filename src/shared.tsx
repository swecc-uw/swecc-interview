import styled from 'styled-components'

export const HeaderTitle = styled.h1`
  width: 100%;
  margin-bottom: 5em;
  font-size: 2em;
`

export const PageContainer = styled.div`
  width: 85%;
  margin: 0 auto;
  margin-top: 5em;
`

export const LinkButton = styled.button`
  background: none;
  border: none;
  color: rgb(162, 254, 168);
  cursor: pointer;
  padding: 0;
`

export const TextCard = styled.div<{ width: string }>`
  font-size: 1.5em;
  width: ${(props) => props.width};
  padding: 1em;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 100%;
  }
`