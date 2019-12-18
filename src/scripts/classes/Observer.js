import IntersectionObserver from 'intersection-observer-polyfill';
import utils from '../../utils';
import configs from '../../configs';

const { isMobile, bounding } = utils;
const { W } = configs.dimensions;
const THRESHOLD = 0.4;

class CustomObserver {
	constructor(app, appScroller, boundings, cb) {
		this.app = app;
		this.appScroller = appScroller;
		this.boundings = boundings;
		this.cb = cb;
	}

	observe(target) {
		this.appScroller.addAnimation(() => {
			this.animHandler(this.evaluate(target));
		});
	}

	evaluate(target) {
		const { targets } = this.app.animations.scenes;
		const i = targets.indexOf(target);
		const { left, right } = this.boundings[i];
		const entry = {
			target,
			left,
			right,
			isIntersecting: false
		};
		const { x: scrollLeft } = this.appScroller.data;
		const scrollRight = scrollLeft + W();

		if (scrollLeft >= left * THRESHOLD && scrollRight <= right) {
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
	constructor(
		app,
		options = { root: null, rootMargin: '0px', threshold: THRESHOLD }
	) {
		this.config = {
			options
		};

		this.app = app;

		this.bindit();
		this.init();
	}

	bindit() {
		this.init = this.init.bind(this);
		this.animHandler = this.animHandler.bind(this);
		this.playScene = this.playScene.bind(this);

		window.addEventListener('resize', this.init, false);
	}

	/**
	 * Create observer & observe
	 */
	init() {
		const { options } = this.config;
		const { targets } = this.app.animations.scenes;

		this.observer = !isMobile()
			? new IntersectionObserver(this.animHandler, options)
			: new CustomObserver(
					this.app,
					this.app.scroller,
					targets.map((t) => {
						const { left, right } = bounding(t);
						return { left, right };
					}),
					this.playScene
			  );

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

	playScene(timeline, doReverse = false) {
		if (this.app.scroller.data.direction === 'RIGHT') {
			timeline.play();
		} else {
			doReverse && timeline.reverse();
		}
	}
}
