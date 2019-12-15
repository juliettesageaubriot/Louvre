import { gsap } from 'gsap';
import configs from '../../configs';

const { FLEURS2 } = configs.classNames;
const { FLEURS2: FLEURS2_ANIM } = configs.classAnimations;

const tween = () => {
	const fleurs2 = document.querySelector(FLEURS2);

	const play = () => {
        fleurs2.classList.remove(FLEURS2_ANIM);
        //void = assure qu'on peut replay l'animation
		void fleurs2.offsetWidth;
		fleurs2.classList.add(FLEURS2_ANIM)
		console.log('click2')
	};

	return { play };
};

export default tween;
