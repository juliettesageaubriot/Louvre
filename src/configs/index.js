const configs = {
	dimensions: {
		W: () => window.innerWidth,
		H: () => window.innerHeight
	},
	colors: {
		text: 'rgba(0, 0, 0, o)',
		bg: 'rgba(255, 255, 255, o)'
	},
	menu: [],
	font: {
		family: 'Mansalva',
		size: {},
		weight: {}
	},
	content: {},
	math: {
		PI: Math.PI,
		TWO_PI: Math.PI * 2
	},
	classNames: {
		APP: '.app',
		LOADER: '.app__overlay',
		ARROW: '.arrow',
		ARTEMIS: '.artemis',
		ARTEMIS_FRAGMENT: '.artemis__fragment',
		ARTEMIS_TEXT: '.artemis__text',
		SCENES: '.app__scenes',
		SCENES_CONTENT: '.app__scenes__wrapper',
		SCENE: '.scene',
		BICHE: '.biche',
		FLEURS: '.fleurs',
		FLEURS2: '.fleurs2',
		FLEURS3: '.fleurs3',
		BEBE: '.bebe',
		ARTEMISARC: '.artemisarc',
		SHATTER: '.shatter',
		SHATTER_OVERLAY: '.shatter__overlay',
		CURSOR: 'cursor',
		CURSOR_DEFAULT: 'cursor--default',
		CURSOR_SCRATCH: 'cursor--scratch'
	},
	classAnimations: {
		ARTEMIS: 'animation--artemis',
		BICHE: 'animation--biche',
		FLEURS: 'animation--fleurs',
		FLEURS2: 'animation--fleurs2',
		FLEURS3: 'animation--fleurs3',
		BEBE: 'animation--bebe',
		ARTEMISARC: 'animation--artemisarc',
		SHATTER: 'animation--shatter',
		LOADER: 'loading',
		GLOW: 'glow'
	},
	buttons: {
		REPLAY: '.button--replay'
	}
};

export default configs;
