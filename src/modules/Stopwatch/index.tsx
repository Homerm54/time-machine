import { useMachine } from "@xstate/react";
import { Button } from "../../components";
import { stopwatchMachine } from "./machine";
import { ButtonGroup, Contianer, StateLabel, TimeContainer } from "./style";


function StopwatchComponent(): JSX.Element {
  const [state, send] = useMachine(stopwatchMachine);
  
  return (
    <Contianer>
      <TimeContainer>
        {state.context.time.hours} : {state.context.time.minutes} : {state.context.time.seconds}
      </TimeContainer>

      <StateLabel>
        CURRENT STATE: {state.toStrings().slice(-1)}
      </StateLabel>

      <ButtonGroup>
        {
          (state.value === 'IDLE' || state.value === 'PAUSED')
          && <Button size="large" variant="outlined" onClick={() => send('START')}>Start</Button>
        }

        {
          state.value === 'RUNNING'
          && <Button size="large" variant="outlined" onClick={() => send('STOP')}>Pause</Button>
        }

        {
          state.value === 'RUNNING'
          && <Button size="large" variant="outlined" onClick={() => send('RESET')}>Reset</Button>
        }

        {
          state.value === 'PAUSED'
          && <Button size="large" variant="outlined" onClick={() => send('RESET')}>Cancel</Button>
        }
      </ButtonGroup>
    </Contianer>
  );
}


export { StopwatchComponent as Stopwatch };
