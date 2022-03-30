import { useMachine, useActor } from "@xstate/react";
import { useState } from "react";
import { Button } from "../../components";
import { timerMachine, TimerService } from "./machine";
import { ButtonGroup, Contianer, Input, StateLabel, TimeContainer } from "./style";

function InputTimer({ machine }: { machine: TimerService }): JSX.Element {
  const [state, send] = useActor(machine);
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const setValue = (name: any, value: string) => {
    const parsedValue = parseInt(value);
    if (!isNaN(parsedValue)) setTime({ ...time, [name]: parsedValue });
  }
  
  return (
    <Contianer>
      <TimeContainer>
        <Input 
          value={time.hours >= 10 ? time.hours : `0${time.hours}`} 
          onChange={(e) => setValue('hours', e.currentTarget.value)} 
        />
        <span style={{ width: 55 }}>:</span>

        <Input 
          value={time.minutes >= 10 ? time.minutes : `0${time.minutes}`}
          onChange={(e) => setValue('minutes', e.currentTarget.value)} 
        />
        <span style={{ width: 55 }}>:</span>

        <Input 
          value={time.seconds >= 10 ? time.seconds : `0${time.seconds}`}
          onChange={(e) => setValue('seconds', e.currentTarget.value)} 
        />
      </TimeContainer>

      <StateLabel>
        CURRENT STATE: {state.toStrings().slice(-1)}
      </StateLabel>

      <ButtonGroup>
        <Button
          size="large"
          variant="outlined"
          onClick={() => send({ type: 'START', time })}
        >
          Start
        </Button>
      </ButtonGroup>
    </Contianer>
  )
}

function ActiveTimer({ machine }: { machine: TimerService }): JSX.Element {
  const [state, send] = useActor(machine);
  const overtime = state.matches('RUNNING.OVERTIME');

  const parseTime = (time: number) => {
    if (time >= 10) return time;
    return `0${time}`;
  }

  return(
    <Contianer>
      <TimeContainer $overtime={overtime}>
        {overtime && <span style={{ width: 55 }}>-</span>}
        {parseTime(state.context.time.hours)} : {parseTime(state.context.time.minutes)} : {parseTime(state.context.time.seconds)}
      </TimeContainer>

      <StateLabel>
        CURRENT STATE: {state.toStrings().slice(-1)}
      </StateLabel>

      <ButtonGroup>
        {
          state.matches('RUNNING.NORMAL')
          && <Button size="large" variant="outlined" onClick={() => send({ type: 'PAUSE' })}>Pause</Button>
        }

        {
          state.matches('PAUSED')
          && <Button size="large" variant="outlined" onClick={() => send({ type: 'RESUME' })}>Resume</Button>
        }
        
        {
          (state.matches('RUNNING.NORMAL') || state.matches('PAUSED'))
          && <Button size="large" variant="outlined" type="danger" onClick={() => send({ type: 'STOP' })}>Cancel</Button>
        }
        
        {
          state.matches('RUNNING.OVERTIME')
          && (
            <>
              <Button size="large" variant="outlined" onClick={() => send({ type: 'RESTART' })}>Restart</Button>
              <Button size="large" variant="outlined" onClick={() => send({ type: 'STOP' })}>Dismiss</Button>
            </>
          )
        }
        
      </ButtonGroup>
    </Contianer>
  );
}


function TimerComponent(): JSX.Element {
  const [state, , service] = useMachine(timerMachine);
  const inputState = state.matches("IDLE");
  
  // @ts-expect-error: ts error about incompatible states, but actually works
  if (inputState) return <InputTimer machine={service} />;
  // @ts-expect-error: ts error about incompatible states, but actually works
  return <ActiveTimer machine={service} />;
}


export { TimerComponent as Timer };
