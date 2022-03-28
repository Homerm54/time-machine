import { useMachine } from "@xstate/react";
import { Button } from "../../components";
import { timerMachine } from "./machine";
import { ButtonGroup, Contianer, Timer } from "./style";


function TimerComponent(): JSX.Element {
  const [state, send] = useMachine(timerMachine);
  
  return (
    <Contianer>
      <Timer>
        {state.context.time.hours} : {state.context.time.minutes} : {state.context.time.seconds}
      </Timer>

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


export { TimerComponent as Timer };
