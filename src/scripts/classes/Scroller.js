import { gsap } from 'gsap';

export default class Scroller {
	constructor(scrollingElement, appDebugger, debug = true, velocity = 80) {
		this.config = { velocity, debug, autoIntervalID: null, auto: false };
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

		if (this.config.auto && this.data.direction === 'RIGHT') {
			this.toggleAuto();
		}

		this.scroll({ wheelDelta: e.wheelDelta || -e.detail });
	}

	scroll(conf = {}) {
		const { app, appDebugger, config } = this;
		const { wheelDelta, scrollTo, duration } = conf;

		// scroll converter
		// -1 = RIGHT, 1 = LEFT, 0 when !wheeldelta
		const delta = config.auto
			? -1
			: !wheelDelta
			? 0
			: Math.max(-1, Math.min(1, wheelDelta));
		const scrollLeft_ = gsap.getProperty(app, 'scrollLeft');

		if (!scrollTo) {
			gsap.to(app, {
				scrollLeft: scrollLeft_ - delta * config.velocity,
				ease: 'power2.out'
			});
		} else {
			gsap.to(app, {
				scrollLeft: scrollTo,
				ease: 'power2.out',
				...(duration ? { duration } : {}),
				onComplete: () => this.clearAuto()
			});
		}

		// data
		this.data = {
			direction: delta < 0 ? 'RIGHT' : 'LEFT',
			x: app.scrollLeft,
			autoScroll: config.auto
		};

		if (appDebugger) appDebugger.add('scroller', this.data);
		if (config.debug) this.log();
	}

	log() {
		this.appDebugger.log(['scroller']);
	}

	auto(scrollTo = 0, duration = 0) {
		this.config.auto = true;
		this.config.autoIntervalID = setInterval(
			() => this.scroll({ scrollTo, duration }),
			200
		);
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
