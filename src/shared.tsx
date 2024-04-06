import styled from 'styled-components';

const colors = {
	clickable: 'rgb(162, 254, 168)',
	clickableHover: 'rgb(162, 254, 168, 0.8)',
	background: 'black',
	text: 'white',
};

export const HeaderTitle = styled.h1`
  width: 100%;
  margin-bottom: 5em;
  font-size: 2em;
`;

export const PageContainer = styled.div`
  width: 85%;
  margin: 0 auto;
  margin-top: 5em;
`;

export const LinkButton = styled.button`
  background: none;
  border: none;
  color: ${colors.clickable};
  cursor: pointer;
  padding: 0;
`;

export const DropdownText = styled.select`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
  color: ${colors.clickable};
  font-family: inherit;
  font-weight: inherit;
  font-style: inherit;
  margin: 0;
  appearance:
  transition: color 0.3s;

  &:hover {
    color: ${colors.clickableHover};
  }

  &:focus {
    outline: none;
  }
`;

export const Button = styled.button`
  background: ${colors.clickable};
  border-radius: 2px;
  border: 1px solid transparent;
  color: black;
  padding: 0.5em 1em;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: ${colors.clickableHover};
  }
`;

export const TextInput = styled.input`
  width: 100%;
  padding: 0.5em;
  margin: 0.5em 0;
  font-size: 1em;
  border: none;
  border-radius: 1px;
`;

export const HorizontallyCenteredContainer = styled.div<{width: string}>`
  width: ${props => props.width};
  margin: 0 auto;
`;

export const HorizontallyCenteredInlineContainer = styled.div<{
	width: string;
	gap: string;
}>`
  width: ${props => props.width};
  gap: ${props => props.gap};
  display: flex;
  justify-content: center;
  margin: 0 auto;
`;

export const TextCard = styled.div<{width: string}>`
  font-size: 1.5em;
  width: ${props => props.width};
  padding: 1em;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 100%;
  }
`;
