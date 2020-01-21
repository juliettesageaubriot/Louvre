/**
 * Adapted from
 * https://gist.github.com/CodeMyUI/61c2c401ce67c1673ea9e962b3949346
 * https://codepen.io/andreruffert/pen/pvqly?editors=0010
 */

import { gsap } from 'gsap';
import Cursor from './Cursor';
import configs from '../../configs';

import BG from '../../assets/images/scratch-bg.png';
import Brush from '../../assets/images/scratch-brush.png';
import SFX from '../../assets/sons/scratch.mp3';

const { W, H } = configs.dimensions;
const { CURSOR_SCRATCH } = configs.classNames;

const STRIDE = 1;
const MAX_FILL_AMT = 0.32;
const BRUSH_W = 74;
const BRUSH_H = 56;

export default class Scratcher {
	constructor(container, appScroller, cb) {
		this.container = container;
		this.appScroller = appScroller;
		this.cb = cb;

		this.assets = {
			bg: null,
			brush: null,
			sfx: null
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

		this.cursor = new Cursor(this.container, CURSOR_SCRATCH);

		this.appScroller.setDoScroll(false);
	}

	doit() {
		const { width: W, height: H } = this.canvas;

		this.loadAssets();

		// https://stackoverflow.com/questions/28047792/html-canvas-scaling-image-to-fit-without-stretching
		this.canvas.addEventListener('bgReady', ({ detail }) => {
			let bgW, bgH;

			if (W < H) {
				bgW = W;
				bgH = H;
			} else {
				const ratio = detail.img.width / detail.img.height;

				bgW = W;
				bgH = bgW / ratio;
				if (bgH < H) {
					bgH = H;
					bgW = bgH * ratio;
				}
			}

			this.assets.bg = detail.img;
			this.ctx.drawImage(this.assets.bg, -(bgW - W) / 2, 0, bgW, bgH);
		});

		this.canvas.addEventListener('brushReady', ({ detail }) => {
			this.assets.brush = detail.img;
		});

		this.canvas.addEventListener('sfxReady', ({ detail }) => {
			this.assets.sfx = detail.sfx;
			this.assets.sfx.volume = 1;
		});

		this.canvas.addEventListener('mousemove', this.handler);
		this.canvas.addEventListener('touchmove', this.handler);
	}

	loadAssets() {
		let bg = new Image(),
			brush = new Image(),
			sfx = new Audio(SFX);

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

		sfx.addEventListener('loadeddata', () =>
			this.canvas.dispatchEvent(new CustomEvent('sfxReady', { detail: { sfx } }))
		);
	}

	handler(e) {
		e.preventDefault();

		const assetsReady = this.assets.bg && this.assets.brush && this.assets.sfx;
		const { type } = e;
		let xy,
			doScratching = false;

		if (assetsReady) {
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
		}

		if (doScratching) {
			this.scratch(xy);
			this.playSFX();
		} else this.pauseSFX();
	}

	playSFX() {
		this.assets.sfx && this.assets.sfx.play();
	}

	pauseSFX() {
		this.assets.sfx && this.assets.sfx.pause();
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
		const { ctx } = this;
		const { brush } = this.assets;

		ctx.globalCompositeOperation = 'destination-out';
		ctx.drawImage(brush, x, y, BRUSH_W, BRUSH_H);

		if (this.fillAmount(STRIDE) >= MAX_FILL_AMT) {
			gsap.to(this.canvas, 1.2, {
				autoAlpha: 0,
				pointerEvents: 'none',
				onComplete: () => {
					this.cb();
					this.pauseSFX();
					this.cursor.dispose();
					this.appScroller.setDoScroll(true);
				}
			});
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
