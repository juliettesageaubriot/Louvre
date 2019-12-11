import './styles.scss';

import Debugger from './scripts/classes/Debugger';
import Scroller from './scripts/classes/Scroller';

class App {
	constructor(debug = true, className = '.app') {
		this.app = document.querySelector(className);
		this.animation = {};
		this.config = {
			debug
		};

		if (this.config.debug) {
			this.debugger = new Debugger();
			this.debugger.clear();
		}

		this.scroller = new Scroller(
			this.app.querySelector('.app__scenes'),
			this.debugger
		);

		this.bind();
		this.events();
	}

	bind() {}

	events() {}
}

window.onload = () => (window.app = new App());
