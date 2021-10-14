import { timeoutPromise } from "./fakePromise.js";

async function asyncProcess(idx) {
	await timeoutPromise(1500);
	console.log(`Finish asyncProcess(${idx})`);
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
