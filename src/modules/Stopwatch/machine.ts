import { assign, createMachine, MachineConfig } from "xstate";

type StopwatchMachineContext = {
  /** Object representing the time that will be displayed on the UI */
  time: {
    /** Hours elapsed since started */
    hours: number;
    /** Minutes elapsed since started */
    minutes: number;
    /** Seconds elapsed since started */
    seconds: number;
  },
  // time that will be incremented for every "tick" event
  step: number,

  laps: Array<StopwatchMachineContext['time']>,
}

type StopwatchMachineTransitions =
  | { type: 'START' }
  | { type: 'STOP' }
  | { type: 'RESET' }
  | { type: 'TICK' }
  | { type: 'LAP' }

interface StopwatchMachineSchema {
  states: {
    /** Idle state, when the timer tick is not running - time in 00:00:00 */
    IDLE: {},
    /** timer is running, and a tick is fired at a set interval */
    RUNNING: {},
    /** Timer tick is puased, but the time state is preserved */
    PAUSED: {},
  },
}

const stopwatchMachineOptions: MachineConfig<StopwatchMachineContext, StopwatchMachineSchema, StopwatchMachineTransitions> = {
  id: 'Timer-Machine',
  context: {
    time: { hours: 0, minutes: 0, seconds: 0 },
    step: 1,
    laps: [],
  },
  initial: 'IDLE',
  states: {
    IDLE: {
      entry: 'reset', // Reset the timer evey time the machine enters in the indle state
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
      // This is the true clock service that will be started as soon as the machine enters
      // in this state, and will be stopped as soon as the machine existe the state
      // that's why is invoked, is tied to the current state
      invoke: {
        id: 'clock',
        src: 'ticker',
      },
      // State Transitions
      on: {
        STOP: { target: 'PAUSED' },
        TICK: { actions: 'increment' },
        RESET: { actions: 'reset' },
        LAP: { actions: 'markLap' }
      }
    },
  }
};

const stopwatchMachine = createMachine(stopwatchMachineOptions, {
  actions: {
    // Mapping of actions, the increment action will upadate the time prop in the context object
    increment: assign({
      time: (cxt) => {
        let { hours, minutes, seconds } = cxt.time;

        if (seconds < 59) seconds += cxt.step;
        else {
          seconds = 0;
          if (minutes < 59) minutes += cxt.step;
          else {
            minutes = 0;
            hours += cxt.step;
          }
        }

        return { hours, minutes, seconds, };
      }
    }),
    markLap: assign({
      laps: (context) => context.laps.concat(context.time),
    }),
    reset: assign({
      time: () => ({ hours: 0, minutes: 0, seconds: 0 }),
      laps: () => { return [] as StopwatchMachineContext['laps']; },
    })
  },
  services: {
    //Service invoked with **callback** mode, sends events back to parent
    ticker: () => (cb) => {
      const clockid = setInterval(() => cb('TICK'), 1000);
      return () => clearInterval(clockid); // Stop ticking on state exit
    }
  }
})

export { stopwatchMachine };
