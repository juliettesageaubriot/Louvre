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
		ARROW: '.arrow',
		ARTEMIS: '.artemis',
		ARTEMIS_FRAGMENT: '.artemis__fragment',
		ARTEMIS_TEXT: '.artemis__text',
		SCENES: '.app__scenes',
		SCENE: '.scene',
		SCENE_CONTENT: '.scene__content',
		SHATTER: '.app__scenes__fx--shattering',
		BICHE: '.biche',
		FLEURS: '.fleurs',
		FLEURS2: '.fleurs2',
		FLEURS3: '.fleurs3',
		BEBE: '.bebe',
		ARTEMISARC: '.artemisarc'
	},
	classAnimations: {
		ARTEMIS: 'animation--artemis',
		BICHE: 'animation--biche',
		FLEURS: 'animation--fleurs',
		FLEURS2: 'animation--fleurs2',
		FLEURS3: 'animation--fleurs3',
		BEBE: 'animation--bebe',
		ARTEMISARC: 'animation--artemisarc'
	}
};

export default configs;
