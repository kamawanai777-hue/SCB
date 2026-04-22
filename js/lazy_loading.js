import {dom} from "./dom.js";
import {isDesktop} from "./other.js";
const observerOptions = {
	root: document.querySelector(".items-window__cards"),
	rootMargin: "180px",
	threshold: 0.0,
};
const observer = new IntersectionObserver(addImgPath, observerOptions);
import {state, updateState} from "./store.js";
const cacheBigIMG = {};
if (isDesktop) {
	dom.cardsContainer.addEventListener("mouseover", e => {if (e.target.classList.contains("item-card__image")) showBigIMG(e.target);});
	dom.cardsContainer.addEventListener("mouseout", e => {if (e.target.classList.contains("item-card__image")) hideBigIMG(e.target);});
	dom.equippedCardsWrapper.addEventListener("mouseover", e => {if (e.target.classList.contains("item-card__image")) showBigIMG(e.target);});
	dom.equippedCardsWrapper.addEventListener("mouseout", e => {if (e.target.classList.contains("item-card__image")) hideBigIMG(e.target);});
} else {
	dom.biggerIMGContainer.style.pointerEvents = "initial";
	dom.cardsContainer.addEventListener("click", e => {if (e.target.classList.contains("item-card__image")) showBigIMG(e.target);});
	dom.itemsWrapper.addEventListener("click", e => {if (e.target.classList.contains("items-window__bigger-img")) hideBigIMGOnTap();});
	dom.equippedCardsWrapper.addEventListener("click", e => {if (e.target.classList.contains("item-card__image")) showBigIMG(e.target);});
	dom.itemsWrapper.addEventListener("click", e => {if (e.target.closest(".items-window__bigger-img")) hideBigIMGOnTap();});
}
function addImgPath(entries, observer) {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			let image = entry.target.querySelector(".item-card__image");
			image.src = image.dataset.src;
			image.onload = () => image.classList.add("loaded");
			observer.unobserve(entry.target);
		}
	});
}
function showBigIMG(e) {
	if (!e.getAttribute("src")) return;
	const srcName = e.getAttribute("src").replace("_S", "_B");
	const token = Symbol();
	updateState(s => {
		s.ui.bigIMG = srcName;
		s.ui.bigIMGToken = token;
	});
	if (!cacheBigIMG[srcName]) {
		const img = document.createElement("img");
		img.alt = "";
		if (window.matchMedia("(max-width: 460px").matches) {
			img.width = 300;
			img.height = 300;
		} else {
			img.width = 400;
			img.height = 400;
		}
		img.style.display = "block";
		dom.biggerIMGContainer.appendChild(img);
		cacheBigIMG[srcName] = img;
		img.onload = () => {
			if (token !== state.ui.bigIMGToken) return;
			dom.biggerIMGContainer.classList.add("visible");
		}
		img.src = srcName;
	} else {
		cacheBigIMG[srcName].style.display = "block";
		dom.biggerIMGContainer.classList.add("visible");
	}
}
function hideBigIMG(e) {
	if (!e.getAttribute("src")) return;
	updateState(s => { s.ui.bigIMGToken = null; });
	dom.biggerIMGContainer.classList.remove("visible");
	const srcName = e.getAttribute("src").replace("_S", "_B");
	const entry = cacheBigIMG[srcName];
	if (entry) entry.style.display = "none";
}
function hideBigIMGOnTap() {
	if (state.ui.bigIMG && cacheBigIMG[state.ui.bigIMG]) {
		cacheBigIMG[state.ui.bigIMG].style.display = "none";
	}
	dom.biggerIMGContainer.classList.remove("visible");
}
export {observer};