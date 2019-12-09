import './styles.scss';

import { gsap } from 'gsap';

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
		const { horizontal } = this;

		window.addEventListener('mousewheel', horizontal, { passive: false });
		window.addEventListener('DOMMouseScroll', horizontal, { passive: false });
	}

	horizontal(e, v = 80) {
		e = window.event || e;

		e.preventDefault();

		const delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
		const scrollLeft_ = gsap.getProperty(this.app, 'scrollLeft');
		gsap.to(this.app, {
			scrollLeft: scrollLeft_ - delta * v,
			ease: 'power2.out'
		});
	}
}

window.onload = () => (window.app = new App());
