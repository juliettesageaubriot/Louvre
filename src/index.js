import './styles.scss';

import { gsap } from 'gsap';
import Debugger from './scripts/classes/Debugger';
import Scroller from './scripts/classes/Scroller';

class App {
	constructor(debug = true, className = '.app') {
		this.app = document.querySelector(className);
		this.animation = {};
		this.config = {
			debug
		};

		if (this.config.debug) {
			this.debugger = new Debugger();
			this.debugger.clear();
		}

		this.scroller = new Scroller(
			this.app.querySelector('.app__scenes'),
			this.debugger
		);

		this.bind();
		this.events();

		this.timelines();
		this.observer();
	}

	bind() {}

	events() {
		let test = document.getElementById('loup');
		// test.addEventListener('click', () => {
		// gsap
		// 	.timeline()
		// 	.to(this.app.querySelector('#loup'), {
		// 		bottom: '25%'
		// 	})
		// 	.to(this.app.querySelector('#loup'), {
		// 		bottom: '25%'
		// 	});

		test.addEventListener('click', () => {
			console.log('fff');
			gsap.to(this.app.querySelector('#loup'), 1, {
				y: -20,
				repeat: 1,
				repeatDelay: 0,
				yoyo: true,
				ease: 1
			});
		});
	}

	timelines() {
		/**
		 * Config Animations
		 */
		const targets = [...document.querySelectorAll('section')];
		const timelines = [];

		// timeline for each section
		targets.forEach((target, index) => {
			const tl = gsap.timeline({ paused: true });

			if (index === 2) {
				tl.to(
					target.querySelector('#oiseau'),
					1,
					{ rotation: -10, repeat: -1, yoyo: true, repeatDelay: 0.8, ease: 1 },
					0
				);
			} else {
				null;
			}

			timelines.push(tl);
		});

		this.animation = {
			targets,
			timelines
		};

		if (this.config.debug) {
			this.debugger.add('animation', this.animation);
			this.debugger.log(['animation']);
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

		/**
		 * Observer handler
		 */
		const { targets, timelines } = this.animation;
		const animHandler = (entries, observer) => {
			entries.forEach(({ target, isIntersecting }) => {
				const i = targets.indexOf(target);
				const tl = timelines[i];

				if (isIntersecting) this.animate(tl);
			});
		};

		/**
		 * Create observer & observe
		 */
		const observer = new IntersectionObserver(animHandler, options);
		targets.forEach((target) => observer.observe(target));
	}

	animate(timeline) {
		if (this.scroller.data.direction === 'RIGHT') {
			timeline.play();
		} else {
			timeline.reverse();
		}
	}
}

window.onload = () => (window.app = new App());
