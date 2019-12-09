 import "./styles.scss";
// // console.log("hello world!");
TweenLite.defaultEase = Linear.easeNone;
var titles = document.querySelectorAll(".sectionTitle");
var controller = new ScrollMagic.Controller();
var tl = new TimelineMax();

// create timeline
// this could also be created in a loop
tl.to("#js-slideContainer", 1, {xPercent: -20}, "label1");
tl.from(titles[1], 0.5, {opacity:0}, "label1+=0.5");
tl.to("#js-slideContainer", 1, {xPercent: -40}, "label2");
tl.from(titles[2], 0.5, {opacity:0}, "label2+=0.5");
tl.to("#js-slideContainer", 1, {xPercent: -60}, "label3");
tl.from(titles[3], 0.5, {opacity:0}, "label3+=0.5");
tl.to("#js-slideContainer", 1, {xPercent: -80}, "label4");
tl.from(titles[4], 0.5, {opacity:0}, "label4+=0.5");


new ScrollMagic.Scene({
  triggerElement: "#js-wrapper",
  triggerHook: "onLeave",
  duration: "400%"
})
  .setPin("#js-wrapper")
  .setTween(tl)
  .addIndicators({
    colorTrigger: "white",
    colorStart: "white",
    colorEnd: "white",
  })
  .addTo(controller);
  