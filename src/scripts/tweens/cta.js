import { gsap } from 'gsap';
import configs from '../../configs';

const { GLOW } = configs.classAnimations;

/**
 * Set CTA for interactive elements
 */
const tween = (element) => {
	const glow = document.createElement('div');
	glow.classList.add(GLOW);

	element.prepend(glow);

	const timeline = gsap
		.timeline({ repeat: -1, yoyo: true })
		.set(glow, {
			alpha: 1
			//cursor: 'pointer'
		})
		.fromTo(glow, 3.2, { alpha: 1 }, { alpha: 0 });

	return timeline;
};

export default tween;
