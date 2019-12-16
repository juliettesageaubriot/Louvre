/**
 * Adapted from
 * https://gist.github.com/CodeMyUI/61c2c401ce67c1673ea9e962b3949346
 * https://codepen.io/andreruffert/pen/pvqly?editors=0010
 */

import { gsap } from 'gsap';

import configs from '../../configs';

import BG from '../../assets/images/fond-scratch.jpg';
import Brush from '../../assets/images/brush-scratch.png';

const { W, H } = configs.dimensions;

const STRIDE = 32;
const MAX_FILL_AMT = 0.48;
const BRUSH_W = 74;
const BRUSH_H = 56;

export default class Scratcher {
	constructor(container) {
		this.container = container;

		this.assets = {
			bg: null,
			brush: null
		};

		this.bindit();
		this.init();
		this.doit();
	}

	bindit() {
		this.handler = this.handler.bind(this);
	}

	init() {
		this.canvas = document.createElement('canvas');
		this.canvas.width = W();
		this.canvas.height = H();
		this.ctx = this.canvas.getContext('2d');

		this.container.append(this.canvas);
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

		this.canvas.addEventListener('mousemove', this.handler);
		this.canvas.addEventListener('touchmove', this.handler);
	}

	images() {
		let bg = new Image(),
			brush = new Image();

		bg.src = BG;
		bg.style.display = 'none';
		this.container.append(bg);

		brush.src = Brush;
		brush.style.display = 'none';
		this.container.append(brush);

		bg.onload = () =>
			this.canvas.dispatchEvent(
				new CustomEvent('bgReady', { detail: { img: bg } })
			);

		brush.onload = () =>
			this.canvas.dispatchEvent(
				new CustomEvent('brushReady', { detail: { img: brush } })
			);
	}

	handler(e) {
		e.preventDefault();

		const { type } = e;
		let xy,
			doScratching = false;
		if (type === 'mousemove') {
			doScratching = this.detectClick(e);
			xy = { x: e.x, y: e.y };
		} else {
			const touch = this.detectTouch(e);
			if (touch) {
				doScratching = true;
				xy = { x: touch.clientX, y: touch.clientY };
			}
		}

		if (doScratching) this.scratch(xy);
	}

	detectClick(event) {
		if ('buttons' in event) {
			return event.buttons === 1;
		} else if ('which' in event) {
			return event.which === 1;
		} else {
			return event.button === 1;
		}
	}

	detectTouch(event) {
		return event.targetTouches[0];
	}

	scratch({ x, y }) {
		const assetsReady = this.assets.bg && this.assets.brush;

		if (assetsReady) {
			const { ctx } = this;
			const { brush } = this.assets;

			ctx.globalCompositeOperation = 'destination-out';
			ctx.drawImage(brush, x, y, BRUSH_W, BRUSH_H);

			if (this.fillAmount(STRIDE) >= MAX_FILL_AMT) {
				gsap.to(this.canvas, 2, {
					autoAlpha: 0,
					pointerEvents: 'none'
				});
			}
		}
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

		return count / total;
	}
}