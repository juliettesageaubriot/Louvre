import { gsap } from 'gsap';
import configs from '../../configs';

const { ARTEMIS, ARTEMIS_FRAGMENT, ARROW } = configs.classNames;
const { ARTEMIS: ARTEMIS_ANIM } = configs.classAnimations;

const tween = (appScroller, scrollTo = 0, duration = 0) => {
	const artemis = document.querySelector(ARTEMIS);

	const tweenArrow = () => {
		if (appScroller.data.x <= scrollTo / 4) gsap.to(ARROW, 0.4, { autoAlpha: 0 });
		else gsap.to(ARROW, 0.4, { autoAlpha: 1 });
	};

	appScroller.addAnimation(tweenArrow);

	const shootArrow = () => {
		// gsap.set(ARROW, { autoAlpha: 0 });
		artemis.classList.remove(ARTEMIS_ANIM);

		void artemis.offsetWidth;

		artemis.classList.add(ARTEMIS_ANIM);

		artemis.addEventListener('animationend', () => {
			scrollTo && appScroller.auto(scrollTo, duration);
			gsap.set(ARROW, { autoAlpha: 1 });
		});
	};

	const fragmentToArt = gsap
		.timeline({ paused: true })
		.to(ARTEMIS_FRAGMENT, 2, { x: -130, y: -159, scale: 0.94 })
		.to(ARTEMIS, 2, { alpha: 1 }, '>-1.2')
		.to(ARTEMIS_FRAGMENT, 2, { alpha: 0 }, '>-0.6');

	return { fragmentToArt, shootArrow };
};

export default tween;
