import { gsap } from 'gsap';

const tween = (app) => {
	const { app: appDOM, scroller: appScroller } = app;
	const config = {
		gif: appDOM.querySelector('.arrow--start'),
		arrow: appDOM.querySelector('.arrow'),
		duration: 5
	};

	const { gif, arrow, duration } = config;

	const timelineArrow = gsap
		.timeline({ paused: true })
		.set(arrow, { autoAlpha: 0 })
		.to(gif, { autoAlpha: 0.5 }, `+=${duration}`)
		.fromTo(
			arrow,
			{ autoAlpha: 0 },
			{ autoAlpha: 1, onComplete: () => appScroller.auto() },
			`<-1`
		);

	timelineArrow.play();
};

export default tween;
