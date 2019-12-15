import { gsap } from 'gsap';
import configs from '../../configs';

const { FLEURS } = configs.classNames;
const { FLEURS: FLEURS_ANIM } = configs.classAnimations;

const tween = () => {
	const fleurs = document.querySelector(FLEURS);

	const play = () => {
        fleurs.classList.remove(FLEURS_ANIM);
        //void = assure qu'on peut replay l'animation
		void fleurs.offsetWidth;
		fleurs.classList.add(FLEURS_ANIM)
		console.log('click')
	};

	return { play };
};

export default tween;
