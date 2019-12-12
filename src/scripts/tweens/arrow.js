import { gsap } from 'gsap';
import configs from '../../configs';

const { ARROW } = configs.classNames;

const tween = (appScroller, autoScroll) => {
	const timeline = gsap.timeline({ paused: true }).fromTo(
		ARROW,
		{ autoAlpha: 0 },
		{
			autoAlpha: 1,
			onComplete: () => autoScroll && appScroller.auto()
		}
	);

	return timeline;
};

export default tween;
