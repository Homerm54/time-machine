import styled from "styled-components";

const Contianer = styled.div`
`;

const TimeContainer = styled.div<{ $overtime?: boolean }>`
  font-size: 7rem;
  text-align: center;
  margin: 70px 0px;
  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ $overtime, theme }) => $overtime ? theme.palette.error.main : 'inherit'};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;

  margin: ${({ theme }) => theme.spacing(1)}px;

  & > * {
    margin: ${({ theme }) => theme.spacing(1)}px;
  }
`;

const Input = styled.input`
  font-size: inherit;
  color: inherit;
  text-align: center;
  cursor: text;
  background-color: transparent;
  margin: 0;
  border-width: 0;
  border-style: none;
  border-color: transparent;
  border-image: none;
  
  width: 200px;

  cursor: ${({ disabled }) => disabled ? 'inherit' : 'text'};

  ::placeholder {
    color: ${({ theme, disabled }) => (
      disabled
        ? theme.palette.action.disabled
        : `${theme.palette.grey[400]}40` // % of opacity
    )};
  }
`;

const StateLabel = styled.div`
  text-align: center;
  margin: ${({ theme }) => theme.spacing(3)}px;
`;

export { Contianer, TimeContainer, ButtonGroup, Input, StateLabel };
