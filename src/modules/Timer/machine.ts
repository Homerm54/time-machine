import { assign, createMachine, MachineConfig } from "xstate";

type TimerMachineContext = {
  /** Object representing the time that will be displayed on the UI */
  time: {
    /** Hours elapsed since started */
    hours: string;
    /** Minutes elapsed since started */
    minutes: string;
    /** Seconds elapsed since started */
    seconds: string;
  },
  step: number,
}

type TimerMachineTransitions =
  | { type: 'START' }
  | { type: 'STOP' }
  | { type: 'RESET' }
  | { type: 'TICK' }

interface TimerMachineSchema {
  states: {
    /** Idle state, when the timer tick is not running - time in 00:00:00 */
    IDLE: {},
    /** timer is running, and a tick is fired at a set interval */
    RUNNING: {},
    /** Timer tick is puased, but the time state is preserved */
    PAUSED: {},
  },
}

const timerMachineOptions: MachineConfig<TimerMachineContext, TimerMachineSchema, TimerMachineTransitions> = {
  id: 'Timer-Machine',
  context: {
    time: { hours: '00', minutes: '00', seconds: '00' },
    step: 1,
  },
  initial: 'IDLE',
  states: {
    IDLE: {
      entry: 'reset',
      on: {
        START: { target: 'RUNNING' },
      }
    },
    PAUSED: {
      on: {
        START: { target: 'RUNNING' },
        RESET: { target: 'IDLE' },
      }
    },
    RUNNING: {
      invoke: {
        id: 'clock',
        src: 'ticker',
      },
      on: {
        STOP: { target: 'PAUSED' },
        TICK: { actions: 'increment' },
        RESET: { actions: 'reset' }
      }
    },
  }
};

const timerMachine = createMachine(timerMachineOptions, {
  actions: {
    increment: assign({
      time: (cxt) => {
        let hours = parseInt(cxt.time.hours, 10);
        let minutes = parseInt(cxt.time.minutes, 10);
        let seconds = parseInt(cxt.time.seconds, 10);

        if (seconds < 59) {
          seconds += cxt.step;
        } else {
          seconds = 0;
          if (minutes < 59) {
            minutes += cxt.step;
          } else {
            minutes = 0;
            hours += cxt.step;
          }
        }

        return {
          hours: hours >= 10 ? `${hours}` : `0${hours}`,
          minutes: minutes >= 10 ? `${minutes}` : `0${minutes}`,
          seconds: seconds >= 10 ? `${seconds}` : `0${seconds}`,
        }
      }
    }),

    reset: assign({
      time: () => ({ hours: '00', minutes: '00', seconds: '00' }),
    })
  },
  services: {
    // Function that returns a **callback**, sends events back to parent
    ticker: () => (cb) => {
      const clockid = setInterval(() => {
        cb('TICK');
      }, 1000);

      return () => clearInterval(clockid);
    }
  }
})

export { timerMachine };
