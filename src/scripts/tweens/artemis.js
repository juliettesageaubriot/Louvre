import { gsap } from 'gsap';
import configs from '../../configs';

const { ARTEMIS } = configs.classNames;
const { H: WINDOW_H } = configs.dimensions;

const SPRITE_W = 530;
const SPRITE_H = 662;

const tween = () => {
	const artemis = document.querySelector(ARTEMIS);
	const width = (SPRITE_W * WINDOW_H) / SPRITE_H;

	// const { app: appDOM, scroller: appScroller } = app;
	// const config = {
	// 	artemis: appDOM.querySelector(ARTEMIS),
	// 	arrow: appDOM.querySelector(ARROW),
	// 	duration: 5
	// };

	// const { artemis, arrow, duration } = config;

	const timeline = gsap.timeline({ paused: true }).set(artemis, { width });

	timeline.play();
};

export default tween;
