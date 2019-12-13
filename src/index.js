import './styles.scss';

import { gsap } from 'gsap';
import Debugger from './scripts/classes/Debugger';
import Scroller from './scripts/classes/Scroller';
import tweens from './scripts/tweens';
import configs from './configs';
import utils from './utils';

const { bounding } = utils;
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

		this.scenes();
		this.tweens();
		this.observer();
		this.events();
	}

	bind() {
		this.select = this.select.bind(this);
	}

	events() {
		const { artemis, shatter } = this.animations;
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
					shatter.doIt();
					break;
				default:
					break;
			}
		};

		window.addEventListener('keypress', handlerKeypress);
		this.select(classNames.ARTEMIS).addEventListener('click', () =>
			artemis.play()
		);
	}

	tweens() {
		const { select } = this;
		const { targets: scenes } = this.animations.scenes;
		const { cta, artemis, shatter } = tweens;

		/**
		 * Set CTA for interactive elements
		 */
		cta(select(classNames.ARTEMIS).parentNode);
		cta(select('#loup'), true);
		cta(select('#cheval'), true);

		this.animations.artemis = artemis(this.scroller, bounding(scenes[1]).x, 2.4);
		this.animations.shatter = shatter(this.app.querySelector(classNames.SHATTER));

		//scene 3
		// loup qui saute sur le bouc et qui emet un son
		let loup = document.getElementById('loup');
		let cheval = document.getElementById('cheval');
		loup.onclick = () => {
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
		};

		// loup qui grossit au hover
		loup.onmouseover = () => {
			gsap.to(this.app.querySelector('#loup'), 1, {
				scale: 1.15,
				repeat: 1,
				repeatDelay: 0,
				yoyo: true,
				ease: 1
			});
		};

		//hover du cheval, il emet un bruit
		cheval.onmouseover = () => {
			let audio = document.getElementById('v2');
			if (audio) audio.play().catch(() => audio.play());
		};
	}

	scenes() {
		/**
		 * Config Animations
		 */
		const targets = [...document.querySelectorAll('section')];
		const timelines = [];

		// timeline for each section
		targets.forEach((target, index) => {
			let scene = gsap.timeline({ paused: true });

			switch (index) {
				case 2:

					scene.fromTo(
						target.querySelector('.texte'), 
							1,
							{
								autoAlpha: 0,
								yoyo: true,
								repeatDelay: 0,
								ease: 1
							},
							{	
								autoAlpha: 1,
								yoyo: true,
								repeatDelay: 0,
								ease: 1
							}
						);

					scene.to(target.querySelector('#oiseau'), 1, {
						rotation: -15,
						repeat: 5,
						yoyo: true,
						repeatDelay: 0,
						ease: 1
					});
						
					break;
				default:
					break;
			}

			timelines.push(scene);
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

	select(query) {
		return this.app.querySelector(query);
	}
}

window.onload = () => (window.app = new App());
