import { gsap } from 'gsap';
import configs from '../../configs';

const { ARTEMIS } = configs.classNames;

const tween = () => {
	const duration = (time) =>
		gsap.set(ARTEMIS, { animationDuration: `${time}s` });

	const play = () => gsap.set(ARTEMIS, { animationPlayState: 'running' });

	const pause = () => gsap.set(ARTEMIS, { animationPlayState: 'paused' });

	return { duration, play, pause };
};

export default tween;
