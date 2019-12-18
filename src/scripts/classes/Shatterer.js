import { gsap } from 'gsap';
import configs from '../../configs';

const { SHATTER: SHATTER_ANIM } = configs.classAnimations;
const { SHATTER, SHATTER_OVERLAY } = configs.classNames;

export default class Shatterer {
	constructor(container, appScroller) {
		this.container = container;
		this.appScroller = appScroller;

		this.content = this.container.querySelector(SHATTER);

		this.bindit();
		// this.doit();
	}

	bindit() {
		this.content.addEventListener('shatterend', () => {
			this.content.classList.remove(SHATTER_ANIM);
			void this.content.offsetWidth;
			gsap
				.timeline()
				.to(SHATTER_OVERLAY, 1.2, { alpha: 1, pointerEvents: 'all' })
				.to(
					`${SHATTER_OVERLAY} > div:last-of-type`,
					1.2,
					{ autoAlpha: 0 },
					'+=3.2'
				);
		});
	}

	doit() {
		this.content.classList.add(SHATTER_ANIM);
		this.appScroller.setDoScroll(false);

		setTimeout(
			() => this.content.dispatchEvent(new CustomEvent('shatterend')),
			2400
		);
	}

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
