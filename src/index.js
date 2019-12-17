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
		const { artemis, biche, shatter, fleurs, fleurs2, fleurs3, bebe, artemisarc} = this.animations;
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
		this.select(classNames.ARTEMIS).parentNode.addEventListener(
			'click',
			() => artemis.timeline.play(),
			false
		);
		this.select(classNames.BICHE).addEventListener(
			'click',
			() => biche.play(),
			false
		);

		this.select(classNames.FLEURS).addEventListener(
			'click', 
			() => fleurs.play(),
			false
		);

		this.select(classNames.FLEURS2).addEventListener(
			'click', 
			() => fleurs2.play(),
			false
		);

		this.select(classNames.FLEURS3).addEventListener(
			'click', 
			() => fleurs3.play(),
			false
		);
		this.select(classNames.BEBE).addEventListener(
			'click',
			() => bebe.play(),
			false
		);
		this.select(classNames.ARTEMISARC).addEventListener(
			'click',
			() => artemisarc.play(),
			false
		);
	}

	tweens() {
		const { select } = this;
		const { targets: scenes } = this.animations.scenes;
		const { cta, artemis, shatter, biche, fleurs, fleurs2, fleurs3, bebe, artemisarc } = tweens;

		/**
		 * Set CTA for interactive elements
		 */

		// cta(select(classNames.ARTEMIS).parentNode);
		// cta(select(classNames.BICHE).parentNode);
		// cta(select(classNames.FLEURS).parentNode);
		// cta(select(classNames.FLEURS2).parentNode);
		// cta(select(classNames.FLEURS3).parentNode);
		// cta(select(classNames.BEBE).parentNode);
		// cta(select(classNames.ARTEMISARC).parentNode);
		cta(select('#loup'), true);
		cta(select('#cheval'), true);

		this.animations.artemis = artemis(
			this.scroller,
			bounding(scenes[1]).x / 2 + 1,
			2.4
		);

		// cta(select(classNames.ARTEMIS).parentNode);
		cta(select('#loup'), true);
		cta(select('#cheval'), true);
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
			let scene = gsap.timeline({
				paused: true
			});

			switch (index) {
				case 0:
					// this.animations.scratcher = new Scratcher(target, this.scroller);
					break;
				case 1:

					let textWrapper2 = document.querySelector('.span-2');
					textWrapper2.innerHTML = textWrapper2.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
					scene.fromTo(
							textWrapper2.querySelectorAll("span"), 
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
									ease: 1,
									stagger: 0.05
								}
							);

					scene.to(target.querySelector('#oiseau'), 1, {
						rotation: -15,
						repeat: 5,
						yoyo: true,
						repeatDelay: 0,
						ease: 1
					});

					

					case 2:
					let textWrapper3 = document.querySelector('.span-3');
					textWrapper3.innerHTML = textWrapper3.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
					scene.fromTo(
							textWrapper3.querySelectorAll("span"), 
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
									ease: 1,
									stagger: 0.05
								}
							);
					break;
					case 3:
					let textWrapper4 = document.querySelector('.span-4');
					textWrapper4.innerHTML = textWrapper4.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
					scene.fromTo(
						textWrapper4.querySelectorAll("span"), 
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
								ease: 1,
								stagger: 0.05
							}
							);
					break;
					case 4:
						let textWrapper5 = document.querySelector('.span-5');
					textWrapper5.innerHTML = textWrapper5.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
					scene.fromTo(
						textWrapper5.querySelectorAll("span"), 
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
								ease: 1,
								stagger: 0.05
							}
							);
					break;
					case 5:
						let textWrapper6 = document.querySelector('.span-6');
					textWrapper6.innerHTML = textWrapper6.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
					scene.fromTo(
						textWrapper6.querySelectorAll("span"), 
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
								ease: 1,
								stagger: 0.05
							}
							);
					break;
					case 6:
						let textWrapper7 = document.querySelector('.span-7');
					textWrapper7.innerHTML = textWrapper7.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
					scene.fromTo(
						textWrapper7.querySelectorAll("span"), 
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
								ease: 1,
								stagger: 0.05
							}
							);
					break;

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

				//console.log(target)

				if (isIntersecting) this.playScene(tl);

				console.log(isIntersecting)
		
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
