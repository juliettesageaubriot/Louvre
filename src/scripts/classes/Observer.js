import utils from '../../utils';

import IntersectionObserver from 'intersection-observer-polyfill';
const { isMobile, bounding } = utils;

class CustomObserver {
	constructor(app, appScroller, cb) {
		this.app = app;
		this.appScroller = appScroller;
		this.cb = cb;
	}

	observe(target) {
		this.appScroller.addAnimation(() => {
			this.animHandler(this.evaluate(target));
		});
	}

	evaluate(target) {
		const { left, right } = bounding(target);
		const entry = {
			target,
			left,
			right,
			isIntersecting: false
		};

		if (this.appScroller.data.x >= left && this.appScroller.data.x <= right) {
			entry.isIntersecting = true;
		}

		return entry;
	}

	animHandler({ target, isIntersecting }) {
		const { targets, timelines } = this.app.animations.scenes;

		const i = targets.indexOf(target);
		const tl = timelines[i];

		if (isIntersecting) this.cb(tl);
	}
}

export default class Observer {
	constructor(app, options = { root: null, rootMargin: '0px', threshold: 0.6 }) {
		this.config = {
			options
		};

		this.app = app;

		this.bindit();
		this.init();
	}

	bindit() {
		this.animHandler = this.animHandler.bind(this);
		this.playScene = this.playScene.bind(this);
	}

	/**
	 * Create observer & observe
	 */
	init() {
		const { options } = this.config;
		const { targets } = this.app.animations.scenes;

		this.observer = !isMobile()
			? new IntersectionObserver(this.animHandler, options)
			: new CustomObserver(this.app, this.app.scroller, this.playScene);

		targets.forEach((target) => this.observer.observe(target));
	}

	/**
	 * Observer handler
	 */

	animHandler(entries, observer) {
		const { targets, timelines } = this.app.animations.scenes;

		entries.forEach(({ target, isIntersecting }) => {
			const i = targets.indexOf(target);
			const tl = timelines[i];

			if (isIntersecting) this.playScene(tl);
		});
	}

	playScene(timeline) {
		if (this.app.scroller.data.direction === 'RIGHT') {
			timeline.play();
		} else {
			timeline.reverse();
		}
	}
}
