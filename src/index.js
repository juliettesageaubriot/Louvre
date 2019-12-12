import './styles.scss';

import { gsap } from 'gsap';
import Debugger from './scripts/classes/Debugger';
import Scroller from './scripts/classes/Scroller';
import tweens from './scripts/tweens';
import configs from './configs';

const { classNames } = configs;

class App {
	constructor(debug = true, className = classNames.APP) {
		this.app = document.querySelector(className);
		this.animations = {};
		this.config = {
			debug
		};

		if (this.config.debug) {
			this.debugger = new Debugger();
			this.debugger.clear();
		}

		this.scroller = new Scroller(
			this.app.querySelector(classNames.SCENES),
			this.debugger,
			false
		);

		this.bind();
		this.events();

		this.tweens();
		this.scenes();
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
				case 'KeyS':
					this.animations.shatter.doIt();
					break;
				default:
					break;
			}
		};
		window.addEventListener('keypress', handlerKeypress);
	}

	tweens() {
		const { artemis_arrow: artemisShootsArrow, shatter } = tweens;

		this.animations.artemis = artemisShootsArrow(this.scroller);
		this.animations.shatter = shatter(this.app.querySelector(classNames.SHATTER));

		this.animations.artemis.timeline.play();

		//scene 3
		// loup qui saute sur le bouc et qui emet un son
		let loup = document.getElementById('loup');
		let cheval = document.getElementById('cheval');
		loup.addEventListener('click', () => {
			gsap.to(this.app.querySelector('#loup'), 1, {
				y: -30,
				x: 100,
				rotate: -15,
				repeat: 1,
				repeatDelay: 0,
				yoyo: true,
				ease: 1
			});
			let audio = document.getElementById('v1');
			if (audio) audio.play().catch(() => audio.play());
		});

		// loup qui grossit au hover
		loup.addEventListener('mouseover', () => {
			gsap.to(this.app.querySelector('#loup'), 1, {
				scale: 1.15,
				repeat: 1,
				repeatDelay: 0,
				yoyo: true,
				ease: 1
			});
		});

		//hover du cheval, il emet un bruit
		cheval.addEventListener('mouseover', () => {
			let audio = document.getElementById('v2');
			if (audio) audio.play().catch(() => audio.play());
		});
	}

	scenes() {
		/**
		 * Config Animations
		 */
		const targets = [...document.querySelectorAll('section')];
		const timelines = [];

		// timeline for each section
		targets.forEach((target, index) => {
			const tl = gsap.timeline({ paused: true });

			if (index === 2) {
				tl.to(target.querySelector('#oiseau'), 1, {
					rotation: -15,
					repeat: 5,
					yoyo: true,
					repeatDelay: 0,
					ease: 1
				});

				tl.to(
					target.querySelector('#loup'),
					1,
					{
						scale: 1.08
					},
					0
				);
			} else {
				null;
			}

			timelines.push(tl);
		});

		this.animations.scenes = {
			targets,
			timelines
		};

		if (this.config.debug) {
			this.debugger.add('animation', this.animations);
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
		const { targets, timelines } = this.animations.scenes;
		const animHandler = (entries, observer) => {
			entries.forEach(({ target, isIntersecting }) => {
				const i = targets.indexOf(target);
				const tl = timelines[i];

				if (isIntersecting) this.playScene(tl);
			});
		};

		/**
		 * Create observer & observe
		 */
		const observer = new IntersectionObserver(animHandler, options);
		targets.forEach((target) => observer.observe(target));
	}

	playScene(timeline) {
		if (this.scroller.data.direction === 'RIGHT') {
			timeline.play();
		} else {
			timeline.reverse();
		}
	}
}

window.onload = () => (window.app = new App());
