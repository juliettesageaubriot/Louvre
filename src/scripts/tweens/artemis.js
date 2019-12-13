import { gsap } from 'gsap';
import configs from '../../configs';

const { ARTEMIS, ARROW } = configs.classNames;
const { ARTEMIS: ARTEMIS_ANIM } = configs.classAnimations;

const tween = (appScroller, scrollTo = 0, duration = 0) => {
	const artemis = document.querySelector(ARTEMIS);

	const play = () => {

		gsap.set(ARROW, { autoAlpha: 0 });
		artemis.classList.remove(ARTEMIS_ANIM);

		void artemis.offsetWidth;

		artemis.classList.add(ARTEMIS_ANIM);

		artemis.addEventListener('animationend', () => {
			scrollTo && appScroller.auto(scrollTo, duration);
			gsap.set(ARROW, { autoAlpha: 1 });
		});
	};

	return { play };
};

export default tween;
