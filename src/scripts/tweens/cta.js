import { gsap } from 'gsap';

/**
 * Set CTA for interactive elements
 * (for now, just blinking effect)
 *
 * use: cta(elementNode, {options[useAplpha,...})
 * with:
 *   useAlpha: true => blinking with opacity
 *   useAlpha:false => blinking with filter: brightness
 */
const tween = (element, useAlpha = false) => {
	const from = {
		...(useAlpha
			? { alpha: 0.4 }
			: { webkitFilter: 'brightness(1.6)', filter: 'brightness(1.6)' })
	};

	const to = {
		...(useAlpha
			? { alpha: 1 }
			: { webkitFilter: 'brightness(1)', filter: 'brightness(1)' })
	};

	const timeline = gsap
		.timeline({ repeat: -1 })
		.set(element, {
			webkitFilter: 'brightness(1)',
			filter: 'brightness(1)',
			alpha: 1,
			cursor: 'pointer'
		})
		.fromTo(element, 3.2, from, to);

	const onClick = () => {
		timeline.pause(0);
		setTimeout(() => timeline.resume(), 2000);
	};

	if (element instanceof HTMLImageElement) {
		element.onclick = onClick;
	} else {
		element.addEventListener('click', onClick);
	}

	return timeline;
};

export default tween;
