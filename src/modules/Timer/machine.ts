import { assign, createMachine, MachineConfig, Interpreter } from "xstate";

/**
 * Features:
 *  - hours - minutes - seconds input
 *  - Allows to stop / continue the timer
 *  
 *  - Support for overtime state, keeps counting in negative after 0 is reached
 *  - Allows to restart timer with the very same input as before
 *  - Support for multiple timers at the same time
 */

// [SECTION] INTERFACES
type TimerMachineContext = {
  /** Object representing the time that will be displayed on the UI */
  time: {
    /** Hours elapsed since started */
    hours: number;
    /** Minutes elapsed since started */
    minutes: number;
    /** Seconds elapsed since started */
    seconds: number;
  };
  /** Time that will be incremented for every "tick" event */
  step: number;
  /** Hold of the input time in case that a restart is requested */
  inputTime: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

type TimerMachineEvents =
  | { type: 'START', time: TimerMachineContext['time'], }
  | { type: 'RESUME' }
  | { type: 'STOP' }
  | { type: 'PAUSE' }
  | { type: 'RESTART' }
  | { type: 'TICK' }

interface TimerMachineSchema {
  states: {
    /** Idle state, when the timer tick is not running - time in 00:00:00 */
    IDLE: {},
    /** timer is running, and a tick is fired at a set interval */
    RUNNING: {
      states: {
        /** The stopwatch is counting down and hasn't reached 0 yet */
        NORMAL: {},
        /** The stopwatch is still counting, bu has already reached 0 */
        OVERTIME: {},
      }
    },
    /** Timer tick is paused, but the time state is preserved */
    PAUSED: {},
    /** An invalid time stamp has been submitted */
    INVALID: {},
  },
}

type TimerService = Interpreter<TimerMachineContext, TimerMachineSchema, TimerMachineEvents>;

const timerMachineOptions: MachineConfig<TimerMachineContext, TimerMachineSchema, TimerMachineEvents> = {
  id: 'stopwatch',
  initial: 'IDLE',
  context: {
    step: 1,
    time: { hours: 0, minutes: 0, seconds: 0 },
    inputTime: { hours: 0, minutes: 0, seconds: 0 },
  },
  states: {
    IDLE: {
      entry: 'resetTimer',
      on: {
        START: [
          { target: 'RUNNING', cond: 'validTimestamp', actions: 'assignTime' },
          { target: 'INVALID' }, // Always jump to invalid state
        ]
      }
    },
    RUNNING: {
      type: 'compound',
      initial: 'NORMAL',
      invoke: {
        id: 'ticker',
        src: 'ticker',
      },
      states: {
        NORMAL: {
          on: {
            TICK: [
              {
                cond: 'checkOvertime', // Check if overtime on each tick
                target: 'OVERTIME',
                actions: 'increment', // Keep ticking on transition, to avoid a delay of a second
              },
              { actions: 'decrement' },
            ], 
            PAUSE: { target: '#stopwatch.PAUSED' }, // # used to reference absolute state path from machine top to bottom
            STOP: { target: '#stopwatch.IDLE' },
          }
        },
        OVERTIME: {
          on: {
            TICK: { actions: 'increment' },
            STOP: { target: '#stopwatch.IDLE' },
            RESTART: { target: 'NORMAL', actions: 'restartTimer' },
          }
        },
      },
    },
    PAUSED: {
      on: {
        RESUME: { target: 'RUNNING' },
        RESTART: { target: 'RUNNING', actions: 'restartTimer' },
        STOP: { target: 'IDLE' },
      }
    },
    INVALID: {
      // for now, just alert and jump back to idle, nevertheless
      // it kept on a separate file in case a custom UI wants to be shown on invalid state
      // and hence, stay in invalid until transitioned out
      entry: 'alertInvalidState',
      always: { target: 'IDLE' }
    },
  },
};

const timerMachine = createMachine(timerMachineOptions, {
  actions: {
    alertInvalidState: () => alert('The time is invalid, make sure that minutes and seconds are 60 or less'),
    assignTime: assign({
      time: (context, event) => {
        if (event.type === 'START') {
          return {
            hours: event.time.hours,
            minutes: event.time.minutes,
            seconds: event.time.seconds,
          } 
        }
        return context.time;
      },
      inputTime: (context, event) => {
        if (event.type === 'START') {
          return {
            hours: event.time.hours,
            minutes: event.time.minutes,
            seconds: event.time.seconds,
          } 
        }
        return context.inputTime;
      }
    }),

    restartTimer: assign({
      time: (context) => context.inputTime,
    }),

    resetTimer: assign({
      time: () => ({ hours: 0, minutes: 0, seconds: 0 }),
    }),

    decrement: assign({
      time: (context) => processTick(context.time, context.step, false),
    }),

    increment: assign({
      time: (context) => processTick(context.time, context.step, true),
    }),
  },
  guards: {
    validTimestamp(ctx: any, event: any) {
      if (!event.time) return false;

      const { hours, minutes, seconds } = event.time;
      /** Check that the times on input are between the limits for them */
      const limits = hours >= 0 && minutes <= 60 && seconds <= 60;
      /** Guard agains a 0 seconds timer */
      const atLeastOneSecondTimer = hours > 0 || minutes > 0 || seconds > 0;
      
      if (limits && atLeastOneSecondTimer) return true;
      return false;
    },

    checkOvertime(context) {
      const { hours, minutes, seconds } = context.time;
      // Clock has reaches the 0 point
      if (hours === 0 && minutes === 0 && seconds === 0) return true;
      return false;
    }
  },

  services: {
    //Service invoked with **callback** mode, sends events back to parent
    ticker: () => (cb) => {
      const clockid = setInterval(() => cb('TICK'), 1000);
      return () => clearInterval(clockid); // Stop ticking on state exit
    }
  }
});

export { timerMachine };
export type { TimerService };


// [SECTION] Helpers
/**
 * Function to extract the logic of processing a tick event, mutating the time object
 * @param time The current time in machine context, for the given event in the tick.
 * @param interval The step, or interval, that will update the time object.
 * @param countingUp Flag to process the tick, whether on overtime, or in normal process.
 * @returns The new processed time for the tick event.
 */
function processTick(time: TimerMachineContext['time'], interval: number, countingUp?: boolean) {
  let { hours, minutes, seconds } = time;

  if (countingUp ? seconds <= 59 : seconds >= 0) {
    if (countingUp) seconds += interval;
    else seconds -= interval;
  } else {
    seconds = countingUp ? 0 : 59;

    if (countingUp ? minutes <= 59 : minutes >= 0) {
      if (countingUp) minutes += interval;
      else minutes -= interval;
    } else {
      minutes = countingUp ? 0 : 59;
      if (countingUp) hours += interval;
      else hours -= interval;
    }
  }

  return { hours, minutes, seconds };
}
