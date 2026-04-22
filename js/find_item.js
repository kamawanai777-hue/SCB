import {dom} from "./dom.js";
import {cachedItems, properties} from "./items_menu.js";
import {state, updateState} from "./store.js";
dom.searchField.addEventListener("input", e => {
	clearTimeout(state.timers.findItemTimer);
	const t = setTimeout(() => searchItem(e), 300);
	updateState(s => { s.timers.findItemTimer = t; });
});
dom.clearSearchButton.addEventListener("click", () => clearSearch());
function clearSearch(justClear = false) {
	dom.searchField.value = "";
	if (justClear) return;
	const show = [];
	for (const i of Object.values(cachedItems[properties.category][properties.type])) {
		if (!i.inFilter && !i.equipped) {
			show.push(i.card);
		}
	}
	requestAnimationFrame(() => {
		for (const c of show) c.classList.remove("hidden");
	});
}
function searchItem(event) {
	const guess = event.target.value;
	const arr = Object.values(cachedItems[properties.category][properties.type]);
	const hide = [], show = [];
	if (guess === "") {
		for (const i of arr) {
			if (!i.inFilter && !i.equipped) {
				show.push(i.card);
			}
		}
		requestAnimationFrame(() => {
			for (const c of show) c.classList.remove("hidden");
		});
		return;
	}
	const pattern = /\S+/g;
	const result = guess.toUpperCase().match(pattern);
	for (const i of arr) {
		if (!i.inFilter && !i.equipped) {
			if (result.every(e => i.name.toUpperCase().includes(e))) {
				show.push(i.card);
			} else {
				hide.push(i.card);
			}
		}
	}
	requestAnimationFrame(() => {
		for (const c of hide) c.classList.add("hidden");
		for (const c of show) c.classList.remove("hidden");
	});
}
export {clearSearch};