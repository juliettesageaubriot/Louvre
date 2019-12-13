import { gsap } from 'gsap';
import configs from '../../configs';

const { ARTEMIS, ARROW } = configs.classNames;

const DELAY_START_ARROW = 0.8;
const DURATION_ARTEMIS = 2.4;

const tweenArrow = (appScroller, autoScroll) => {
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

const tweenArtemis = () => {
	const duration = (time) =>
		gsap.set(ARTEMIS, { animationDuration: `${time}s` });

	const play = () => gsap.set(ARTEMIS, { animationPlayState: 'running' });

	const pause = () => gsap.set(ARTEMIS, { animationPlayState: 'paused' });

	return { duration, play, pause };
};

const tween = (appScroller, autoScroll = true) => {
	const artemis = tweenArtemis();
	const arrow = tweenArrow(appScroller, autoScroll);
	let doFireArrow = false;

	const setFireArrow = (value) => (doFireArrow = value);

	const timeline = gsap
		.timeline({ paused: true })
		.call(
			() => {
				artemis.duration(DURATION_ARTEMIS);
				artemis.play();
				setFireArrow(true);
			},
			null,
			'+=0.1'
		)
		.call(artemis.pause, null, DURATION_ARTEMIS)
		.call(
			() => {
				if (doFireArrow) {
					arrow.play();
					setFireArrow(false);
				}
			},
			null,
			DURATION_ARTEMIS - DELAY_START_ARROW
		);

	return { timeline, setFireArrow };
};

export default tween;
