import { gsap } from 'gsap';
import configs from '../../configs';

const { BEBE } = configs.classNames;
const { BEBE: BEBE_ANIM } = configs.classAnimations;

const tween = () => {
	const bebe = document.querySelector(BEBE);

	const play = () => {
        bebe.classList.remove(BEBE_ANIM);
        //void = assure qu'on peut replay l'animation
		void bebe.offsetWidth;
		bebe.classList.add(BEBE_ANIM)
	};

	return { play };
};

export default tween;
