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
			this.debugger,
			false
		);

		this.bind();
		this.events();

		this.tweens();
		this.timelines();
		this.observer();
	}

	bind() {}

	events() {
		const handlerKeypress = ({ code }) => {
			console.log(code);
			switch (code) {
				case 'Space':
					this.scroller.toggleAuto();
					break;
				case 'KeyR':
					this.scroller.scroll({ to: 0 });
					break;
				default:
					break;
			}
		};
		window.addEventListener('keypress', handlerKeypress);
	}

	tweens() {
		this.animation.arrow = {
			gif: this.app.querySelector('.arrow--start'),
			arrow: this.app.querySelector('.arrow'),
			duration: 5
		};

		const { gif, arrow, duration } = this.animation.arrow;

		const timelineArrow = gsap
			.timeline({ paused: true })
			.set(arrow, { autoAlpha: 0 })
			.to(gif, { autoAlpha: 0.5 }, `+=${duration}`)
			.fromTo(
				arrow,
				{ autoAlpha: 0 },
				{ autoAlpha: 1, onComplete: () => this.scroller.auto() },
				`<-1`
			);

		timelineArrow.play();
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

			if (index === 1) {
				tl.to(target.querySelector('#antilope'), 1, { scale: 1, yoyo: true }, 0);
				tl.to(target.querySelector('#test'), 1, { scale: 4, yoyo: true }, 0);
			}

			timelines.push(tl);
		});

		this.animation.scenes = {
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
		const threshold = 0.6; // trigger
		const options = {
			root: null,
			rootMargin: '0px',
			threshold
		};

		/**
		 * Observer handler
		 */
		const { targets, timelines } = this.animation.scenes;
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
