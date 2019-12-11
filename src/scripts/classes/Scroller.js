import { gsap } from 'gsap';

export default class Scroller {
	constructor(scrollingElement, appDebugger, velocity = 80) {
		this.config = { velocity, autoIntervalID: null, auto: false };
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
		e = window.event || e;

		e.preventDefault();

		// block scroll left/right
		if (Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)) {
			return true;
		}

		this.scroll({ wheelDelta: e.wheelDelta || -e.detail });
	}

	scroll(conf) {
		const { app, appDebugger, config } = this;
		const { auto, wheelDelta, toX } = conf;

		// scroll converter
		// -1 = RIGHT, 1 = LEFT
		const delta = auto ? -1 : Math.max(-1, Math.min(1, wheelDelta));
		const scrollLeft_ = gsap.getProperty(app, 'scrollLeft');
		gsap.to(app, {
			scrollLeft: toX ? toX : scrollLeft_ - delta * config.velocity,
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

	auto() {
		this.config.auto = true;
		this.config.autoIntervalID = setInterval(() => {
			this.scroll({ auto: true });
		}, 200);
	}

	clearAuto() {
		clearInterval(this.config.autoIntervalID);
	}

	toggleAuto() {
		this.config.auto = !this.config.auto;

		if (this.config.auto) this.auto();
		else this.clearAuto();
	}
}
