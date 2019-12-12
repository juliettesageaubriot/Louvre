import { gsap } from 'gsap';
import configs from '../../configs';

const { ARROW } = configs.classNames;

const tween = (appScroller) => {
	const config = {
		duration: 5
	};

	const { duration } = config;

	const timeline = gsap.timeline({ paused: true }).fromTo(
		ARROW,
		{ autoAlpha: 0 },
		{
			autoAlpha: 1,
			onComplete: () => {
				// appScroller.auto()
			}
		},
		`<${duration - 1}`
	);

	timeline.play();
};

export default tween;
