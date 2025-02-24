# Tasks and microtasks

- [Tasks and microtasks](#tasks-and-microtasks)
  - [Overview](#overview)
  - [Questions](#questions)
    - [Question: What is the difference between a task and a microtask?](#question-what-is-the-difference-between-a-task-and-a-microtask)
    - [Question: When to use microtask?](#question-when-to-use-microtask)
      - [Example: Ensuring ordering on conditional use of promises](#example-ensuring-ordering-on-conditional-use-of-promises)
      - [Example: Batching operations](#example-batching-operations)
    - [Question: Timer vs microtask](#question-timer-vs-microtask)
    - [Question: Is a difference about microtasks in Node.js and the browser?](#question-is-a-difference-about-microtasks-in-nodejs-and-the-browser)

## Overview

A __task__ is anything which is scheduled to be run by the standard mechanisms such as initially starting to run a program, an event being dispatched asynchronously, or an interval or timeout being fired. These all get scheduled on the task queue.

The event loop driving your code handles these tasks one after another, in the order in which they were enqueued. The oldest runnable task in the task queue will be executed during a single iteration of the event loop.

After that, microtasks will be executed until the microtask queue is empty, and then the browser may choose to update rendering. Then the browser moves on to the next iteration of event loop.

Microtasks include:

- Promises callbacks.
- `queueMicrotask()`
- `MutationObserver` (browser only)
- `process.nextTick` (Node.js only, but behaves like a microtask)

- [MDN docs - Using microtasks in JavaScript](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide#tasks_vs._microtasks)
- [MDN docs - In depth: Tasks and microtasks](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth)

## Questions

### Question: What is the difference between a task and a microtask?

There are two main differences:

1. Each time a task exits, the event loop checks to see if the task is returning control to other JavaScript code. If not, it runs all of the microtasks in the microtask queue. The microtask queue is, then, processed multiple times per iteration of the event loop, including after handling events and other callbacks.

2. If a microtask adds more microtasks to the queue by calling queueMicrotask(), those newly-added microtasks execute before the next task is run. That's because the event loop will keep calling microtasks until there are none left in the queue, even if more keep getting added.

### Question: When to use microtask?

Generally, it's about capturing or checking results, or performing cleanup, after the main body of a JavaScript execution context exits, but before any event handlers, timeouts and intervals, or other callbacks are processed.

The main reason to use microtasks is that: to ensure consistent ordering of tasks, even when results or data is available synchronously, but while simultaneously reducing the risk of user-discernible delays in operations.

#### Example: Ensuring ordering on conditional use of promises

Consider the following example where a promise is used only in one of the branches of a conditional statement:

```js
customElement.prototype.getData = function (url) {
  if (this.cache[url]) {
    this.data = this.cache[url];
    this.dispatchEvent(new Event("load"));
  } else {
    fetch(url)
      .then((result) => result.arrayBuffer())
      .then((data) => {
        this.cache[url] = data;
        this.data = data;
        this.dispatchEvent(new Event("load"));
      });
  }
};
```

We have a situation where the order of operations can vary.

```js
element.addEventListener("load", () => console.log("Loaded data"));
console.log("Fetching data…");
element.getData();
console.log("Data fetched");
```

Executing the above code twice will yield two different results.

When the data is not cached:

```text
Fetching data…
Data fetched
Loaded data
```

And when the data is cached:

```text
Fetching data…
Loaded data
Data fetched
```

We can ensure consistent ordering of these operations by using a microtask in the if clause to balance the two clauses:

```js
customElement.prototype.getData = function (url) {
  if (this.cache[url]) {
    queueMicrotask(() => {
      this.data = this.cache[url];
      this.dispatchEvent(new Event("load"));
    });
  } else {
    fetch(url)
      .then((result) => result.arrayBuffer())
      .then((data) => {
        this.cache[url] = data;
        this.data = data;
        this.dispatchEvent(new Event("load"));
      });
  }
};
```

#### Example: Batching operations

You can also use microtasks to collect multiple requests from various sources into a single batch, avoiding the possible overhead involved with multiple calls to handle the same kind of work.

The snippet below creates a function that batches multiple messages into an array, using a microtask to send them as a single object when the context exits.

```js
const messageQueue = [];

let sendMessage = (message) => {
  messageQueue.push(message);

  if (messageQueue.length === 1) {
    queueMicrotask(() => {
      const json = JSON.stringify(messageQueue);
      messageQueue.length = 0;
      fetch("url-of-receiver", json);
    });
  }
};
```

If the message we just added to the array is the first one, we enqueue a microtask that will send a batch. The microtask will execute, as always, when the JavaScript execution path reaches the top level, just before running callbacks. That means that any further calls to sendMessage() made in the interim will push their messages onto the message queue, but because of the array length check before adding a microtask, no new microtask is enqueued.

When the microtask runs, then, it has an array of potentially many messages waiting for it.

### Question: Timer vs microtask

Question: What would get executed first?

```js
const callback = () => log("Regular timeout callback has run");

const urgentCallback = () => log("*** Oh noes! An urgent callback has run!");

log("Main program started");
setTimeout(callback, 0);
queueMicrotask(urgentCallback);
log("Main program exiting");
```

Answer: The microtask will execute first.

```text
Main program started
Main program exiting
*** Oh noes! An urgent callback has run!
Regular timeout callback has run
```

That's because when the task that's handling the execution of the main program exits, the microtask queue gets processed before the task queue on which the timeout callback is located. Remembering that tasks and microtasks are kept on separate queues, and that microtasks run first will help keep this straight.

### Question: Is a difference about microtasks in Node.js and the browser?

Yes, there's a difference.

In browsers, microtasks are processed right after the current execution stack and before rendering or handling macrotasks (like setTimeout). Also, `process.nextTick()` is not available.

```js
console.log("Start");

Promise.resolve().then(() => console.log("Microtask 1"));
queueMicrotask(() => console.log("Microtask 2"));

setTimeout(() => console.log("Macrotask (setTimeout)"), 0);

console.log("End");

// Start
// End
// Microtask 1
// Microtask 2
// Macrotask (setTimeout)
```

In the case of Node.js, microtasks are executed at the end of the current phase in the event loop but also, `process.nextTick()` runs before any other microtasks.

```js
console.log("Start");

process.nextTick(() => console.log("nextTick 1"));
Promise.resolve().then(() => console.log("Promise 1"));

setTimeout(() => console.log("Macrotask (setTimeout)"), 0);

console.log("End");

// Start
// End
// nextTick 1
// Promise 1
// Macrotask (setTimeout)
```
