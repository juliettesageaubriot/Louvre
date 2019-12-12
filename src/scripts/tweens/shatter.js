/**
 * Adapted from https://codepen.io/zadvorsky/pen/dILAG?editors=0010
 */
import { gsap } from 'gsap';
import Delaunator from 'Delaunator';
import utils from '../../utils';
import configs from '../../configs';

const { randomNumberInRange } = utils;
const { clamp } = gsap.utils;

const tween = (container) => {
	const { TWO_PI } = configs.math;
	const { W, H } = configs.dimensions;
	const w = W(),
		h = H();
	let vertices = [],
		indices = [],
		fragments = [];

	let clickPos = [w / 2, h / 2];

	const triangulate = () => {
		const rings = [
				{ r: 50, c: 12 },
				{ r: 150, c: 12 },
				{ r: 300, c: 12 },
				{ r: 1200, c: 12 } // very large in case of corner clicks
			],
			[centerX, centerY] = clickPos;
		let x, y;

		vertices.push([centerX, centerY]);

		rings.forEach(({ r: radius, c: count }) => {
			const variance = radius * 0.25;

			for (let i = 0; i < count; i++) {
				x =
					Math.cos((i / count) * TWO_PI) * radius +
					centerX +
					randomNumberInRange(-variance, variance);
				y =
					Math.sin((i / count) * TWO_PI) * radius +
					centerY +
					randomNumberInRange(-variance, variance);
				vertices.push([x, y]);
			}
		});

		vertices.forEach((vertex) => {
			vertex[0] = clamp(0, w, vertex[0]);
			vertex[1] = clamp(0, h, vertex[0]);
		});

		indices = Delaunator.from(vertices).triangles;

		console.log(indices);
	};

	const shatter = () => {};

	const doIt = () => {
		triangulate();
		shatter();

		console.log(clickPos);
	};

	const updateClickPos = ({ clientX, clientY }) => {
		clickPos = [clientX, clientY];
		doIt();
	};

	container.addEventListener('click', updateClickPos);

	return { doIt };
};

export default tween;
