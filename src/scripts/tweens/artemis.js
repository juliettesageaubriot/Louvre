import { gsap } from 'gsap';
import charming from 'charming';
import configs from '../../configs';

const { ARTEMIS, ARTEMIS_FRAGMENT, ARTEMIS_TEXT, ARROW } = configs.classNames;
const { ARTEMIS: ARTEMIS_ANIM } = configs.classAnimations;

const tween = (appScroller, scrollStart = 0, scrollEnd = 0, duration = 0) => {
	const artemis = document.querySelector(ARTEMIS);

	charming(document.querySelector(ARTEMIS_TEXT));

	const tweenArrow = () => {
		if (appScroller.data.x <= scrollStart || appScroller.data.x >= scrollEnd)
			gsap.to(ARROW, 0.4, { autoAlpha: 0 });
		else gsap.to(ARROW, 0.4, { autoAlpha: 1 });
	};

	appScroller.addAnimation(tweenArrow);

	const shootArrow = () => {
		// gsap.set(ARROW, { autoAlpha: 0 });
		artemis.classList.remove(ARTEMIS_ANIM);

		void artemis.offsetWidth;

		artemis.classList.add(ARTEMIS_ANIM);

		artemis.addEventListener('animationend', () => {
			scrollStart && appScroller.auto(scrollStart, duration);
			gsap.set(ARROW, { autoAlpha: 1 });
			// gsap.to(ARTEMIS_TEXT, 0.4, { autoAlpha: 0 });
		});
	};

	const fragmentToArt = gsap
		.timeline({ paused: true })
		.to(ARTEMIS_FRAGMENT, 2, { x: -130, y: -159, scale: 0.94 })
		.to(ARTEMIS, 2, { alpha: 1 }, '>-1.2')
		// .to(ARTEMIS_TEXT, 2, { alpha: 1 }, '<')
		.to(
			`${ARTEMIS_TEXT} span`,
			1,
			{
				autoAlpha: 1,
				yoyo: true,
				repeatDelay: 0,
				ease: 1,
				stagger: 0.05
			},
			'<-0.6'
		)
		.to(ARTEMIS_FRAGMENT, 2, { alpha: 0 }, '<+0.6');

	return { fragmentToArt, shootArrow };
};

export default tween;
