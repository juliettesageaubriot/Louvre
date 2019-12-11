import { gsap } from 'gsap';

export default class Scroller {
	constructor(scrollingElement, appDebugger, velocity = 80) {
		this.config = { velocity };
		this.app = scrollingElement;
		this.appDebugger = appDebugger;
		this.data = {};

		this.init();
	}

	init() {
		this.bind();

		const { handler } = this;
		window.addEventListener('mousewheel', handler, { passive: false });
		window.addEventListener('DOMMouseScroll', handler, { passive: false });
	}

	bind() {
		this.handler = this.handler.bind(this);
	}

	handler(e) {
		const { app, appDebugger, config } = this;

		e = window.event || e;

		e.preventDefault();

		// block scroll left/right
		if (Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)) {
			return true;
		}

		// scroll converter
		const delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
		const scrollLeft_ = gsap.getProperty(app, 'scrollLeft');
		gsap.to(app, {
			scrollLeft: scrollLeft_ - delta * config.velocity,
			ease: 'power2.out'
		});

		// data
		this.data = {
			direction: delta < 0 ? 'RIGHT' : 'LEFT',
			x: app.scrollLeft
		};

		if (appDebugger) {
			appDebugger.add('scroller', this.data);
			appDebugger.log(['scroller']);
		}
	}
}
