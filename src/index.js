import './styles.scss';

import { gsap } from 'gsap';

class App {
	constructor(className = '.app') {
		this.app = document.querySelector(className);
		this.scrollDir = 'RIGHT';

		this.bind();
		this.events();
		this.observer();
	}

	bind() {
		this.horizontal = this.horizontal.bind(this);
	}

	events() {
		const { horizontal } = this;

		window.addEventListener('mousewheel', horizontal, { passive: false });
		window.addEventListener('DOMMouseScroll', horizontal, { passive: false });
	}

	horizontal(e, v = 80) {
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

		this.scrollDir = delta < 0 ? 'RIGHT' : 'LEFT';
	}

	observer() {
		/**
		 * Config Intersection Observer
		 */
		const threshold = 0.6; // trigger
		const options = {
			root: null,
			rootMargin: '0px',
			threshold
		};
		const observer = new IntersectionObserver(animHandler.bind(this), options);

		/**
		 * Config Animatons
		 */
		const targets = [...document.querySelectorAll('section')];
		const animations = [];

		targets.forEach((target) => {
			animations.push(gsap.timeline({ paused: true }));
			observer.observe(target);
		});
		// timeline for each section
		animations[1].to('#apple', 1, { scale: 1.4, autoAlpha: 0.5 });

		/**
		 * Observer handler
		 */
		function animHandler(entries, observer) {
			entries.forEach(({ target, isIntersecting }) => {
				const i = targets.indexOf(target);
				if (isIntersecting) {
					console.log(target, this.scrollDir);

					if (this.scrollDir === 'RIGHT') {
						animations[i].play();
					} else {
						animations[i].reverse();
					}
				}
			});
		}
	}
}

window.onload = () => (window.app = new App());
