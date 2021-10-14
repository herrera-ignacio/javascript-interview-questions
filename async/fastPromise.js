import { timeoutPromise } from "./fakePromise.js";

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

function runBenchmark(promise) {
	console.log(`Starting benchmark for: ${promise.name}`);
	let startTime = Date.now();
	promise()
		.then(() => {
			let finishTime = Date.now();
			let timeTaken = finishTime - startTime;
			console.log("Time taken in milliseconds: " + timeTaken);
		})
		.catch(() => console.error('Something went wrong'));
}

runBenchmark(fastTimeTest);
runBenchmark(fastTimeTest2);
runBenchmark(slowTimeTest);
