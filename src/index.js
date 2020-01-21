import './styles.scss';

import { gsap } from 'gsap';
import Debugger from './scripts/classes/Debugger';
import Scroller from './scripts/classes/Scroller';
import Scratcher from './scripts/classes/Scratcher';
import Observer from './scripts/classes/Observer';
import Shatterer from './scripts/classes/Shatterer';

import tweens from './scripts/tweens';
import configs from './configs';
import utils from './utils';

const { bounding } = utils;
const { classNames, classAnimations, buttons } = configs;

class App {
	constructor(debug = true, className = classNames.APP) {
		this.app = document.querySelector(className);
		this.animations = {};
		this.config = {
			debug
		};

		this.init();
	}

	init() {
		this.bindit();

		if (this.config.debug) {
			this.debugger = new Debugger();
			this.debugger.clear();
		}

		this.scroller = new Scroller(
			this.app.querySelector(classNames.SCENES),
			this.debugger,
			false
		);

		this.sfx = this.select('#sfx');

		this.loader(false);
		this.scenes();
		this.tweens();
		this.events();

		this.observer = new Observer(this);
	}

	bindit() {
		this.select = this.select.bind(this);
	}

	loader(isActive = true) {
		const overlay = document.querySelector(classNames.LOADER);
		if (isActive) {
			const img = overlay.querySelector('img');
			const div = overlay.querySelector('div');

			const { width, height } = bounding(img);
			gsap.set(div, { width, height });

			const tl = gsap.timeline({
				duration: 6,
				onStart: () => div.classList.add(classAnimations.LOADER),
				onUpdate: () => (img.style.opacity = tl.progress() / 2),
				onComplete: () => {
					gsap.to(img, 0.6, { alpha: 1 });
					setTimeout(() => {
						gsap.to(overlay, 1.2, { alpha: 0, scale: 2, zIndex: -999 });
					}, 600);

					this.sfx && this.sfx.play().catch(() => this.sfx.play());
				}
			});
		} else {
			gsap.set(overlay, { alpha: 0, zIndex: -999 });
		}
	}

	events() {
		const {
			artemis,
			biche,
			fleurs,
			fleurs2,
			fleurs3,
			bebe,
			artemisarc
		} = this.animations;

		const handlerKeypress = ({ code }) => {
			console.log(code);
			switch (code) {
				case 'Enter':
					!this.scroller.isAutoScrolling() && this.scroller.auto(1, 2);
					break;
				default:
					break;
			}
		};

		window.addEventListener('keypress', handlerKeypress);

		this.select('#song').addEventListener('click', () => {
			if (this.sfx) {
				if (this.sfx.paused) this.sfx.play();
				else this.sfx.pause();
			}
		});

		this.select(buttons.REPLAY).addEventListener('click', () => {
			window.location.reload(false);
		});

		this.select(classNames.ARTEMIS).parentNode.addEventListener(
			'click',
			() => artemis.shootArrow(),
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
		const {
			cta,
			artemis,
			biche,
			fleurs,
			fleurs2,
			fleurs3,
			bebe,
			artemisarc
		} = tweens;

		/**
		 * Set CTA for interactive elements
		 */
		// cta(select(classNames.ARTEMIS).parentNode);
		cta(select(classNames.BICHE).parentNode);
		cta(select(classNames.FLEURS).parentNode);
		cta(select(classNames.FLEURS2).parentNode);
		cta(select(classNames.FLEURS3).parentNode);
		cta(select(classNames.BEBE).parentNode);
		cta(select(classNames.ARTEMISARC).parentNode);

		const scrollStart = bounding(scenes[1]).x / 2 + 1;
		const scrollEnd = bounding(select('#seven')).x;
		const scrollTo = bounding(scenes[1]).x;
		this.animations.artemis = artemis(
			this.scroller,
			scrollTo,
			scrollStart,
			scrollEnd,
			2.4
		);

		this.animations.biche = biche();
		this.animations.fleurs = fleurs();
		this.animations.fleurs2 = fleurs2();
		this.animations.fleurs3 = fleurs3();
		this.animations.bebe = bebe();
		this.animations.artemisarc = artemisarc(this.animations.shatter);

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
					this.animations.scratcher = new Scratcher(target, this.scroller, () =>
						this.animations.artemis.fragmentToArt.play()
					);
					break;
				case 1:
					//apparition texte + animation différents éléments

					let textWrapper2 = document.querySelector('.span-2');
					textWrapper2.innerHTML = textWrapper2.textContent.replace(
						/\S/g,
						"<span class='letter'>$&</span>"
					);

					if ("<span class='letter'>.</span>" === true) {
						console.log('capte le point');
					} else {
						console.log('error');
					}

					scene.to(textWrapper2.querySelectorAll('span'), 1, {
						autoAlpha: 1,
						stagger: 0.05,
						ease: 1
					});

					//apparition scène

					scene.to(
						target.querySelectorAll('#loup'),
						0.5,
						{
							opacity: 1,
							repeat: 0,
							repeatDelay: 0,
							ease: 1
						},
						'<'
					),
						scene.to(
							target.querySelectorAll('#antilope'),
							0.5,
							{
								opacity: 1,
								repeat: 0,
								repeatDelay: 0,
								ease: 1
							},
							'>'
						),
						scene.to(
							target.querySelectorAll('.biche__wrapper'),
							0.5,
							{
								opacity: 1,
								repeat: 0,
								repeatDelay: 0,
								ease: 1
							},
							'>'
						),
						scene.to(
							target.querySelectorAll('#oiseau'),
							0.5,
							{
								opacity: 1
							},
							'>'
						),
						scene.to(
							target.querySelectorAll('#plante-accrochee'),
							0.5,
							{
								opacity: 1,
								repeat: 0,
								repeatDelay: 0,
								ease: 1
							},
							'>'
						),
						scene.to(
							target.querySelectorAll('#cheval'),
							0.5,
							{
								opacity: 1,
								repeat: 0,
								repeatDelay: 0,
								ease: 1
							},
							'>'
						),
						scene.to(
							target.querySelectorAll('#myrtille'),
							0.5,
							{
								opacity: 1
							},
							'<'
						),
						scene.to(
							target.querySelectorAll('#myrtille'),
							1,
							{
								rotation: 5,
								repeat: -1,
								yoyo: true,
								repeatDelay: 0,
								ease: 1
							},
							'>'
						),
						scene.to(
							target.querySelectorAll('#oiseau'),
							1,
							{
								rotation: -15,
								repeat: 5,
								yoyo: true,
								repeatDelay: 0,
								ease: 1
							},
							'<'
						),
						scene.to(
							target.querySelectorAll('#biche__wrapper'),
							1,
							{
								opacity: 1,
								repeat: 0,
								repeatDelay: 0,
								ease: 1
							},
							'<'
						);

					break;
				case 2:
					//apparition texte + animation différents éléments

					let textWrapper3 = document.querySelector('.span-3');
					textWrapper3.innerHTML = textWrapper3.textContent.replace(
						/\S/g,
						"<span class='letter'>$&</span>"
					);
					scene.to(textWrapper3.querySelectorAll('span'), 1, {
						autoAlpha: 1,
						ease: 1,
						stagger: 0.05
					});

					//apparition scène

					scene.to(
						target.querySelector('#plante-tombee'),
						0.5,
						{
							opacity: 1
						},
						'<'
					),
						scene.to(
							target.querySelector('#fleurs-fixes'),
							0.5,
							{
								opacity: 1
							},
							'>'
						),
						scene.to(
							target.querySelector('.fleurs__wrapper'),
							0.5,
							{
								opacity: 1
							},
							'>'
						),
						scene.to(
							target.querySelector('.fleurs2__wrapper'),
							0.5,
							{
								opacity: 1
							},
							'>'
						),
						scene.to(
							target.querySelector('.fleurs3__wrapper'),
							0.5,
							{
								opacity: 1
							},
							'>'
						),
						scene.to(
							target.querySelector('#plante-tombee'),
							1,
							{
								rotation: -1,
								repeat: -1,
								yoyo: true,
								repeatDelay: 0,
								ease: 1
							},
							'>'
						);

					break;

				case 3:
					//apparition texte + animation différents éléments

					let textWrapper4 = document.querySelector('.span-4');
					textWrapper4.innerHTML = textWrapper4.textContent.replace(
						/\S/g,
						"<span class='letter'>$&</span>"
					);
					scene.to(textWrapper4.querySelectorAll('span'), 1, {
						autoAlpha: 1,
						stagger: 0.05,
						ease: 1
					});

					//apparition scène
					scene.to(
						target.querySelector('#enfant'),
						1,
						{
							opacity: 1
						},
						'<'
					),
						scene.to(
							target.querySelector('#groupe-de-femme'),
							0.5,
							{
								opacity: 1
							},
							'>'
						),
						scene.to(
							target.querySelector('.bebe__wrapper'),
							0.5,
							{
								opacity: 1
							},
							'>'
						),
						scene.to(
							target.querySelector('#artemis'),
							0.5,
							{
								opacity: 1
							},
							'>'
						),
						scene.to(
							target.querySelector('#femme-penchee'),
							0.5,
							{
								opacity: 1
							},
							'>'
						),
						scene.to(
							target.querySelector('#poissons'),
							0.5,
							{
								opacity: 1
							},
							'>'
						),
						scene.to(
							target.querySelector('#enfant'),
							1,
							{
								y: '15px',
								repeat: 3,
								yoyo: true,
								repeatDelay: 0,
								ease: 1
							},
							'<'
						),
						scene.to(
							target.querySelector('#poissons'),
							1,
							{
								rotation: 10,
								x: '25px',
								repeat: -1,
								yoyo: true,
								repeatDelay: 0,
								ease: 1
							},
							'<'
						),
						scene.to(
							target.querySelector('#femme-penchee'),
							1,
							{
								rotation: 5,
								repeat: -1,
								yoyo: true,
								repeatDelay: 0,
								ease: 1
							},
							'<'
						);

					break;
				case 4:
					//apparition texte + animation différents éléments

					let textWrapper5 = document.querySelector('.span-5');
					textWrapper5.innerHTML = textWrapper5.textContent.replace(
						/\S/g,
						"<span class='letter'>$&</span>"
					);
					scene.to(textWrapper5.querySelectorAll('span'), 1, {
						autoAlpha: 1,
						stagger: 0.05,
						ease: 1
					});

					//apparition scène

					scene.to(
						target.querySelectorAll('#nuages-bas'),
						0.5,
						{
							opacity: 1
						},
						'<'
					);

					scene.to(
						target.querySelectorAll('#nuages-gauche'),
						0.5,
						{
							opacity: 1
						},
						'>'
					);

					scene.to(
						target.querySelectorAll('#nuages-droite'),
						0.5,
						{
							opacity: 1
						},
						'>'
					);

					scene.to(
						target.querySelectorAll('#poisson'),
						0.5,
						{
							opacity: 1
						},
						'>'
					);

					scene.to(
						target.querySelectorAll('#artemis'),
						0.5,
						{
							opacity: 1
						},
						'>'
					);

					scene
						.to(
							target.querySelector('#bateau'),
							2,
							{
								x: '50vh',
								opacity: 1,
								repeat: 0,
								yoyo: true,
								repeatDelay: 0,
								ease: 1
							},
							'>'
						)
						.to(
							target.querySelector('#bateau'),
							2,
							{
								rotation: '-10px',
								repeat: -1,
								yoyo: true,
								repeatDelay: 0,
								ease: 1
							},
							'>'
						)
						.to(
							target.querySelector('#vague'),
							2,
							{
								opacity: 1
							},
							'<s'
						)
						.to(
							target.querySelector('#vague'),
							2,
							{
								rotation: '-10px',
								repeat: -1,
								yoyo: true,
								repeatDelay: 0,
								ease: 1
							},
							'<'
						)

						.to(
							target.querySelector('#poisson'),
							2,
							{
								rotation: '-5px',
								x: '15px',
								y: '-5px',
								repeat: -1,
								yoyo: true,
								repeatDelay: 0,
								ease: 1
							},
							'<'
						);
					scene
						.to(
							target.querySelector('#lune'),
							2,
							{
								x: '30vh',
								y: '-22vh',
								opacity: 1,
								ease: 1
							},
							'>'
						)
						.to(
							target.querySelector('#lune'),
							2,
							{
								rotation: '-15px',
								repeat: -1,
								yoyo: true,
								repeatDelay: 0,
								ease: 1
							},
							'>'
						);

					scene.to(
						target.querySelector('#nuages-bas'),
						1,
						{
							y: '5px',
							repeat: -1,
							yoyo: true,
							repeatDelay: 0,
							ease: 1
						},
						'<'
					);

					scene.to(
						target.querySelector('#nuages-droite'),
						1,
						{
							x: '10px',
							repeat: -1,
							yoyo: true,
							repeatDelay: 0,
							ease: 1
						},
						'<'
					);

					scene.to(
						target.querySelector('#nuages-gauche'),
						1,
						{
							x: '-10px',
							y: '5px',
							repeat: -1,
							yoyo: true,
							repeatDelay: 0,
							ease: 1
						},
						'<'
					);

					break;
				case 5:
					//apparition texte + animation différents éléments

					let textWrapper6 = document.querySelector('.span-6');
					textWrapper6.innerHTML = textWrapper6.textContent.replace(
						/\S/g,
						"<span class='letter'>$&</span>"
					);

					scene.to(textWrapper6.querySelectorAll('span'), 1, {
						autoAlpha: 1,
						stagger: 0.05,
						ease: 1
					});

					//apparition scène

					scene.to(
						target.querySelectorAll('#apollon'),
						1,
						{
							opacity: 1
						},
						'<'
					);

					scene.to(
						target.querySelectorAll('#soleil'),
						1,
						{
							opacity: 1
						},
						'>'
					);

					scene.to(
						target.querySelectorAll('#nuage-droite-7'),
						1,
						{
							opacity: 1
						},
						'>'
					);

					scene.to(
						target.querySelectorAll('#nuage-gauche-7'),
						1,
						{
							opacity: 1
						},
						'>'
					);

					scene.to(
						target.querySelectorAll('#nuage-bas-7'),
						1,
						{
							opacity: 1
						},
						'>'
					);

					scene.to(
						target.querySelectorAll('#plante-7'),
						1,
						{
							opacity: 1
						},
						'>'
					);

					scene.to(
						target.querySelector('#soleil'),
						3,
						{
							x: '-50vh',
							y: '-20vh',
							ease: 1
						},
						'<'
					);
					scene
						.to(
							target.querySelector('#soleil'),
							30,
							{
								rotation: 360,
								repeat: -1,
								yoyo: true,
								repeatDelay: 0,
								ease: 1
							},
							'>'
						)
						.to(
							target.querySelector('#nuage-droite-7'),
							1,
							{
								x: '10px',
								repeat: -1,
								yoyo: true,
								repeatDelay: 0,
								ease: 1
							},
							'<'
						)
						.to(
							target.querySelector('#nuage-gauche-7'),
							1,
							{
								x: '-8px',
								repeat: -1,
								yoyo: true,
								repeatDelay: 0,
								ease: 1
							},
							'>'
						)
						.to(
							target.querySelector('#nuage-bas-7'),
							1,
							{
								y: '-10px',
								repeat: -1,
								yoyo: true,
								repeatDelay: 0,
								ease: 1
							},
							'>'
						);

					break;

				case 6:
					this.animations.shatter = new Shatterer(target, this.scroller);

					//apparition texte + animation différents éléments

					let textWrapper7 = document.querySelector('.span-7');
					textWrapper7.innerHTML = textWrapper7.textContent.replace(
						/\S/g,
						"<span class='letter'>$&</span>"
					);
					scene.to(textWrapper7.querySelectorAll('span'), 1, {
						autoAlpha: 1,
						stagger: 0.05,
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

	select(query) {
		return this.app.querySelector(query);
	}
}

window.onload = () => (window.app = new App());
