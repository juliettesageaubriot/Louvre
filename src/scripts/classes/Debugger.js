export default class Debugger {
	constructor() {
		this.console = {};
	}

	add(key, value) {
		this.console = { ...this.console, [key]: value };
	}

	log(keys = []) {
		if (keys.length > 0) {
			const console_ = {};

			keys.forEach((k) => {
				console_[k] = this.console[k];
			});

			console.log(console_);
		} else console.log(this.console);
	}

	clear() {
		console.clear();
	}
}
