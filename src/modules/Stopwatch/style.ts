import styled from "styled-components";

const Contianer = styled.div`
`;

const TimeContainer = styled.div`
  font-size: 7rem;
  text-align: center;
  margin: 70px 0px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;

  margin: ${({ theme }) => theme.spacing(1)}px;

  & > * {
    margin: ${({ theme }) => theme.spacing(1)}px;
  }
`;

const StateLabel = styled.div`
  text-align: center;
  margin: ${({ theme }) => theme.spacing(3)}px;
`;

const Laps = styled.div`
  max-width: 200px;
  margin: auto;
  height: 90px;
  overflow: auto;
`;

const Lap = styled.div`
`;

export { Contianer, TimeContainer, ButtonGroup, StateLabel, Laps, Lap };
