import './styles.scss';

import utils from './utils';

const { drop } = utils;

class App {
	constructor(className = '.app') {
		this.app = document.querySelector(className);

		this.bind();
		this.events();
	}

	bind() {
		this.horizontal = this.horizontal.bind(this);
	}

	events() {
		this.horizontal();
	}

	horizontal() {
		if (ScrollMagic && TimelineMax && gsap) {
			const controller = new ScrollMagic.Controller();

			const horizontalSlides = new TimelineMax()
				// animate panels
				.to('.wrapper', 1, { x: '-20%' })
				.to('.wrapper', 1, { x: '-40%' })
				.to('.wrapper', 1, { x: '-60%' })
				.to('.wrapper', 1, { x: '-80%' })
				.to('.wrapper', 1, { x: '-80%' });

			// create scene to pin and link animation
			new ScrollMagic.Scene({
				triggerElement: '.app',
				triggerHook: 'onLeave',
				duration: '500%'
			})
				.setPin('.app')
				.setTween(horizontalSlides)
				.addIndicators({})
				.addTo(controller);

			drop([...document.querySelectorAll('body > div')]).forEach((d) =>
				gsap.set(d, { autoAlpha: 0 })
			);
		}
	}
}

window.onload = () => (window.app = new App());
