import { gsap } from 'gsap';
import utils from '../../utils';
import configs from '../../configs';

const { last } = utils;
const { SHATTER: SHATTER_ANIM } = configs.classAnimations;

export default class Shatterer {
	constructor(container, appScroller) {
		this.container = container;
		this.appScroller = appScroller;
		this.contents = [...this.container.children];

		this.bindit();
		this.init();
		this.doit();
	}

	bindit() {
		let isFirst = true;
		const el = last(this.contents);
		el.addEventListener('click', () => el.classList.add(SHATTER_ANIM));
		el.addEventListener('animationend', () => {
			el.classList.remove(SHATTER_ANIM);
			if (isFirst) isFirst = false;
			else el.style.opacity = 0;
		});

		this.click(el);
	}

	init() {}

	doit() {}

	click(el) {
		// Simulate clicking on the specified element.
		triggerEvent(el, 'click');

		/**
		 * Trigger the specified event on the specified element.
		 * @param  {Object} el  the target element.
		 * @param  {String} event the type of the event (e.g. 'click').
		 */
		function triggerEvent(el, event) {
			var clickEvent = new Event(event); // Create the event.
			el.dispatchEvent(clickEvent); // Dispatch the event.
		}
	}
}
