# Event Loop

- [Event Loop](#event-loop)
  - [Overview](#overview)
    - [Event loop phases](#event-loop-phases)
    - [Phases overview](#phases-overview)
  - [Questions](#questions)
    - [Question: How fast does a setTimeout with 0ms timeout execute?](#question-how-fast-does-a-settimeout-with-0ms-timeout-execute)
    - [Question: `setImmediate()` vs `setTimeout()`](#question-setimmediate-vs-settimeout)
    - [Question: When is `process.nextTick()` executed?](#question-when-is-processnexttick-executed)
    - [Question: When to use `process.nextTick()`?](#question-when-to-use-processnexttick)
    - [Question: Why allow for something like `process.nextTick()`?](#question-why-allow-for-something-like-processnexttick)
  - [Question: `process.nextTick()` vs `setImmediate()`](#question-processnexttick-vs-setimmediate)

## Overview

The event loop is what allows Node.js to perform non-blocking I/O operations — despite the fact that a single JavaScript thread is used by default — by offloading operations to the system kernel whenever possible.

Since most modern kernels are multi-threaded, they can handle multiple operations executing in the background. When one of these operations completes, the kernel tells Node.js so that the appropriate callback may be added to the poll queue to eventually be executed.

> [Node.js Event Loop documentation](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick).

### Event loop phases

The following diagram shows a simplified overview of the event loop's order of operations. Each box will be referred to as a "phase" of the event loop.

```text
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

- Each phase has a FIFO queue of callbacks to execute.
- Generally, when the event loop enters a given phase, it will perform any operations specific to that phase, then execute callbacks in that phase's queue until the queue has been exhausted or the maximum number of callbacks has executed.
- Moves to the next phase.

### Phases overview

- __timers__: this phase executes callbacks scheduled by setTimeout() and setInterval().
- __pending callbacks__: executes I/O callbacks deferred to the next loop iteration.
- __idle, prepare__: only used internally.
- __poll__: retrieve new I/O events; execute I/O related callbacks (almost all with the exception of close callbacks, the ones scheduled by timers, and setImmediate()); node will block here when appropriate.
- __check__: setImmediate() callbacks are invoked here.
- __close callbacks__: some close callbacks, e.g. socket.on('close', ...).

More a more detailed view see [Phases in Detail](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick#phases-in-detail).

## Questions

### Question: How fast does a setTimeout with 0ms timeout execute?

A timer specifies the threshold after which a provided callback may be executed rather than the exact time a person wants it to be executed. Timers callbacks will run as early as they can be scheduled after the specified amount of time has passed.

Technically, the poll phase controls when timers are executed. Once the poll queue is empty the event loop will check for timers whose time thresholds have been reached. If one or more timers are ready, the event loop will wrap back to the timers phase to execute those timers' callbacks.

Therefore, the timer will execute as soon as both the threshold has been reached and the poll phase decides to execute the timer's callback.

### Question: `setImmediate()` vs `setTimeout()`

Question: What is the difference between `setImmediate()` and `setTimeout()`?

- `setImmediate()` is designed to execute a script once the current poll phase completes.
- `setTimeout()` schedules a script to be run after a minimum threshold in ms has elapsed.

Question: Which one executes first?

Answer: The order in which the timers are executed will vary depending on the context in which they are called.
For example, if we run the following script which is not within an I/O cycle (i.e. the main module), the order in which the two timers are executed is non-deterministic, as it is bound by the performance of the process:

```js
setTimeout(() => {
  console.log('timeout');
}, 0);

setImmediate(() => {
  console.log('immediate');
});
```

However, if you move the two calls within an I/O cycle, the immediate callback is always executed first:

```js
// timeout_vs_immediate.js
const fs = require('node:fs');
fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout'); // This will be executed last
  }, 0);
  setImmediate(() => {
    console.log('immediate'); // This will be executed first
  });
});
```

`setImmediate()` will always be executed before any timers if scheduled within an I/O cycle, independently of how many timers are present.

### Question: When is `process.nextTick()` executed?

`process.nextTick()` is not technically part of the event loop. Instead, the `nextTickQueue` will be processed after the current operation is completed,
regardless of the current phase of the event loop. Here, an operation is defined as a transition from the underlying C/C++ handler, and handling the JavaScript that needs to be executed.

Any time you call `process.nextTick()` in a given phase, all callbacks passed to `process.nextTick()` will be resolved before the event loop continues.

> Warning! This can create some bad situations because it allows you to "starve" your I/O by making recursive process.nextTick() calls, which prevents the event loop from reaching the poll phase.

### Question: When to use `process.nextTick()`?

There are two main reasons:

1. Allow users to handle errors, cleanup any then unneeded resources, or perhaps try the request again before the event loop continues.
2. At times it's necessary to allow a callback to run after the call stack has unwound but before the event loop continues.

For example, you could emit an event within an Event Emitter constructor:

```js
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {
  constructor() {
    super();
    // use nextTick to emit the event once a handler is assigned
    process.nextTick(() => {
      this.emit('event');
    });
  }
}
const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
```

### Question: Why allow for something like `process.nextTick()`?

Part of it is a design philosophy where an API should always be asynchronous even where it doesn't have to be.

Consider the following example:

```js
function apiCall(arg, callback) {
  if (typeof arg !== 'string')
    return process.nextTick(
      callback,
      new TypeError('argument should be string')
    );
}
```

What we're doing is passing an error back to the user but only after we have allowed the rest of the user's code to execute.
By using `process.nextTick()` we guarantee that `apiCall()` always runs its callback after the rest of the user's code and before the event loop is allowed to proceed.

## Question: `process.nextTick()` vs `setImmediate()`

Question: What is the difference between `process.nextTick()` and `setImmediate()`?

- `process.nextTick()` fires immediately on the same phase
- `setImmediate()` fires on the following iteration or 'tick' of the event loop.
