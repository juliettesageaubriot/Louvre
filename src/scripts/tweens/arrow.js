import { gsap } from 'gsap';
import configs from '../../configs';

const { ARTEMIS, ARROW } = configs.classNames;

const tween = (container, appScroller) => {
	const config = {
		artemis: container.querySelector(ARTEMIS),
		arrow: container.querySelector(ARROW),
		duration: 5
	};

	const { artemis, arrow, duration } = config;

	const timeline = gsap
		.timeline({ paused: true })
		.to(artemis, { autoAlpha: 0.5 }, `+=${duration}`)
		.fromTo(
			arrow,
			{ autoAlpha: 0 },
			{
				autoAlpha: 1,
				onComplete: () => {
					// appScroller.auto()
				}
			},
			`<-1`
		);

	timeline.play();
};

export default tween;
