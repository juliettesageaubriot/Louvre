import { gsap } from 'gsap';
import configs from '../../configs';
import SFX from '../../assets/sons/shatter.mp3';

const { SHATTER: SHATTER_ANIM } = configs.classAnimations;
const { SHATTER, SHATTER_OVERLAY } = configs.classNames;

export default class Shatterer {
	constructor(mainScene, appScroller) {
		this.scene = mainScene;
		this.appScroller = appScroller;

		this.contents = [...document.querySelectorAll(SHATTER)];

		this.sfx = new Audio(SFX);

		this.bindit();
		// this.doit();
	}

	bindit() {
		this.scene.addEventListener('shatterend', () => {
			gsap
				.timeline()
				.to(SHATTER_OVERLAY, 1.2, { alpha: 1, pointerEvents: 'all' })
				.to(
					`${SHATTER_OVERLAY} .catchphrase`,
					1.2,
					{
						autoAlpha: 1
					},
					'<'
				)
				.to(`${SHATTER_OVERLAY} .catchphrase`, 1.2, { autoAlpha: 0 }, '>3.2')
				.to(`${SHATTER_OVERLAY} .credits`, 1.2, { autoAlpha: 1 }, '<');
		});
	}

	doit() {
		this.contents.forEach((c) => c.classList.add(SHATTER_ANIM));
		this.sfx && this.sfx.play();

		this.appScroller.setDoScroll(false);

		setTimeout(
			() => this.scene.dispatchEvent(new CustomEvent('shatterend')),
			400
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
