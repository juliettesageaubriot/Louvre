import { gsap } from 'gsap';
import configs from '../../configs';

const { ARTEMISARC } = configs.classNames;
const { ARTEMISARC: ARTEMISARC_ANIM } = configs.classAnimations;

const tween = () => {
	const artemisarc = document.querySelector(ARTEMISARC);

	const play = () => {
        artemisarc.classList.remove(ARTEMISARC_ANIM);
        //void = assure qu'on peut replay l'animation
		void artemisarc.offsetWidth;
		artemisarc.classList.add(ARTEMISARC_ANIM)
	};

	return { play };
};

export default tween;
