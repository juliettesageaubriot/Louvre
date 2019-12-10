export default class Debugger {
	constructor() {
		this.console = {};
	}

	add(key, value) {
		this.console = { ...this.console, [key]: value };
	}

	log(keys = [], tableMode = false) {
		if (keys.length > 0) {
			const console_ = {};
			keys.forEach((k) => (console_[k] = this.console[k]));
			if (tableMode) console.table(console_);
			else console.log(console_);
		} else {
			if (tableMode) console.table(this.console);
			else console.log(this.console);
		}
	}

	clear() {
		console.clear();
	}
}
