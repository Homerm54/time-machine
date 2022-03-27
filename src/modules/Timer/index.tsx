import { Button } from "../../components";
import { ButtonGroup, Contianer, Timer } from "./style";

function send(event: string) {
  console.log(`Event fired: ${event}`);
}

function TimerComponent(): JSX.Element {
  const state = { context: { time: { hours: '00', minutes: '00', seconds: '00' } } }
  
  return (
    <Contianer>
      <Timer>
        {state.context.time.hours} : {state.context.time.minutes} : {state.context.time.seconds}
      </Timer>

      <ButtonGroup>
        <Button size="large" variant="outlined" onClick={() => send('start')}>
          Start
        </Button>

        <Button size="large" variant="outlined" onClick={() => send('stop')}>
          Stop
        </Button>

        <Button size="large" variant="outlined" onClick={() => send('reset')}>
          Reset
        </Button>
      </ButtonGroup>
    </Contianer>
  );
}


export { TimerComponent as Timer };
