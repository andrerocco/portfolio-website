gsap.registerPlugin(ScrollTrigger); /* Coloque a <div id="content"> dentro de uma <div id="viewport"> (servirá como viewport) */
smoothScroll("#content"); /* Essa define a <div id="content"> como o "scroller" padrão */
gsap.registerPlugin(CSSPlugin);

// this is the helper function that sets it all up. Pass in the content <div> and then the wrapping viewport <div> (can be the elements or selector text). It also sets the default "scroller" to the content so you don't have to do that on all your ScrollTriggers.
function smoothScroll(content, viewport, smoothness) {
	content = gsap.utils.toArray(content)[0];
	smoothness = smoothness || 1;

	gsap.set(viewport || content.parentNode, {overflow: "hidden", position: "fixed", height: "100%", width: "100%", top: 0, left: 0, right: 0, bottom: 0});
	gsap.set(content, {overflow: "visible", width: "100%"});

	let getProp = gsap.getProperty(content),
		setProp = gsap.quickSetter(content, "y", "px"),
		setScroll = ScrollTrigger.getScrollFunc(window),
		removeScroll = () => content.style.overflow = "visible",
		killScrub = trigger => {
			let scrub = trigger.getTween ? trigger.getTween() : gsap.getTweensOf(trigger.animation)[0]; // getTween() was added in 3.6.2
			scrub && scrub.kill();
			trigger.animation.progress(trigger.progress);
		},
		height, isProxyScrolling;

	function refreshHeight() {
		height = content.clientHeight;
		content.style.overflow = "visible"
		document.body.style.height = height + "px";
    return height - document.documentElement.clientHeight;
	}

	ScrollTrigger.addEventListener("refresh", () => {
		removeScroll();
		requestAnimationFrame(removeScroll);
	})
	ScrollTrigger.defaults({scroller: content});
	ScrollTrigger.prototype.update = p => p; // works around an issue in ScrollTrigger 3.6.1 and earlier (fixed in 3.6.2, so this line could be deleted if you're using 3.6.2 or later)

	ScrollTrigger.scrollerProxy(content, {
		scrollTop(value) {
			if (arguments.length) {
				isProxyScrolling = true; // otherwise, if snapping was applied (or anything that attempted to SET the scroll proxy's scroll position), we'd set the scroll here which would then (on the next tick) update the content tween/ScrollTrigger which would try to smoothly animate to that new value, thus the scrub tween would impede the progress. So we use this flag to respond accordingly in the ScrollTrigger's onUpdate and effectively force the scrub to its end immediately.
				setProp(-value);
				setScroll(value);
				return;
			}
			return -getProp("y");
		},
    scrollHeight: () => document.body.scrollHeight,
		getBoundingClientRect() {
			return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
		}
	});

	return ScrollTrigger.create({
		animation: gsap.fromTo(content, {y:0}, {
			y: () => document.documentElement.clientHeight - height,
			ease: "none",
			onUpdate: ScrollTrigger.update
		}),
		scroller: window,
		invalidateOnRefresh: true,
		start: 0,
		end: refreshHeight,
    refreshPriority: -999,
		scrub: smoothness,
		onUpdate: self => {
			if (isProxyScrolling) {
				killScrub(self);
				isProxyScrolling = false;
			}
		},
		onRefresh: killScrub // when the screen resizes, we just want the animation to immediately go to the appropriate spot rather than animating there, so basically kill the scrub.
	});
}
/* -------- <SMOOTH SCROLL SETUP -------- */


/* -------- GRAINED EFFECT> -------- */
let options = {
    "animate": true,
  	"patternWidth": 100,
  	"patternHeight": 100,
  	"grainOpacity": 0.08,
  	"grainDensity": 1,
  	"grainWidth": 1,
  	"grainHeight": 1
}
grained('#grained-overlay',options)
/* -------- <GRAINED EFFECT -------- */


/* -------- MEMOJI> -------- */
let memoji = document.querySelector('#memoji')
memoji.addEventListener('mouseover', (e) => {
	let min = 2;
	let max = 9;
	let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
	
	let imageURL = `sources/images/${randomNum.toString().padStart(3, '0')}.png`
	memoji.src = imageURL
});
memoji.addEventListener('mouseout', (e) => {
	memoji.src = "sources/images/001.png"
});
memoji.addEventListener('click', (e) => {
	memoji.src = "sources/images/explode.png"
})
/* -------- <MEMOJI -------- */


/* -------- DRAGGABLE GRID 1> -------- */
const slider1 = document.querySelector('#drag1');
let isDown1 = false;
let startX1;
let scrollLeft1;

slider1.addEventListener('mousedown', (e) => {
  	isDown1 = true;
  	slider1.classList.add('active');
  	startX1 = e.pageX - slider1.offsetLeft;
  	scrollLeft1 = slider1.scrollLeft;
  	cancelMomentumTracking();
});
slider1.addEventListener('mouseleave', () => {
  	isDown1 = false;
  	slider1.classList.remove('active');
});
slider1.addEventListener('mouseup', () => {
  	isDown1 = false;
  	slider1.classList.remove('active');
  	beginMomentumTracking();
});
slider1.addEventListener('mousemove', (e) => {
  	if(!isDown1) return;
  	e.preventDefault();
  	const x = e.pageX - slider1.offsetLeft;
  	const walk = (x - startX1)/*  * 1.5*/; //scroll-fast
  	var prevScrollLeft = slider1.scrollLeft;
  	slider1.scrollLeft = scrollLeft1 - walk;
  	velX = slider1.scrollLeft - prevScrollLeft;
});
// Momentum 
var velX = 0;
var momentumID;

slider1.addEventListener('wheel', (e) => {
  	cancelMomentumTracking();
});  
function beginMomentumTracking(){
  	cancelMomentumTracking();
  	momentumID = requestAnimationFrame(momentumLoop);
}
function cancelMomentumTracking(){
  	cancelAnimationFrame(momentumID);
}
function momentumLoop(){
  	slider1.scrollLeft += velX;
  	velX *= 0.95; 
  	if (Math.abs(velX) > 0.5){
		momentumID = requestAnimationFrame(momentumLoop);
  	}
}
/* -------- DRAGGABLE GRID 2> -------- */
const slider2 = document.querySelector('#drag2');
let isDown2 = false;
let startX2;
let scrollLeft2;

slider2.addEventListener('mousedown', (e) => {
  	isDown2 = true;
  	slider2.classList.add('active');
  	startX2 = e.pageX - slider2.offsetLeft;
  	scrollLeft2 = slider2.scrollLeft;
  	cancelMomentumTracking2();
});
slider2.addEventListener('mouseleave', () => {
  	isDown2 = false;
  	slider2.classList.remove('active');
});
slider2.addEventListener('mouseup', () => {
  	isDown2 = false;
  	slider2.classList.remove('active');
  	beginMomentumTracking2();
});
slider2.addEventListener('mousemove', (e) => {
  	if(!isDown2) return;
  	e.preventDefault();
  	const x2 = e.pageX - slider2.offsetLeft;
  	const walk2 = (x2 - startX2)/*  * 1.5*/; //scroll-fast
  	var prevScrollLeft2 = slider2.scrollLeft;
  	slider2.scrollLeft = scrollLeft2 - walk2;
  	velX2 = slider2.scrollLeft - prevScrollLeft2;
});

// Momentum 
var velX2 = 0;
var momentumID2;

slider2.addEventListener('wheel', (e) => {
  	cancelMomentumTracking2();
});  
function beginMomentumTracking2(){
  	cancelMomentumTracking2();
  	momentumID2 = requestAnimationFrame(momentumLoop2);
}
function cancelMomentumTracking2(){
  	cancelAnimationFrame(momentumID2);
}
function momentumLoop2(){
  	slider2.scrollLeft += velX2;
  	velX2 *= 0.95; 
  	if (Math.abs(velX2) > 0.5){
		momentumID2 = requestAnimationFrame(momentumLoop2);
  	}
}
/* -------- <DRAGGABLE GRID -------- */


/* -------- HOME GSAP ANIMATIONS> -------- */
gsap.to("#andre-rocco-gsap", {
	x: '-400',
	scrollTrigger: {
		trigger: '#viewport',
		start: "top top",
		end: "+=500",
		scrub: true,
		/* markers: true, */
	},
}); // Torna o texto "Andre Rocco" responsivo ao scroll

gsap.from('#text-designer div', {
	x: 160,
	opacity: 0,
	duration: 0.8,
	stagger: 0.1,
	ease: "power2.out"
})
gsap.from('#text-developer div', {
	x: 160,
	opacity: 0,
	duration: 0.8,
	stagger: 0.1,
	ease: "power2.out",
	delay: 1.2
})

gsap.from('#text-about-me', {
	opacity: 0.3,
	x: 100,
	skewX: -7,
	duration: 1.2,
	scrollTrigger: {
		trigger: '#text-about-me',
		start: "top bottom",
	}
})

gsap.from('#label-works', {
	x: -300,
	skewX: 20,
	opacity: 0,
	duration: 3,
	ease: "expo.out",
	scrollTrigger: {
		trigger: '#label-works',
		start: "top bottom",
	},
});

gsap.from('.works-list-itens', {
	x: -600,
	scrollTrigger: {
		trigger: '#works',
		start: "top bottom",
		end: "bottom+=60 top" ,
		scrub: true,
		/* markers: true, */
	},
	stagger: 0.06,
});
gsap.from('.works-list-itens', {
	opacity: 0,
	durantion: 2,
	scrollTrigger: {
		trigger: ".works-list-itens"
	},
	stagger: 0.2,
});

gsap.to('#expertises-programming', {
	x: -100,
	skewX: -17,
	scrollTrigger: {
		trigger: '#expertises-programming',
		start: "top bottom",
		end: "bottom top",
		scrub: true,
	}
});
gsap.to('#expertises-designing', {
	x: 100,
	skewX: 17,
	scrollTrigger: {
		trigger: '#expertises-designing',
		start: "top bottom",
		end: "bottom top",
		scrub: true,
	}
});


// Texto de contato no final da página
gsap.from('#text-contact div', {
	y: 200,
	duration: 1.3,
	scrollTrigger: {
		trigger: '#text-contact div',
		start: "bottom bottom"
	},
	ease: "power3.out",
	stagger: 0.07
})
// Email de contato no final da página
gsap.from('#text-email-gsap', {
	y: 100,
	duration: 2,
	delay: 0.5,
	scrollTrigger: {
		trigger: '#text-email-gsap',
		start: "bottom bottom"
	},
	ease: "back.out(1.7)"
})
gsap.from('.underline', {
	css: { 
		width: 0, 
	},
	duration: 2,
	delay: 2,
	scrollTrigger: {
		trigger: '#text-email-gsap',
		start: "bottom bottom"
	},
	ease: "power3.out"
}) // Width do traçado
gsap.from('.underline', {
	opacity: 0,
	duration: 2,
	delay: 2,
	scrollTrigger: {
		trigger: '#text-contact div',
		start: "bottom bottom"
	},
	ease: "power1.out"
}) // Opacidade do traçado

gsap.from('#bottom-social-media div', {
	y: 30,
	skewY: 10,
	duration: 1.2,
	delay: 0.3,
	scrollTrigger: {
		trigger: '#bottom-social-media div',
		start: "top bottom"
	},
	stagger: 0.7,
	ease: "power4.out"
})

/* ease: "back.out(1.7)" */
/* -------- <HOME GSAP ANIMATIONS -------- */
