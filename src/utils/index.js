const utils = {
	lerp: (start, end, amt) => {
		return (1 - amt) * start + amt * end;
	},
	closestNumber: (n, m) => {
		const q = Math.floor(n / m);
		const n1 = m * q;
		let n2;

		if (n * m > 0) {
			n2 = m * (q + 1);
		} else {
			n2 = m * (q - 1);
		}

		if (Math.abs(m - n1) < Math.abs(m - n2)) {
			return n1;
		} else {
			return n2;
		}
	},
	randomHexColorCode() {
		let n = (Math.random() * 0xfffff * 1000000).toString(16);
		return '#' + n.slice(0, 6);
	},
	extractRGB: (color) =>
		color
		.split(',')
		.map((c) => parseInt(c.match(/\d+/)))
		.filter((c) => !isNaN(c)),
	alpha: (color, opacity) => color.replace('o', opacity),
	randomIntegerInRange: (min, max) =>
		Math.floor(Math.random() * (max - min + 1)) + min,
	randomNumberInRange: (min, max) => Math.random() * (max - min) + min,
	sample: (array) => array[Math.floor(Math.random() * array.length)],
	shuffle: ([...arr]) => {
		let m = arr.length;
		while (m) {
			const i = Math.floor(Math.random() * m--);
			[arr[m], arr[i]] = [arr[i], arr[m]];
		}
		return arr;
	},
	chunk: (arr, size) =>
		Array.from({
				length: Math.ceil(arr.length / size)
			}, (v, i) =>
			arr.slice(i * size, i * size + size)
		),
	radian: () => (Math.random() * 360 * Math.PI) / 180,
	distance: (x1, y1, x2, y2) => {
		const dx = x1 - x2;
		const dy = y1 - y2;
		return Math.sqrt(dx * dx + dy * dy);
	},
	tick: (cb, t) => setTimeout(() => cb(), t)
};

export default utils;