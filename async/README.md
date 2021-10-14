# Async

An async function is a function that knows how to expect the possibility of the `await` 
keyword being used to invoke asynchronous code.

The `await` keyword can be put in front of any async promise-based function to pause your code on
that line until the promise fulfills, then return the resulting value.

## Question 1: Parallelize `async` functions

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

## Question 2: Non-blocking

What would be the output of the following code snippet:

```javascript
async function nonBlocking() {
	await timeoutPromise(2000);
	console.log('After await'); // 2
}

nonBlocking().then(() => console.log('nonBlocking() finished!')); // 3
console.log('After nonBlocking()'); // 1
```

Answer:

```
After nonBlocking()
After await
nonBlocking() finished!
```

## Question 3: Non-blocking

What would be the output of the following code snippet:

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

```
After asyncProcess(0)
After asyncProcess(1)
After asyncProcess(2)
End of main()
asyncProcess: 0
asyncProcess: 1
asyncProcess: 2

```

## Question 4: Blocking with `await`

What would be the output of the following snippet code?

```javascript
import { timeoutPromise } from "./fakePromise.js";

async function asyncProcess() {
	return timeoutPromise(1500);
}

(async function main() {
	for (let i = 0; i < 3; i++) {
		await asyncProcess();
		console.log(`asyncProcess: ${i}`);
		console.log(`After asyncProcess(${i})`);
	}
	console.log('End of main()');
})();
```

Answer:

```
asyncProcess: 0
After asyncProcess(0)
asyncProcess: 1
After asyncProcess(1)
asyncProcess: 2
After asyncProcess(2)
End of main()
```

Note that this approach is much slower than the previous one, as we are
blocking the event loop at each iteration by using the `await` keyword.

## Question 5

How would you improve previous scenario while still using the async/await syntax?

```javascript
async function asyncProcess(idx) {
	await timeoutPromise(1500);
	console.log('Finish asyncProcess(idx)');
}

(async function main() {
	const promises = [];
	for (let i = 0; i < 3; i++) {
		promises.push(asyncProcess(i));
		console.log(`Start asyncProcess(${i})`);
	}

	await Promise.all(promises);

	console.log('End of main()');
})();
```
