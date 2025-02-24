# Async

## Overview

An async function function allows the `await` keyword within its function body, enabling asynchronous, promise-based behavior to be written in a cleaner style and avoiding the need to explicitly configure promise chains.

> [async MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
> [await MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)

## Question 1: Run `async` functions concurrently with `Promise.all`

Question: Is there a way to run the following `async` functions concurrently?

```javascript
/**
 * Slow version, takes ~9000ms
 * @returns {Promise<void>}
 */
async function slowTimeTest() {
  await timeoutPromise(3000);
  await timeoutPromise(3000);
  await timeoutPromise(3000);
}
```

Answer: Using `Promise.all`.

```javascript
/**
 * Fast version, takes ~3000ms
 * @returns {Promise<unknown[]>}
 */
async function fastTimeTest() {
  const p1 = timeoutPromise(3000);
  const p2 = timeoutPromise(3000);
  const p3 = timeoutPromise(3000);

  return Promise.all([p1, p2, p3]);
}

/**
 * Fast version 2, takes ~3000ms
 * @returns {Promise<unknown[]>}
 */
async function fastTimeTest2() {
  return Promise.all([
    timeoutPromise(3000),
    timeoutPromise(3000),
    timeoutPromise(3000),
  ]);
}
```

## Question 2: Non-blocking behavior

Question: In which order will the following code print the messages?

```javascript
async function nonBlocking() {
  await timeoutPromise(2000);
  console.log('After await');
}

nonBlocking().then(() => console.log('nonBlocking() finished!'));
console.log('After nonBlocking()');
```

Answer:

```javascript
async function nonBlocking() {
  await timeoutPromise(2000);
  console.log('After await'); // 2
}

nonBlocking().then(() => console.log('nonBlocking() finished!')); // 3
console.log('After nonBlocking()'); // 1

// After nonBlocking()
// After await
// nonBlocking() finished!
```

## Question 3: Non-blocking behavior in loops

Question: What would be the output of the following code snippet?

```javascript
async function asyncProcess() {
  return timeoutPromise(1500);
}

function main() {
  for (let i = 0; i < 3; i++) {
    asyncProcess().then(() => console.log(`asyncProcess: ${i}`));
    console.log(`After asyncProcess(${i})`);
  }
  console.log('End of main()');
}

main();
```

Answer:

```js
// After asyncProcess(0)
// After asyncProcess(1)
// After asyncProcess(2)
// End of main()
// asyncProcess: 0
// asyncProcess: 1
// asyncProcess: 2
```

## Question 4: Blocking with `await`

Question: What would be the output of the following snippet code?

```javascript
import { timeoutPromise } from "./fakePromise.js";

async function asyncProcess() {
  return timeoutPromise(1500);
}

(async function main() {
  for (let i = 0; i < 3; i++) {
    console.log(`Start asyncProcess(${i})`);
    await asyncProcess();
    console.log(`Finish asyncProcess(${i})`);
  }
  console.log('End of main()');
})();
```

Answer:

```js
// Start asyncProcess(0)
// Finish asyncProcess(0)
// Start asyncProcess(1)
// Finish asyncProcess(1)
// Start asyncProcess(2)
// Finish asyncProcess(2)
// End of main()
```

Note that this approach is much slower than the previous one, as we are blocking the event loop at each iteration by using the `await` keyword.

## Question 5: Run `async` functions concurrently

Question: How would you improve this code to run faster while still using the async/await syntax?

```javascript
import { timeoutPromise } from "./fakePromise.js";

async function asyncProcess() {
  return timeoutPromise(1500);
}

(async function main() {
  for (let i = 0; i < 3; i++) {
    console.log(`Start asyncProcess(${i})`);
    await asyncProcess();
    console.log(`Finish asyncProcess(${i})`);
  }
  console.log('End of main()');
})();
```

Answer:

```javascript
async function asyncProcess(idx) {
  console.log(`Start asyncProcess(${i})`);
  await timeoutPromise(1500);
  console.log('Finish asyncProcess(idx)');
}

(async function main() {
  const promises = [];
  for (let i = 0; i < 3; i++) {
    promises.push(asyncProcess(i));
  }

  await Promise.all(promises);

  console.log('End of main()');
})();
```

## Question 6: Run `async` functions concurrently with `Promise.allSettled`

Question: The following code throws an error if any promise rejects. How would you modify it to run all promises and only log the errors if any?

```javascript
async function asyncProcess(idx) {
  console.log(`Start asyncProcess(${i})`);
  await timeoutPromise(1500);
  console.log('Finish asyncProcess(idx)');
}

(async function main() {
  const promises = [];
  for (let i = 0; i < 3; i++) {
    promises.push(asyncProcess(i));
  }

  await Promise.all(promises);

  console.log('End of main()');
})();
```

Answer:

```javascript
async function asyncProcess(idx) {
  console.log(`Start asyncProcess(${i})`);
  await timeoutPromise(1500);
  console.log('Finish asyncProcess(idx)');
}

(async function main() {
  const promises = [];
  for (let i = 0; i < 3; i++) {
    promises.push(asyncProcess(i));
  }

  const results = await Promise.allSettled(promises);

  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.error(result.reason);
    }
  });

  console.log('End of main()');
})();
```
