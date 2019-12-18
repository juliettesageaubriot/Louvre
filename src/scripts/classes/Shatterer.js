import { gsap } from 'gsap';
import configs from '../../configs';
import SFX from '../../assets/sons/shatter.mp3';

const { SHATTER: SHATTER_ANIM } = configs.classAnimations;
const { SHATTER, SHATTER_OVERLAY } = configs.classNames;

export default class Shatterer {
	constructor(mainScene, appScroller) {
		this.scene = mainScene;
		this.appScroller = appScroller;

		this.contents = [...document.querySelectorAll(SHATTER)];

		this.sfx = new Audio(SFX);

		this.bindit();
		// this.doit();
	}

	bindit() {
		this.scene.addEventListener('shatterend', () => {
			gsap
				.timeline()
				.to(SHATTER_OVERLAY, 1.2, { alpha: 1, pointerEvents: 'all' })
				.to(
					`${SHATTER_OVERLAY} .catchphrase`,
					1.2,
					{
						autoAlpha: 1
					},
					'<'
				)
				.to(`${SHATTER_OVERLAY} .catchphrase`, 1.2, { autoAlpha: 0 }, '>3.2')
				.to(`${SHATTER_OVERLAY} .credits`, 1.2, { autoAlpha: 1 }, '<');
		});
	}

	doit() {
		this.contents.forEach((c) => c.classList.add(SHATTER_ANIM));
		this.sfx && this.sfx.play();

		this.appScroller.setDoScroll(false);

		setTimeout(
			() => this.scene.dispatchEvent(new CustomEvent('shatterend')),
			400
		);
	}
}
