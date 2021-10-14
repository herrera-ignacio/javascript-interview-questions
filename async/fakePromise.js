export function timeoutPromise(timeout) {
	return new Promise((resolve, _reject) => {
		setTimeout(() => resolve("Done"), timeout);
	});
}
