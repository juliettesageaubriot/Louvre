import './styles.scss';

import { gsap } from 'gsap';
import Debugger from './scripts/classes/Debugger';
import Scroller from './scripts/classes/Scroller';
import Scratcher from './scripts/classes/Scratcher';
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
		const { artemis, biche, shatter, fleurs, fleurs2 } = this.animations;
		const handlerKeypress = ({ code }) => {
			console.log(code);
			switch (code) {
				case 'Enter':
					!this.scroller.isAutoScrolling() &&
						this.scroller.auto(1, 2, () =>
							gsap.to(classNames.ARROW, 0.4, { autoAlpha: 0 })
						);
					break;
				case 'KeyS':
					shatter.doIt();
					break;
				default:
					break;
			}
		};

		window.addEventListener('keypress', handlerKeypress);
		this.select(classNames.ARTEMIS).addEventListener(
			'click',
			() => artemis.play(),
			false
		);

		this.select(classNames.BICHE).addEventListener('click', () => biche.play());

		this.select(classNames.FLEURS).addEventListener('click', () => fleurs.play());

		this.select(classNames.FLEURS2).addEventListener('click', () =>
			fleurs2.play()
		);
	}

	tweens() {
		const { select } = this;
		const { targets: scenes } = this.animations.scenes;
		const { cta, artemis, shatter, biche, fleurs, fleurs2 } = tweens;

		/**
		 * Set CTA for interactive elements
		 */
		// cta(select(classNames.ARTEMIS).parentNode);
		// cta(select(classNames.BICHE).parentNode);
		// cta(select(classNames.FLEURS).parentNode);
		// cta(select(classNames.FLEURS2).parentNode);
		// cta(select('#loup'), true);
		// cta(select('#cheval'), true);

		const { bottom, height } = bounding(select('#loup'));

		const baseline = document.createElement('div');
		const BASELINE = -100;
		baseline.classList.add('baseline');
		this.app.append(baseline);

		gsap.set(baseline, {
			position: 'fixed',
			bottom: 0,
			y: BASELINE,
			width: '100%',
			height: 2,
			zIndex: 999,
			backgroundColor: 'red'
		});
		gsap.set(select(classNames.BICHE).parentNode, {
			y: BASELINE,
			scale: 0.7,
			bottom: 0
		});
		gsap.set(select('#cheval'), {
			y: BASELINE,
			bottom: 0
		});
		gsap.set(select('#antilope'), {
			y: BASELINE,
			bottom: 0
		});
		gsap.set(select('#loup'), {
			y: BASELINE,
			bottom: 0
		});

		console.log(bounding(select('.baseline')));

		this.animations.artemis = artemis(this.scroller, bounding(scenes[1]).x, 2.4);
		this.animations.biche = biche(this.scroller, bounding(scenes[3]).x, 1);
		this.animations.fleurs = fleurs(this.scroller, bounding(scenes[4]).x, 1);
		this.animations.fleurs2 = fleurs2(this.scroller, bounding(scenes[4]).x, 1);
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
				case 0:
					this.animations.scratcher = new Scratcher(target);
					break;
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
