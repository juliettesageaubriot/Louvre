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
		family: 'Montserrat',
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
		SCENES: '.app__scenes',
		SCENE: '.scene',
		SCENE_CONTENT: '.scene__content',
		SHATTER: '.app__scenes__fx--shattering',
		BICHE: '.biche',
		FLEURS: '.fleurs',
		FLEURS2: '.fleurs2'
	},
	classAnimations: {
		ARTEMIS: 'animation--artemis',
		BICHE: 'animation--biche',
		FLEURS: 'animations--fleurs',
		FLEURS2: 'animations--fleurs2'
	}
};

export default configs;
