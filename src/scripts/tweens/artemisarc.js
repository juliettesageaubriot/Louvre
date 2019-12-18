import configs from '../../configs';

const { ARTEMISARC } = configs.classNames;
const { ARTEMISARC: ARTEMISARC_ANIM } = configs.classAnimations;

const tween = (shatterer = null) => {
	const artemisarc = document.querySelector(ARTEMISARC);

	const play = () => {
		artemisarc.classList.remove(ARTEMISARC_ANIM);
		//void = assure qu'on peut replay l'animation
		void artemisarc.offsetWidth;
		artemisarc.classList.add(ARTEMISARC_ANIM);

		artemisarc.addEventListener('animationend', () => {
			if (shatterer) shatterer.doit();
		});
	};

	return { play };
};

export default tween;
