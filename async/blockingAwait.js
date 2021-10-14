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
