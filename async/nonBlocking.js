import { timeoutPromise } from './fakePromise.js';

async function nonBlocking() {
	await timeoutPromise(2000);
	console.log('After await');
}

nonBlocking().then(() => console.log('nonBlocking() finished!'));
console.log('After nonBlocking()');
