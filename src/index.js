import './styles.scss';

import { gsap } from 'gsap';

class App {
	constructor(className = '.app') {
		this.app = document.querySelector(className);
		this.scrollDir = 'RIGHT';

		this.bind();
		this.events();
		this.observer();
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

		// block scroll left/right
		if (Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)) {
			return true;
		}

		const delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
		const scrollLeft_ = gsap.getProperty(this.app, 'scrollLeft');
		gsap.to(this.app, {
			scrollLeft: scrollLeft_ - delta * v,
			ease: 'power2.out'
		});

		this.scrollDir = delta < 0 ? 'RIGHT' : 'LEFT';
	}

	observer() {
		const threshold = 0.6; // trigger
		const options = {
			root: null,
			rootMargin: '0px',
			threshold: threshold
		};

		const observer = new IntersectionObserver(animHandler.bind(this), options);
		const targets = document.querySelectorAll('section');

		const ar = [].slice.call(targets);
		let animations = [];

		let count = 0;

		for (let target of ar) {
			animations[count] = gsap.timeline({ paused: true });
			observer.observe(target);
			count++;
		}

		// timeline for each section
		animations[1].to('#apple', 1, { scale: 1.4, autoAlpha: 0.5 });

		// observer handler
		function animHandler(targets, observer) {
			for (var entry of targets) {
				let i = ar.indexOf(entry.target);
				if (entry.isIntersecting) {
					console.log(entry.target, this.scrollDir);
					animations.forEach((tl) => tl.pause());
          animations[i].resume();
          if ( this.scrollDir === 'RIGHT') {
            animations[i].play();
          } else {
            animations[i].reverse();
          }
				} else {
					return;
        }
			}
		}
	}
}

window.onload = () => (window.app = new App());
