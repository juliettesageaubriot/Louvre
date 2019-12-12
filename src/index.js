import './styles.scss';

import { gsap } from 'gsap';
import Debugger from './scripts/classes/Debugger';
import Scroller from './scripts/classes/Scroller';
import tweens from './scripts/tweens';

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
				default:
					break;
			}
		};
		window.addEventListener('keypress', handlerKeypress);
	}

	tweens() {
		const { arrow } = tweens;

		arrow(this);

		//scene 3
		// loup qui saute sur le bouc et qui emet un son
		let loup = document.getElementById('loup');
		let cheval = document.getElementById('cheval');
		let nuagebas = document.getElementById('nuages-bas');
		let plantetombee = document.getElementById('plante-tombee');


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
		}

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
		}

		//hover nuage bas scene 6
		nuagebas.onmouseover = () => {
			gsap.to(this.app.querySelector('#nuages-bas'), 1, {
				scale: 1.1,
				repeat: 1,
				repeatDelay: 0,
				yoyo: true,
				ease: 1
			});
		}

		//hover plante tombée bas scene 4
		plantetombee.onmouseover = () => {
			gsap.to(this.app.querySelector('#plante-tombee'), 1, {
				rotation: 0.8,
				repeat: 1,
				repeatDelay: 0,
				yoyo: true,
				ease: 1
			});
		}
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

			if (index === 4) {
				tl.to(target.querySelector('#poissons'), 1, {
					rotation: -15,
					repeat: 5,
					yoyo: true,
					repeatDelay: 0,
					ease: 1
				});

				tl.to(target.querySelector('#plante-2'), 1, {
					rotation: -10,
					repeat: -1,
					yoyo: true,
					repeatDelay: 0,
					ease: 1
				}, "<");

			} else {
				null;
			}

			if (index === 5) {

				tl.to(target.querySelector('#bateau'), 1, {
					rotation: -15,
					x: 10,
					repeat: 8,
					yoyo: true,
					repeatDelay: 0,
					ease: 1
				});

				tl.to(target.querySelector('#vague'), 1, {
					rotation: -15,
					repeat: 8,
					yoyo: true,
					repeatDelay: 0,
					ease: 1
				}, "<");

				tl.to(target.querySelector('#lune'), 1, {
					opacity: 1,
					rotation: 20,
					repeat: -1,
					yoyo: true,
					repeatDelay: 0,
					ease: 1
				}, "<");

				tl.to(target.querySelector('#nuages-droite'), 1, {
					x: 10,
					y: -3,
					repeat: 5,
					yoyo: true,
					repeatDelay: 0,
					ease: 1
				}, "<");

				tl.to(target.querySelector('#nuages-gauche'), 1, {
					y: -10,
					repeat: 8,
					yoyo: true,
					repeatDelay: 0,
					ease: 1
				}, "<");

				tl.to(target.querySelector('#nuages-bas'), 1, {
					y: -10,
					repeat: 3,
					yoyo: true,
					repeatDelay: 0,
					ease: 1
				}, "<");
			} else {
				null;
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
