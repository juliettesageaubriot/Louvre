import './styles.scss';

import { gsap } from 'gsap';
import Debugger from './scripts/classes/Debugger';

class App {
	constructor(debug = true, className = '.app') {
		this.app = document.querySelector(className);
		this.scroll = {
			direction: 'RIGHT',
			x: this.app.scrollLeft
		};
		this.config = {
			debug
		};

		if (this.config.debug) {
			this.debugger = new Debugger();
			this.debugger.clear();
		}

		this.bind();
		this.events();
		this.observer();
	}

	bind() {
		this.scroller = this.scroller.bind(this);
	}

	events() {
		const { scroller } = this;
		window.addEventListener('mousewheel', scroller, { passive: false });
		window.addEventListener('DOMMouseScroll', scroller, { passive: false });
	}

	scroller(e, v = 80) {
		e = window.event || e;

		e.preventDefault();

		// block scroll left/right
		if (Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)) {
			return true;
		}

		const delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
		const scrollLeft_ = gsap.getProperty(this.app, 'scrollLeft');
		gsap.to(this.app, {
			scrollLeft: scrollLeft_ - delta * v,
			ease: 'power2.out'
		});

		this.scroll.direction = delta < 0 ? 'RIGHT' : 'LEFT';
		this.scroll.x = this.app.scrollLeft;

		if (this.config.debug) {
			this.debugger.add('scroller', this.scroll);
			// this.debugger.log(['scroller']);
		}
	}

	observer() {
		/**
		 * Config Intersection Observer
		 */
		const threshold = 0.5; // trigger
		const options = {
			root: null,
			rootMargin: '0px',
			threshold
		};
		const observer = new IntersectionObserver(animHandler.bind(this), options);

		/**
		 * Config Animations
		 */
		const targets = [...document.querySelectorAll('section')];
		const animations = [];

		targets.forEach((target, index) => {
			const tl = gsap.timeline({ paused: true });

			// timeline for each section
			if (index === 2) {
				tl.to(
					target.querySelector('img'),
					1,
					{ scale: 2, rotation: 360, yoyo: true },
					0
				);
			} else {
				tl.to(target.querySelector('img'), 1, { scale: 1.4 }, 0);
			}

			animations.push(tl);
			observer.observe(target);
		});

		/**
		 * Observer handler
		 */
		function animHandler(entries, observer) {
			entries.forEach(({ target, isIntersecting }) => {
				const i = targets.indexOf(target);
				const tl = animations[i];

				if (isIntersecting) this.animate(tl);
			});
		}
	}

	animate(timeline) {
		if (this.scroll.direction === 'RIGHT') {
			timeline.play();
		} else {
			timeline.reverse();
		}
	}
}

window.onload = () => (window.app = new App());
