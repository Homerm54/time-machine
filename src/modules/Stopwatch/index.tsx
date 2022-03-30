import { useMachine } from "@xstate/react";
import { Button } from "../../components";
import { parseTime } from "../../lib/parseTime";
import { stopwatchMachine } from "./machine";
import { ButtonGroup, Contianer, Lap, Laps, StateLabel, TimeContainer } from "./style";


function StopwatchComponent(): JSX.Element {
  const [state, send] = useMachine(stopwatchMachine);
  const { hours, minutes, seconds } = state.context.time;

  return (
    <div>
      <Contianer>        
        <TimeContainer>
          {parseTime(hours)} : {parseTime(minutes)} : {parseTime(seconds)}
        </TimeContainer>

        <StateLabel>
          CURRENT STATE: {state.toStrings().slice(-1)}
        </StateLabel>

        <Laps>
          <h3>Laps</h3>
          {
            state.context.laps.map((time, ix) => (
              <Lap key={ix}>
                Time #{ix + 1}:&nbsp;
                {parseTime(time.hours)} : {parseTime(time.minutes)} : {parseTime(time.seconds)}
              </Lap>
            ))
          }
        </Laps>
      </Contianer>

      <ButtonGroup>
        {
          ['IDLE', 'PAUSED'].some(state.matches)
          && <Button size="large" variant="outlined" onClick={() => send('START')}>Start</Button>
        }

        {
          state.matches('RUNNING')
          && (
            <>
              <Button size="large" variant="outlined" onClick={() => send('STOP')}>Pause</Button>
              <Button size="large" variant="outlined" onClick={() => send('RESET')}>Reset</Button>
              <Button size="large" variant="outlined" onClick={() => send('LAP')}>Lap</Button>
            </>
          )
        }

        {
          state.matches('PAUSED')
          && <Button size="large" variant="outlined" onClick={() => send('RESET')}>Cancel</Button>
        }
      </ButtonGroup>
      </div>
  );
}


export { StopwatchComponent as Stopwatch };
