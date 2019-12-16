// TODO
// ...

import { gsap } from 'gsap';

export default class Scroller {
	constructor(scrollingElement, appDebugger, debug = true, velocity = 80) {
		this.config = {
			velocity,
			debug,
			autoIntervalID: null,
			auto: false,
			doScroll: true,
			blockZones: [],
			animationsOnScroll: []
		};
		this.app = scrollingElement;
		this.appDebugger = appDebugger;
		this.data = {
			direction: 'RIGHT',
			x: this.app.scrollLeft,
			autoScroll: false // will reflects this.config.auto, read-only data, do not use
		};

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
			this.config.doScroll = false;
		}

		console.log(this.data.x);

		// Block scroll
		if (
			this.config.blockZones.some(
				(zone) => this.data.x >= zone.min && this.data.x <= zone.max
			)
		) {
			this.config.doScroll = false;
		}

		// I don't know why I wrote this but apparently do not remove it...
		if (this.config.auto && this.data.direction === 'RIGHT') {
			this.toggleAuto();
		}

		// Kill any existing auto scroll if manually scrolling
		gsap.killTweensOf(this.app);

		this.scroll({ wheelDelta: e.wheelDelta || -e.detail });
	}

	scroll(conf = {}) {
		const { app, appDebugger, config } = this;
		const { wheelDelta, scrollTo, duration, cb } = conf;

		// scroll converter
		// -1 = RIGHT, 1 = LEFT, 0 when !wheeldelta
		const delta = config.auto
			? -1
			: !wheelDelta
			? 0
			: Math.max(-1, Math.min(1, wheelDelta));
		const scrollLeft_ = gsap.getProperty(app, 'scrollLeft');

		// Normal behaviour
		if (this.config.doScroll) {
			if (!scrollTo) {
				gsap.to(app, {
					scrollLeft: scrollLeft_ - delta * config.velocity,
					ease: 'power2.out'
				});

				// Auto Scroll to a specific position
			} else if (scrollTo && config.auto) {
				gsap.to(app, {
					scrollLeft: scrollTo,
					...(duration ? { duration } : {}),
					onComplete: () => {
						this.clearAuto();
						cb && cb();
					}
				});
			}
		}

		// Data
		this.data = {
			...this.data,
			direction: delta < 0 ? 'RIGHT' : 'LEFT',
			x: app.scrollLeft,
			autoScroll: config.auto
		};

		// Debug
		if (appDebugger) appDebugger.add('scroller', this.data);
		if (config.debug) this.log();

		// Callback any functions passed as params
		config.animationsOnScroll.forEach((tween) => tween());
	}

	log() {
		this.appDebugger.log(['scroller']);
	}

	/**
	 * Only one autoscroll can exist at a time,
	 * if try to call another autoscroll while the
	 * current autoscroll isn't yet ended, block it,
	 * or do expect bug
	 *
	 * use: this.isAutoScrolling && this.auto(...)
	 */
	isAutoScrolling() {
		return this.config.auto;
	}

	/**
	 * autoscroll to a specific position
	 * currently autoscroll from start to end is possible,
	 * but do expect bugs
	 */
	auto(scrollTo = 0, duration = 0, cb = null) {
		this.config.auto = true;
		this.config.autoIntervalID = setInterval(
			() => this.scroll({ scrollTo, duration, cb }),
			200
		);
	}

	clearAuto() {
		this.config.auto = false;
		clearInterval(this.config.autoIntervalID);
	}

	toggleAuto() {
		this.config.auto = !this.config.auto;

		if (this.config.auto) this.auto();
		else this.clearAuto();
	}

	addAnimation(tween) {
		this.config.animationsOnScroll = [...this.config.animationsOnScroll, tween];
	}

	addBlockZones(zone) {
		this.config.blockZones = [...this.config.blockZones, zone];
	}
}
