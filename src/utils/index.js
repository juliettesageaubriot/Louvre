const utils = {
	isMobile: () => /Mobi|Android/i.test(navigator.userAgent),
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
	sign: (x) => (x < 0 ? -1 : 1),
	randomIntegerInRange: (min, max) =>
		Math.floor(Math.random() * (max - min + 1)) + min,
	randomNumberInRange: (min, max) => Math.random() * (max - min) + min,
	last: (array) => array[array.length - 1],
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
		Array.from(
			{
				length: Math.ceil(arr.length / size)
			},
			(v, i) => arr.slice(i * size, i * size + size)
		),
	radian: () => (Math.random() * 360 * Math.PI) / 180,
	distance: (x1, y1, x2, y2) => {
		const dx = x1 - x2;
		const dy = y1 - y2;
		return Math.sqrt(dx * dx + dy * dy);
	},
	tick: (cb, t) => setTimeout(() => cb(), t),
	bounding: (el) => el.getBoundingClientRect(),
	click(el) {
		// Simulate clicking on the specified element.
		triggerEvent(el, 'click');

		/**
		 * Trigger the specified event on the specified element.
		 * @param  {Object} el  the target element.
		 * @param  {String} event the type of the event (e.g. 'click').
		 */
		function triggerEvent(el, event) {
			var clickEvent = new Event(event); // Create the event.
			el.dispatchEvent(clickEvent); // Dispatch the event.
		}
	}
};

export default utils;
