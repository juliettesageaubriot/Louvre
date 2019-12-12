import { gsap } from 'gsap';

import tweenArtemis from './artemis';
import tweenArrow from './arrow';

const DELAY_START_ARROW = 0.8;
const DURATION_ARTEMIS = 2.4;

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
