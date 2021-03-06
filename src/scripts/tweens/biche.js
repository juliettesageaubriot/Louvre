import { gsap } from 'gsap';
import configs from '../../configs';

const { BICHE } = configs.classNames;
const { BICHE: BICHE_ANIM } = configs.classAnimations;

const tween = () => {
	const biche = document.querySelector(BICHE);

	const play = () => {
        biche.classList.remove(BICHE_ANIM);
        //void = assure qu'on peut replay l'animation
		void biche.offsetWidth;
		biche.classList.add(BICHE_ANIM)
	};

	return { play };
};

export default tween;
