import { gsap, Cubic } from 'gsap';
import Delaunator from 'Delaunator';
import utils from '../../utils';
import configs from '../../configs';

const { randomNumberInRange, sign } = utils;
const { clamp } = gsap.utils;

const { TWO_PI } = configs.math;
const { W, H } = configs.dimensions;

export default class Shatterer {
	constructor(container) {
		this.container = container;
		gsap.set(this.container, { perspective: 500 });

		this.config = {
			w: W(),
			h: H(),
			vertices: [],
			indices: [],
			fragments: [],
			clickPos: [W() / 2, H() / 2]
		};

		this.bindit();
	}

	bindit() {
		this.updateClickPos = this.updateClickPos.bind(this);
		this.shatterCompleteHandler = this.shatterCompleteHandler.bind(this);

		this.container.addEventListener('click', this.updateClickPos);
	}

	doIt() {
		this.triangulate();
		this.shatter();
	}

	updateClickPos({ clientX, clientY }) {
		this.config.clickPos = [clientX, clientY];
		this.doIt();
	}

	triangulate() {
		const rings = [
				{ r: 50, c: 12 },
				{ r: 150, c: 12 },
				{ r: 300, c: 12 },
				{ r: 1200, c: 12 } // very large in case of corner clicks
			],
			{ w, h } = this.config,
			[centerX, centerY] = this.config.clickPos;
		let x, y;

		this.config.vertices.push([centerX, centerY]);

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
				this.config.vertices.push([x, y]);
			}
		});

		this.config.vertices.forEach((vertex) => {
			vertex[0] = clamp(0, w, vertex[0]);
			vertex[1] = clamp(0, h, vertex[0]);
		});

		this.config.indices = Delaunator.from(this.config.vertices).triangles;

		console.log(this.config.indices);
	}

	shatter() {
		let p0, p1, p2, fragment;
		const { indices, vertices, clickPos } = this.config;
		const tl0 = new gsap.timeline({ onComplete: this.shatterCompleteHandler });

		for (let i = 0; i < indices.length; i += 3) {
			p0 = vertices[indices[i + 0]];
			p1 = vertices[indices[i + 1]];
			p2 = vertices[indices[i + 2]];

			fragment = new Fragment(p0, p1, p2);

			var dx = fragment.centroid[0] - clickPos[0],
				dy = fragment.centroid[1] - clickPos[1],
				d = Math.sqrt(dx * dx + dy * dy),
				rx = 30 * sign(dy),
				ry = 90 * -sign(dx),
				delay = d * 0.003 * randomNumberInRange(0.9, 1.1);
			fragment.canvas.style.zIndex = Math.floor(d).toString();

			var tl1 = new gsap.timeline();

			tl1.to(fragment.canvas, 1, {
				z: -500,
				rotationX: rx,
				rotationY: ry,
				ease: Cubic.easeIn,
				backgroundColor: 'red'
			});
			tl1.to(fragment.canvas, 0.4, { alpha: 0 }, 0.6);

			tl0.add(tl1, delay);

			this.config.fragments.push(fragment);
			this.container.appendChild(fragment.canvas);
		}

		// this.container.removeChild(image);
		// image.removeEventListener('click', imageClickHandler);
	}

	shatterCompleteHandler() {
		console.log('complete');
	}
}
