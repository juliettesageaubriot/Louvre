/**
 * Adapted from
 * https://gist.github.com/CodeMyUI/61c2c401ce67c1673ea9e962b3949346
 * https://codepen.io/andreruffert/pen/pvqly?editors=0010
 */

import { gsap } from 'gsap';

import configs from '../../configs';
import utils from '../../utils';

import BG from '../../assets/images/fond-scratch.jpg';
import Brush from '../../assets/images/brush-scratch.png';

const { SCENE_CONTENT } = configs.classNames;
const { W, H } = configs.dimensions;

const { bounding } = utils;

export default class Scratcher {
	constructor(container) {
		this.dom = {
			container,
			content: container.querySelector(SCENE_CONTENT)
		};

		this.assets = {
			bg: null,
			brush: null
		};

		this.init();
		this.doit();
	}

	init() {
		this.canvas = document.createElement('canvas');
		this.canvas.width = W();
		this.canvas.height = H();
		this.ctx = this.canvas.getContext('2d');

		this.dom.container.append(this.canvas);
	}

	doit() {
		const { width: W, height: H } = this.canvas;

		this.images();

		this.canvas.addEventListener('bgReady', ({ detail }) => {
			this.assets.bg = detail.img;
			this.ctx.drawImage(this.assets.bg, 0, 0, W, H);
		});

		this.canvas.addEventListener('brushReady', ({ detail }) => {
			this.assets.brush = detail.img;
		});

		this.canvas.addEventListener('mousemove', ({ x, y }) => {
			const assetsReady = this.assets.bg && this.assets.brush;

			if (assetsReady) {
				this.draw(x, y);

				console.log(this.fillAmount(32));
				if (this.fillAmount(32) >= 32) {
					gsap.to(this.canvas, 2, { autoAlpha: 0, pointerEvents: 'none' });
				}
			}
		});
	}

	images() {
		let bg = new Image(),
			brush = new Image();

		bg.src = BG;
		bg.style.display = 'none';
		this.dom.container.append(bg);

		brush.src = Brush;
		brush.style.display = 'none';
		this.dom.container.append(brush);

		bg.onload = () =>
			this.canvas.dispatchEvent(
				new CustomEvent('bgReady', { detail: { img: bg } })
			);

		brush.onload = () =>
			this.canvas.dispatchEvent(
				new CustomEvent('brushReady', { detail: { img: brush } })
			);
	}

	draw(x, y, r = 50) {
		const { ctx } = this;
		const { brush } = this.assets;

		ctx.globalCompositeOperation = 'destination-out';
		ctx.drawImage(brush, x, y, 74, 56);
	}

	fillAmount(stride) {
		if (!stride || stride < 1) {
			stride = 1;
		}

		const pixels = this.ctx.getImageData(
				0,
				0,
				this.canvas.width,
				this.canvas.height
			),
			pdata = pixels.data,
			l = pdata.length,
			total = l / stride;
		let count = 0;

		// Iterate over all pixels
		for (let i = (count = 0); i < l; i += stride) {
			if (parseInt(pdata[i]) === 0) {
				count++;
			}
		}

		return Math.round((count / total) * 100);
	}
}
