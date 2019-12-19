import configs from '../../configs';

const { CURSOR, CURSOR_DEFAULT } = configs.classNames;

export default class Cursor {
	constructor(target, customCursor = '') {
		this.target = target;
		this.customCursor = customCursor;

		this.init();
		this.bindit();
	}

	init() {
		this.cursor = document.createElement('div');
		this.cursor.classList.add(CURSOR, this.customCursor || CURSOR_DEFAULT);

		this.target.append(this.cursor);
		this.target.style.cursor = 'none';
	}

	bindit() {
		this.target.addEventListener('mousemove', ({ x, y }) => {
			this.cursor.style.left = `${x}px`;
			this.cursor.style.top = `${y}px`;
		});
	}

	dispose() {
		this.target.style.cursor = 'auto';
		this.cursor.remove();
	}
}
