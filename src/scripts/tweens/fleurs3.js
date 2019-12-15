import { gsap } from 'gsap';
import configs from '../../configs';

const { FLEURS3 } = configs.classNames;
const { FLEURS3: FLEURS3_ANIM } = configs.classAnimations;

const tween = () => {
	const fleurs3 = document.querySelector(FLEURS3);

	const play = () => {
        fleurs3.classList.remove(FLEURS3_ANIM);
        //void = assure qu'on peut replay l'animation
		void fleurs3.offsetWidth;
		fleurs3.classList.add(FLEURS3_ANIM)
	};

	return { play };
};

export default tween;
