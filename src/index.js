import './styles.scss';

import { gsap } from 'gsap';

class App {
	constructor(className = '.app') {
		this.app = document.querySelector(className);

		this.bind();
    this.events();
    this.observer();
	}

	bind() {
		this.horizontal = this.horizontal.bind(this);
	}

	events() {
		const { horizontal } = this;

		window.addEventListener('mousewheel', horizontal, { passive: false });
		window.addEventListener('DOMMouseScroll', horizontal, { passive: false });
	}

	horizontal(e, v = 80) {
		e = window.event || e;

		e.preventDefault();

		const delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
		const scrollLeft_ = gsap.getProperty(this.app, 'scrollLeft');
		gsap.to(this.app, {
			scrollLeft: scrollLeft_ - delta * v,
			ease: 'power2.out'
		});
  }
  
 observer() {

  const threshold = 0.7; // trigger
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: threshold
  };
  let mt = window.GreenSockGlobals = {};
  const observer = new IntersectionObserver(animHandler, options);
  const targets = document.querySelectorAll("section");

  console.log(targets)

  const ar = [].slice.call(targets); 
  let animations = []; 

  console.log(animations)

  let count = 0;

  for (let target of ar) {
    animations[count] = new TimelineMax({paused:true});  
    observer.observe(target);
    count++;
    console.log('coucou', animations[1])

}

  // timeline for each section
  animations[0]
  animations[1].to("#apple",1, {scale:1.4});

  // observer handler
  function animHandler(targets, observer) {
    for (var entry of targets) {
      let i = ar.indexOf(entry.target);
      if (entry.isIntersecting) {
        
        
        animations.forEach(tl => tl.pause(0));
        animations[i].play();

      } else {
          //return;
        animations[i].reverse();
      }
    }
  }
 }
}

window.onload = () => (window.app = new App());
