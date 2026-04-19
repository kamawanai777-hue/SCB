import {Items} from "./items_constructor.js";
import {dom} from "./dom.js";
import {observer} from "./lazy_loading.js";
import {toggleMenu} from "./main_win.js";
import {state, updateState} from "./store.js";
import {clearSearch} from "./find_item.js";
import {closeAllItemsDetails, closeInventory} from "./equip_items.js";
const cachedItems = {};
const checkedFilterOptions = [];
const webpURL = "https://vzhhub.github.io/SCB-webp/imagesWebP/";
const properties = {
	category: undefined,
	type: undefined,
};
const itemsOrder = {
	name: {},
	weight: {},
	other: {},
};
const activeSortButton = {
	name: true,
	weight: false,
	other: false,
};
const filterCategories = {
	bodyPart: document.querySelector(".filter-window__fieldset--body-part"),
	smithingPerks: document.querySelector(".filter-window__fieldset--smithing"),
	tempering: document.querySelector(".filter-window__fieldset--tempering"),
	magicSchool: document.querySelector(".filter-window__fieldset--magic-school"),
	cannotWearHelmet: document.querySelector(".filter-window__fieldset--helmet"),
};
dom.filterWindow.addEventListener("click", e => {e.stopPropagation();});
dom.itemsWindowItems.addEventListener("click", e => {e.stopPropagation();});
dom.equippedCards.addEventListener("click", e => {e.stopPropagation();});
dom.chooseHandContainer.addEventListener("click", e => {e.stopPropagation();});
dom.sortByName.addEventListener("click", () => {sortBy("name", "nameIndex")});
dom.sortByWeight.addEventListener("click", () => {sortBy("weight", "weightIndex")});
dom.sortByOther.addEventListener("click", () => {sortBy("other", "")});
dom.sortButtons.forEach(e => e.addEventListener("click", selectSortingButton));
dom.filterButton.addEventListener("click", filterToggle);
dom.closeFilter.addEventListener("click", filterToggle);
for (const i of dom.checkboxes) i.addEventListener("click", showChosenFilterOptions);
dom.menuOptions.addEventListener("click", e => {
	const button = e.target.closest(".category-button--items");
	if (!button) return;
	openCategory(button);
});
dom.menuOptions.addEventListener("click", e => {
	const button = e.target.closest("[data-open-items]");
	if (!button) return;
	openItems();
});
for (const i of dom.typeButtons) {
	i.addEventListener("click", oneTimeFunction, {once: true});
}
dom.closeItemsButton.addEventListener("click", hideItems);
function openItems() {
	dom.overlay.classList.remove("hidden");
	dom.itemsWindow.classList.remove("hidden");
	dom.cardsList.scrollTop = 0;
}
function oneTimeFunction (event) {
	properties.type = event.target.innerText;
	const category = properties.category, type = properties.type;
	itemsOrder.name[category][type] = true;
	itemsOrder.weight[category][type] = false;
	itemsOrder.other[category][type] = false;
	Items.makeItem(category, type);
	makeCards();
	toggleMenu();
	updateState(s => { s.ui.itemsOpen = !s.ui.itemsOpen; });
	event.target.addEventListener("click", openResults);
}
function openCategory(button) {
	properties.category = button.textContent;
	setPropertiesForSorting();
	const nextButtonClass = button.nextElementSibling.classList;
	const isClose = nextButtonClass.contains("hidden");
	const buttonParent = button.parentElement;
	if (!isClose) {
		buttonParent.style.order = "";
		nextButtonClass.add("hidden");
		return
	}
	menuToDefaultView();
	if (buttonParent.style.order !== "-1") buttonParent.style.order = "-1";
	if (isClose) nextButtonClass.remove("hidden");
	dom.menuOptions.scrollTop = "0";
}
function menuToDefaultView() {
	for (const i of dom.categoryContainers) i.style.order = "";
	for (const i of dom.typeContainers) i.classList.add("hidden");
}
function setPropertiesForSorting() {
	const category = properties.category;
	if (!itemsOrder.name[category]) {
		itemsOrder.name[category] = {};
		itemsOrder.weight[category] = {};
		itemsOrder.other[category] = {};
	}
}
function makeCards() {
	const category = properties.category, type = properties.type;
	dom.itemWindowHeader.innerText = category.toUpperCase() + ": " + type.toUpperCase();
	const docFrag = document.createDocumentFragment();
	const arr = Object.values(cachedItems[category][type]);
	for (let i = 0, arrLen = arr.length; i < arrLen; i++) {
		const node = dom.itemsTemplate.content.cloneNode(true);
		const itemCard = node.querySelector(".item-card");
		observer.observe(itemCard);
		const item = arr[i];
		item.card = itemCard;
		node.querySelector(".item-card__description").textContent = item.description;
		node.querySelector(".item-card__name").textContent = item.name;
		node.querySelector(".item-card__weight").textContent = item.weight;
		node.querySelector(".item-card__equip-button").setAttribute("data-item-name", item.name);
		const itemMiniature = node.querySelector(".item-card__image");
		const itemPicName = item.name.match(/\S+/g).join("_").toLowerCase();
		const smallMiniatureName = itemPicName + "_S";
		const mediumMiniatureName = itemPicName + "_M";
		const bigMiniatureName = itemPicName + "_B";
		const smallMiniaturePath = `${webpURL}${smallMiniatureName}.webp`;
		const mediumMiniaturePath = `${webpURL}${mediumMiniatureName}.webp`;
		const bigMiniaturePath = `${webpURL}${bigMiniatureName}.webp`;
		item.pathS = smallMiniaturePath;
		item.pathM = mediumMiniaturePath;
		item.pathB = bigMiniaturePath;
		itemMiniature.dataset.src = smallMiniaturePath;
		itemMiniature.dataset.imgName = item.name;
		item.img = itemMiniature;
		const rating = node.querySelector(".item-card__rating");
		switch (item.category) {
			case "Weapons":
				rating.textContent = item.damage;
				break;
			case "Staves":
				break;
			default:
				rating.textContent = item.armorRating;
		}
		docFrag.appendChild(node);
	}
	dom.cardsList.appendChild(docFrag);
	nameSortButtons();
}
function cacheItems(category, type) {
	if (!cachedItems[category]) cachedItems[category] = {}; 
	if (!cachedItems[type]) cachedItems[category][type] = {};
}
function nameSortButtons() {
	const category = properties.category;
	if (category === "Weapons") {
		dom.sortByOtherName.textContent = "Damage";
	} else if (category !== "Staves") {
		dom.sortByOtherName.textContent = "Armor";
	}
}
function openResults() {
	dom.cardsList.scrollTop = 0;
	properties.type = this.innerText;
	dom.itemWindowHeader.innerText = properties.category.toUpperCase() + ": " + properties.type.toUpperCase();
	showThisTypeItems();
	nameSortButtons();
	toggleMenu();
	updateState(s => { s.ui.itemsOpen = !s.ui.itemsOpen; });
}
function toDefaultSortingOrder() {
	const fragment = document.createDocumentFragment();
	const category = properties.category, type = properties.type;
	const arr = Object.values(cachedItems[category][type]);
	if (!itemsOrder.name[category][type]) {
		arr.sort((a, b) => a.nameIndex - b.nameIndex);
		arr.forEach(e => {
			if (!e.equipped) fragment.appendChild(e.card);
		});
		dom.cardsList.appendChild(fragment);
	}
	itemsOrder.name[category][type] = true;
	itemsOrder.weight[category][type] = false;
	itemsOrder.other[category][type] = false;
	dom.selectedSortingBtns.forEach(e => {
		e.dataset.sortingSelected = false;
		e.dataset.sortingOrder = "desc";
	});
	dom.sortByName.dataset.sortingSelected = true;
	dom.sortingDirection.forEach(e => e.classList.add("hidden"));
	dom.sortByName.querySelector('[data-sorting-order="desc"]').classList.remove("hidden");
	for (const key of Object.keys(activeSortButton)) activeSortButton[key] = false;
	activeSortButton.name = true;
}
function hideItems() {
	if (!cachedItems[properties.category]) return;
	Object.values(cachedItems[properties.category][properties.type]).forEach(e => {
		e.card.classList.add("hidden");
	});
	closeAllItemsDetails();
	toDefaultSortingOrder();
	closeFilter();
	closeInventory();
	hideFilterCategories();
	uncheckAllCheckboxes();
	clearSearch(true);
	updateState(s => { s.ui.itemsOpen = !s.ui.itemsOpen; });
}
function showThisTypeItems() {
	Object.values(cachedItems[properties.category][properties.type]).forEach(e => {
		if (!e.isCommon && !e.equipped) {
			e.card.classList.remove("hidden");
		} else if (e.isCommon && !e.secondEquipped) {
			e.card.classList.remove("hidden");
		}
	});
}
function closeFilter() {
	dom.filterWindow.classList.remove("openFilter");
	dom.filterButton.classList.remove("filter-active");
}
function hideFilterCategories() {
	for (const i of Object.values(filterCategories)) i.classList.add("hidden");
}
function uncheckAllCheckboxes() {
	for (const i of Object.values(dom.checkboxes)) i.checked = false;
	for (const i of Object.values(cachedItems[properties.category][properties.type])) i.inFilter = false;
	checkedFilterOptions.splice(0, checkedFilterOptions.length);
}
function sortBy(type, key) {
	dom.cardsList.scrollTop = 0;
	switch (type) {
		case "name":
			itemsOrder.weight[properties.category][properties.type] = false;
			itemsOrder.other[properties.category][properties.type] = false;
		break;
		case "weight":
			itemsOrder.name[properties.category][properties.type] = false;
			itemsOrder.other[properties.category][properties.type] = false;
		break;
		case "other":
			itemsOrder.name[properties.category][properties.type] = false;
			itemsOrder.weight[properties.category][properties.type] = false;
		break;
	}
	const fragment = document.createDocumentFragment();
	const sortingType = itemsOrder[type][properties.category][properties.type];
	const obj = cachedItems[properties.category][properties.type];
	const tempArr = Object.values(obj); 
	if (!key) key = "damageIndex" in tempArr[0] ? "damageIndex" : "armorIndex";
	if (sortingType) {
		tempArr.sort((a, b) => b[key] - a[key]);
	} else {
		tempArr.sort((a, b) => a[key] - b[key]);
	}
	tempArr.forEach(e => {
		if (!e.equipped) fragment.appendChild(e.card);
	});
	dom.cardsList.appendChild(fragment);
	itemsOrder[type][properties.category][properties.type] = !sortingType;
}
function selectSortingButton() {
	sortingDirection(this);
	dom.selectedSortingBtns.forEach(e => e.dataset.sortingSelected = false);
	this.dataset.sortingSelected = true;
	const activeButtonType = this.dataset.sortButtonType;
	for (const key of Object.keys(activeSortButton)) activeSortButton[key] = false;
	activeSortButton[activeButtonType] = true;
}
function sortingDirection(x) {
	dom.sortingDirection.forEach(e => e.classList.add("hidden"));
	if (x.dataset.sortingSelected === "true") {
		if (x.dataset.sortingOrder === "desc") {
			x.dataset.sortingOrder = "asc";
			x.querySelector("[data-sorting-order='asc']").classList.remove("hidden");
		} else {
			x.dataset.sortingOrder = "desc";
			x.querySelector("[data-sorting-order='desc']").classList.remove("hidden");
		}
	} else {
		x.dataset.sortingOrder = "desc";
		x.querySelector("[data-sorting-order='desc']").classList.remove("hidden");
	}
}
function filterToggle() {
	dom.filterWindow.classList.toggle("openFilter");
	dom.filterButton.classList.toggle("filter-active");
	showFilterCategories(properties.category);
	dom.fieldsetWrapper.scrollTop = 0;
}
function showFilterCategories(a) {
	if (a === "Armor" || a === "Clothing" || a === "Jewelry") filterCategories.bodyPart.classList.remove("hidden");
	switch(a) {
		case "Armor":
		case "Weapons":
		case "Shields":
			filterCategories.smithingPerks.classList.remove("hidden");
			filterCategories.tempering.classList.remove("hidden");
			break;
		case "Staves":
			filterCategories.magicSchool.classList.remove("hidden");
			break;
		case "Clothing":
			filterCategories.cannotWearHelmet.classList.remove("hidden");
			break;
	}
}
function showChosenFilterOptions() {
	const arr = Object.values(cachedItems[properties.category][properties.type]);
	const arrLen = arr.length;
	const filterValue = this.value;
	const chosenCards = [];
	if (this.checked) {
		checkedFilterOptions.push(filterValue);
		for (let i = 0; i < arrLen; i++) {
			if (!i.equipped) {
				const item = arr[i];
				if (!item.filterOptions.includes(filterValue)) {
					chosenCards.push(item.card);
					item.inFilter = true;
				}
			}
		}
		requestAnimationFrame(() => {
			for (const c of chosenCards) c.classList.add("hidden");
		});
	} else {
		checkedFilterOptions.splice(checkedFilterOptions.indexOf(filterValue), 1);
		for (let i = 0; i < arrLen; i++) {
			const item = arr[i];
			if (checkedFilterOptions.every(e => item.filterOptions.includes(e)) && !item.equipped) {
				chosenCards.push(item.card);
				item.inFilter = false;
			}
		}
		requestAnimationFrame(() => {
			for (const c of chosenCards) c.classList.remove("hidden");
		});
	}
	dom.cardsList.scrollTop = 0;
}
export {menuToDefaultView, cachedItems, hideItems, properties};