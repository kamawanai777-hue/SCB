import {dom} from "./dom.js";
import {isDesktop} from "./other.js";
import {cachedItems, properties} from "./items_menu.js";
import {toggleTitle} from "./info_tabs.js";
import {equipAetherialCrown, unequipAetherialCrown} from "./boons.js";
import {setMagicResistances} from "./magic_resistances.js";
import {displayUnarmedDamage} from "./unarmed_damage.js";
import {setPhysStats} from "./calc_items_values.js";
import {addBonusForSameTypeArmor, cancelBonusForSameTypeArmor} from "./same_type.js";
import {checkMatchingSetArmor} from "./same_set.js";
if (isDesktop) {
	dom.showcaseSlotWrapper.addEventListener("mouseover", e => {
		const slot = e.target.closest(".occupied");
		if (slot) slot.querySelector("button").classList.add("show");
	});
	dom.showcaseSlotWrapper.addEventListener("mouseout", e => {
		const slot = e.target.closest(".occupied");
		if (slot) slot.querySelector("button").classList.remove("show");
	});
	dom.showcaseSlotWrapper.addEventListener("mouseover", e => highlightCard(e));
	dom.showcaseSlotWrapper.addEventListener("mouseout", e => highlightCard(e));
	dom.placeForCards.addEventListener("mouseover", e => highlightSlot(e));
	dom.placeForCards.addEventListener("mouseout", e => highlightSlot(e));
} else {
	dom.showcaseSlotWrapper.addEventListener("click", e => {
		const slot = e.target.closest(".occupied");
		if (slot) slot.querySelector("button").classList.toggle("show");
	});
}
dom.cardsList.addEventListener("click", e => {
	if (e.target.closest(".item-card__equip-button")) {
		equipItem(e.target);
	}
});
dom.selectHand.querySelectorAll("button").forEach(button => button.addEventListener("click", e => chooseHand(e.target)));
dom.itemReplacement.querySelectorAll("button").forEach(button => button.addEventListener("click", e => replaceOrKeepItem(e.target)));
dom.equippedCardsWrapper.addEventListener("click", toggleItemDetails);
dom.sameItemButton.addEventListener("click", confirmSameItem);
dom.equippedCardsWrapper.addEventListener("click", e => {
	if (e.target.closest(".equipped-item__unequip-button")) unequipFromItemMenu(e.target.dataset.unequipButton);
});
dom.unequipItemFromMenuBtns.forEach(button => button.addEventListener("click", e => replaceOrKeepItem(e.target)));
dom.showcaseSlotWrapper.addEventListener("click", e => {
	const button = e.target;
	if (button.classList.contains("showcase__slot-button")) {
		unequipFromMainWindow(button.dataset.slot);
		if (window.matchMedia("(max-width: 1279px").matches) modalToCenter();
		button.classList.remove("show");
	}
});
dom.unequipMiniatureContainer.querySelectorAll("button").forEach(button => button.addEventListener("click", e => replaceOrKeepItem(e.target)));
dom.menuInventoryButton.addEventListener("click", toggleEquippedCardsPanel);
dom.closeMenuInventory.addEventListener("click", toggleEquippedCardsPanel);
if (window.matchMedia("(max-width: 1279px)").matches) addEventListener("scroll", modalToCenter, {passive: true});
const slot = {
	Neck: document.querySelector('[data-showcase-slot="neckSlot"]'),
	Head: document.querySelector('[data-showcase-slot="headSlot"]'),
	Back: document.querySelector('[data-showcase-slot="backSlot"]'),
	Arms: document.querySelector('[data-showcase-slot="armsSlot"]'),
	Right: document.querySelector('[data-showcase-slot="rightSlot"]'),
	Left: document.querySelector('[data-showcase-slot="leftSlot"]'),
	Body: document.querySelector('[data-showcase-slot="bodySlot"]'),
	Finger: document.querySelector('[data-showcase-slot="fingerSlot"]'),
	Legs: document.querySelector('[data-showcase-slot="legsSlot"]'),
};
const itemMenuEquipSlots = Object.fromEntries([...document.querySelectorAll(".equipped-item")].map(e => [e.dataset.itemMenuSlot, {
	itemSlot: e,
	details: e.querySelector(".equipped-item__details"),
	name: e.querySelector(".equipped-item__name"),
	otherName: e.querySelector(".equipped-item__stat-other-text"),
	otherValue: e.querySelector(".equipped-item__stat-other-value"),
	weightValue: e.querySelector(".equipped-item__stat-weight-value"),
	description: e.querySelector(".equipped-item__text"),
	img: e.querySelector(".equipped-item__img"),
	isOpen: false,
}]));
const slotContent = {
	Neck: null,
	Head: null,
	Back: null,
	Arms: null,
	Right: null,
	Left: null,
	Both: null,
	Body: null,
	Finger: null,
	Legs: null,
};
const resolution = new Map();
const cachedImages = new Map();
const cardsWithDescr = new Map();
let itemsEquipped = 0;
async function equipItem(e) {
	const name = e.dataset.itemName;
	const item = cachedItems[properties.category][properties.type][name];
	const promise = new Promise((resolve, reject) => {
		resolution.set("First", {resolve, reject});
	});
	const param = distributor(item);
	slotChecker(param, name, item);
	try {
		const result = await promise;
		bundleFunc(result, item, name);
	} catch (err) {
		console.log(err);
	}
	resolution.clear();
}
function distributor(item) {
	if (item.hands !== undefined) {
		if (item.hands === "One") {
			return "One";
		} else {
			return "Two";
		}
	} else if (item.isShield !== undefined) {
		return "Shield";
	} else {
		return item.bodyPart;
	}
}
async function slotChecker(param, name, item) {
	if (param === "One") {
		openEquipOptionsContainer();
		openSelectHandWindow(name);
		const hand = await new Promise((resolve, reject) => {
			resolution.set("Second", {resolve, reject});
		});
		if (!slotContent[hand] && !slotContent.Both) {
			closeSelectHandWindow();
			closeEquipOptionsContainer();
			resolution.get("First").resolve(hand);
		} else {
			if (name === slotContent[hand]?.name) {
				const promise = new Promise((resolve, reject) => {
					resolution.set("Second", {resolve, reject});
				});
				try {
					closeSelectHandWindow();
					toggleSameItemWindow();
					const result = await promise;
				} catch (err) {
					resolution.get("First").reject(err);
				}
				closeEquipOptionsContainer();
			} else if (slotContent.Both) {
				closeSelectHandWindow();
				replacer(name, hand, "Both", false);
			} else {
				closeSelectHandWindow();
				replacer(name, hand, hand, false);
			}
		}
	} else if (param === "Two") {
		if (!slotContent.Left && !slotContent.Right && !slotContent.Both) {
			resolution.get("First").resolve("Both");
		} else {
			openEquipOptionsContainer();
			replacer(name, "Both", "Both", false);
		}
	} else if (param === "Shield") {
		if (slotContent.Both) {
			openEquipOptionsContainer();
			replacer(name, "Left", "Both", false);
		} else if (slotContent.Left) {
			openEquipOptionsContainer();
			replacer(name, "Left", "Left", false);
		} else {
			resolution.get("First").resolve("Left");
		}
	} else {
		if (param === "Head") {
			if (!slotContent.Head) {
				if (!slotContent.Body) {
					resolution.get("First").resolve(param);
				} else {
					if (!slotContent.Body.cannotWearHelmet) {
						resolution.get("First").resolve(param);
					} else {
						openEquipOptionsContainer();
						replacer(name, param, "Body", true);
					}
				}
			} else {
				openEquipOptionsContainer();
				replacer(name, param, param, false);
			}
		} else if (param === "Body") {
			const isHooded = item.cannotWearHelmet || false;
			if (!slotContent.Body) {
				if (!slotContent.Head) {
					resolution.get("First").resolve(param);
				} else {
					if (!isHooded) {
						resolution.get("First").resolve(param);
					} else {
						openEquipOptionsContainer();
						replacer(name, param, "Head", true);
					}
				}
			} else {
				openEquipOptionsContainer();
				if (isHooded) {
					if (slotContent.Head) {
						replacer(name, param, "Both", true);
					}
				} else {
					replacer(name, param, param, false);
				}
			}
		} else {
			if (slotContent[param]) {
				openEquipOptionsContainer();
				replacer(name, param, param, false);
			} else {
				resolution.get("First").resolve(param);
			}
		}
	}
}
async function replacer(name, firstSlot, secondSlot, isHooded) {
	const promise = new Promise((resolve, reject) => {
		resolution.set("Second", {resolve, reject});
	});
	openReplaceItemWindow(secondSlot, name, isHooded)
	const replaceOrKeep = await new Promise((resolve, reject) => {
		resolution.set("Third", {resolve, reject});
	});
	try {
		decideToReplaceItem(replaceOrKeep, secondSlot, isHooded);
		const result = await promise;
		resolution.get("First").resolve(firstSlot);
	} catch (err) {
		resolution.get("First").reject(err);
	}
	closeReplaceItemWindow()
	closeEquipOptionsContainer();
}
function decideToReplaceItem(decision, slotName, isHooded) {
	if (decision === "Yes") {
		if (slotName === "Both") {
			if (isHooded) {
				unequipItem("Head");
				unequipItem("Body");
			} else {
				if (slotContent.Both) {
					unequipItem("Both", true);
				} else {
					if (slotContent.Left) unequipItem("Left", true);
					if (slotContent.Right) unequipItem("Right", true);
				}
			}
		} else if (slotName === "Left" || slotName === "Right") {
			if (slotContent.Both) {
				unequipItem("Both");
			} else {
				unequipItem(slotName);
			}
		} else {
			unequipItem(slotName);
		}
		resolution.get("Second").resolve("Item replaced");
	} else {
		resolution.get("Second").reject("Item kept");
	}
}
function unequipItem(slotName, hideSlot = false, menuIsOpen) {
	const menuSlot = itemMenuEquipSlots[slotName];
	const item = slotContent[slotName];
	unequipAetherialCrown(slotContent.Head?.name);
	menuSlot.img.removeChild(menuSlot.img.firstChild); 
	if (slotName === "Both") {
		slot.Left.removeChild(slot.Left.lastChild);
		slot.Right.removeChild(slot.Right.lastChild);
	} else {
		slot[slotName].removeChild(slot[slotName].lastChild);
	}
	adjustCardByCommonness(item, false, menuIsOpen);
	if (hideSlot) {
		menuSlot.itemSlot.classList.add("hidden");
		slotContent[slotName] = null;
		adjustSlot(slotName, false);
	}
	countEquippedItems(false);
	if (itemsEquipped === 0) toggleTitle(".info-win__item-info-section");
	deleteCardsWithDescr(item, slotName);
	setMagicResistances(item.name, -1);
	cancelBonusForSameTypeArmor(slotName);
	checkMatchingSetArmor(item.name, slotName, item.type, -1);
	setPhysStats(slotName, item, item.name, -1);
}
function adjustCardByCommonness(item, bool, menuIsOpen = true) {
	const meth = bool ? "add" : "remove";
	if (bool) {
		if (item.isCommon) {
			if (!item.firstEquipped) {
				item.firstEquipped = bool;
				item.equipped = bool;
			} else {
				item.secondEquipped = bool;
				item.card.classList[meth]("hidden");
			}
		} else {
			item.equipped = bool;
			item.card.classList[meth]("hidden");
		}
	} else {
		const sameCatType = item.category === properties.category && item.type === properties.type;
		if (item.isCommon) {
			if (item.secondEquipped) {
				item.secondEquipped = bool;
				if (sameCatType && menuIsOpen) item.card.classList[meth]("hidden");
			} else {
				item.firstEquipped = bool;
				item.equipped = bool;
			}
		} else {
			item.equipped = bool;
			if (sameCatType && menuIsOpen) item.card.classList[meth]("hidden");
		}
	}
}
function bundleFunc(result, item, name) {
	equipItemInItemWindowSlot(item, result);
	adjustCardByCommonness(item, true);
	makeImg(result, item, name);
	setSlotContent(result, item);
	adjustSlot(result, true);
	if (itemsEquipped === 0) toggleTitle(".info-win__item-info-section");
	equipAetherialCrown(name);
	makeCardsWithDescr(item, name, result);
	countEquippedItems(true);
	setMagicResistances(name, 1);
	displayUnarmedDamage();
	addBonusForSameTypeArmor(result);
	checkMatchingSetArmor(name, result, item.type, 1);
	setPhysStats(result, item, name, 1);
}
function equipItemInItemWindowSlot(item, slotName) {
	const slot = itemMenuEquipSlots[slotName];
	slot.itemSlot.classList.remove("hidden");
	slot.name.textContent = item.name;
	if (item.armorRating !== undefined) {
		slot.otherName.textContent = "Armor:";
		slot.otherValue.textContent = item.armorRating;
	} else if (item.damage !== undefined) {
		slot.otherName.textContent = "Damage:";
		slot.otherValue.textContent = item.damage;
	} else {
		slot.otherName.textContent = "";
		slot.otherValue.textContent = "";
	}
	slot.weightValue.textContent = item.weight;
	slot.description.textContent = item.description;
	const imgCopy = item.img.cloneNode(true);
	slot.img.appendChild(imgCopy);
	if (slot.isOpen) slot.details.style.maxHeight = slot.details.scrollHeight + "px";
}
function makeImg(slotName, item, name) {
	if (!cachedImages.has(name)) {
		const img = document.createElement("img");
		img.src = item.pathM;
		img.alt = name;
		img.title = name;
		if (window.matchMedia("(max-width: 639px").matches) {
			img.width = 160;
			img.height = 160;
		} else {
			switch (slotName) {
				case "Body":
					img.width = 200;
					img.height = 200;
					break;
				case "Head":
				case "Left":
				case "Right":
				case "Legs":
				case "Both":
					img.width = 160;
					img.height = 160;
					break;
				default:
					img.width = 140;
					img.height = 140;
			}
		}
		img.style.display = "block";
		cachedImages.set(name, img);
		if (slotName === "Both") {
			[slot.Left, slot.Right].forEach(s => s.appendChild(img.cloneNode(true)));
		} else {
			slot[slotName].appendChild(img.cloneNode(true));
		}
	} else {
		if (slotName === "Both") {
			[slot.Left, slot.Right].forEach(s => s.appendChild(cachedImages.get(name).cloneNode(true)));
		} else {
			slot[slotName].appendChild(cachedImages.get(name).cloneNode(true));
		}
	}
}
function setSlotContent(slotName, item) {
	slotContent[slotName] = item;
}
function adjustSlot(slotName, bool) {
	const meth = bool ? "add" : "remove";
	if (slotName === "Both") {
		[slot.Left, slot.Right].forEach(s => {
			s.querySelector("p").classList[meth]("hidden");
			s.classList[meth]("occupied");
		});
	} else {
		slot[slotName].querySelector("p").classList[meth]("hidden");
		slot[slotName].classList[meth]("occupied");
	}
}
function countEquippedItems(x) {
	x ? itemsEquipped++ : itemsEquipped--;
}
function toggleEquippedCardsPanel() {
	dom.equippedCards.classList.toggle("showEquipped");
	dom.equippedCards.scrollTop = 0;
	dom.menuInventoryButton.classList.toggle("inventory-active");
}
function closeInventory() {
	dom.equippedCards.classList.remove("showEquipped");
	dom.menuInventoryButton.classList.remove("inventory-active");
}
function chooseHand(e) {
	resolution.get("Second").resolve(e.textContent);
}
function replaceOrKeepItem(e) {
	resolution.get("Third")?.resolve(e.textContent);
}
function openEquipOptionsContainer() {
	dom.chooseHandContainer.classList.remove("hidden");
	dom.itemsWrapper.classList.add("blurred");
}
function closeEquipOptionsContainer() {
	dom.chooseHandContainer.classList.add("hidden");
	dom.itemsWrapper.classList.remove("blurred");
}
function openSelectHandWindow(name) {
	dom.selectHand.classList.remove("hidden");
	dom.selectHand.querySelector(".first-item").textContent = name;
}
function closeSelectHandWindow() {
	dom.selectHand.classList.add("hidden");
}
function toggleSameItemWindow() {
	dom.sameItem.classList.toggle("hidden");
}
function confirmSameItem() {
	resolution.get("Second").reject("Same item");
	toggleSameItemWindow();
}
function toggleItemDetails(e) {
	const button = e.target.closest(".equipped-item__info-button");
	if (button) {
		const slot = itemMenuEquipSlots[button.dataset.toggleDetails], details = slot.details, state = slot.isOpen;
		if (!details.style.maxHeight) {
			details.style.maxHeight = details.scrollHeight + "px";
		} else {
			details.style.maxHeight = null;
		}
		slot.isOpen = !state;
		button.classList.toggle("equipped-item__info-button--turn");
	}
}
function closeItemDetailsOnUnequip(slotName) {
	document.querySelector(`[data-toggle-details=${slotName}]`).classList.remove("equipped-item__info-button--turn");
	itemMenuEquipSlots[slotName].details.style.maxHeight = null;
}
function closeAllItemsDetails() {
	for (const i of document.querySelectorAll(".equipped-item__info-button--turn")) {
		itemMenuEquipSlots[i.dataset.toggleDetails].details.style.maxHeight = null;
		i.classList.remove("equipped-item__info-button--turn");
	}
}
function openReplaceItemWindow(slotName, name, isHooded) {
	dom.itemReplacement.classList.remove("hidden");
	dom.itemReplacementFirstItem.textContent = name;
	const firstP = dom.itemReplacementUnequipFirst;
	if (isHooded) {
		const bodyName = slotContent.Body.name, headName = slotContent.Head.name;
		const unequipBody = dom.itemReplacementUnequipBody, unequipHead = dom.itemReplacementUnequipHead, unequipBoth = dom.itemReplacementUnequipBoth;
		switch(slotName) {
			case "Body":
				unequipBody.classList.remove("hidden");
				unequipBody.querySelector(".item-replacement__second-item").textContent = bodyName;
				break;
			case "Head":
				unequipHead.classList.remove("hidden");
				unequipHead.querySelector(".item-replacement__second-item").textContent = headName;
				break;
			case "Both":
				unequipBoth.classList.remove("hidden");
				unequipBoth.querySelector(".item-replacement__second-item").textContent = bodyName;
				unequipBoth.querySelector(".item-replacement__third-item").textContent = headName;
				break;
		}
	} else if (slotName === "Both") {
		const left = slotContent.Left, right = slotContent.Right, both = slotContent.Both, secondP = dom.itemReplacementUnequipSecond;
		if (both) {
			firstP.classList.remove("hidden");
			firstP.querySelector(".item-replacement__second-item").textContent = both.name;
		} else {
			if (left) {
				firstP.classList.remove("hidden");
				firstP.querySelector(".item-replacement__second-item").textContent = left.name;
			}
			if (right) {
				secondP.classList.remove("hidden");
				secondP.querySelector(".item-replacement__third-item").textContent = right.name;
			}
		}
	} else {
		firstP.classList.remove("hidden");
		firstP.querySelector(".item-replacement__second-item").textContent = slotContent[slotName].name;
	}
}
function closeReplaceItemWindow() {
	[dom.itemReplacement, dom.itemReplacementUnequipFirst, dom.itemReplacementUnequipSecond, dom.itemReplacementUnequipBody, dom.itemReplacementUnequipHead, dom.itemReplacementUnequipBoth].forEach(e => e.classList.add("hidden"));
}
async function unequipFromItemMenu(slotName) {
	openEquipOptionsContainer();
	toggleUnequipItemFromItemMenu();
	await unequipConditions(slotName, dom.unequipItemFromMenuName, true);
	toggleUnequipItemFromItemMenu();
	closeEquipOptionsContainer();
	closeItemDetailsOnUnequip(slotName);
	dom.showcaseSlotWrapper.querySelector(`[data-slot=${slotName}]`).classList.remove("show");
}
function toggleUnequipItemFromItemMenu() {
	dom.unequipItemFromMenu.classList.toggle("hidden");
}
async function unequipFromMainWindow(slotName) {
	toggleUnequipFromMainWindow();
	await unequipConditions(slotName, dom.unequipMiniatureName, false);
	toggleUnequipFromMainWindow();
}
function toggleUnequipFromMainWindow() {
	dom.unequipMiniatureContainer.classList.toggle("hidden");
	dom.showcaseSlotWrapper.classList.toggle("blurred");
}
async function unequipConditions(slotName, nameField, menuIsOpen) {
	const defSlot = (slotName === "Left" || slotName === "Right") && slotContent.Both ? "Both" : slotName;
	nameField.textContent = slotContent[defSlot].name;
	const decision = await new Promise(resolve => resolution.set("Third", {resolve}));
	if (decision === "Yes") unequipItem(defSlot, true, menuIsOpen);
	resolution.clear();
}
function makeCardsWithDescr(item, name, result) {
	const node = dom.card.content.cloneNode(true);
	const returnNode = (string) => node.querySelector(string);
	const article = returnNode(".item-info");
	const forDetails = returnNode(".item-info__details-wrapper");
	returnNode(".item-info__name").textContent = name;
	returnNode(".item-info__slot").textContent = `(${result})`;
	returnNode(".item-info__weight-value").textContent = item.weight;
	const arRat = item.armorRating, isArmor = arRat !== undefined;
	returnNode(".item-info__other-param").textContent = isArmor ? "Armor" : "Damage";
	returnNode(".item-info__other-value").textContent = isArmor ? arRat : item.damage;
	returnNode(".item-info__ench").textContent = item.description;
	function f(summ, desc) {
		const node = dom.details.content.cloneNode(true);
		node.querySelector(".item-details__summary").textContent = summ;
		node.querySelector(".item-details__p").textContent = desc;
		forDetails.appendChild(node.querySelector(".item-details"));
	}
	const addEff = item.additionalEffect, magSch = item.magicSchool;
	addEff && f("Additional Effect", addEff);
	item.artifact && f("Artifact", "It is one of a kind.")
	item.enchantable && f("Enchantable", "Item can be enchanted.");
	magSch && f(magSch, "Magic school staff profits from.");
	const material = item.material, category = item.category;
	if (material) {
		const materialName = Array.isArray(material) ? material.join(" + ") : material;
		f(materialName, "Main material for upgrade.");
		item.profitFromTempering ? f("Improvable 2x", "Item can be improved twice as much.") : f("Improvable", "Item can be improved, but not twice as much.");
	} else if (["Weapons", "Armor", "Shields"].includes(category)) {
		f("Unimprovable", "Cannot be improved through tempering.");
	}
	const perks = item.perks, uses = item.uses;
	if (perks) {
		const perksName = Array.isArray(perks) ? perks.join(" + ") : perks;
		f(perksName, "Perk(s) for tempering.");
	}
	if (uses) f(`Uses: ${uses}`, "How long enchantment lasts.");
	const key = `${name} ${result}`;
	article.dataset.lightSlot = result;
	dom.placeForCards.appendChild(article);
	cardsWithDescr.set(key, article);
	addLightData(key, result);
}
function deleteCardsWithDescr(item, slotName) {
	const itemName = `${item.name} ${slotName}`;
	cardsWithDescr.get(itemName).remove();
	cardsWithDescr.delete(itemName);
	clearLightData(slotName);
}
function addLightData(name, result) {
	if (result === "Both") {
		slot.Left.dataset.lightCard = slot.Right.dataset.lightCard = name;
	} else if (result === "Shield") {
		slot.Left.dataset.lightCard = name;
	} else {
		slot[result].dataset.lightCard = name;
	}
}
function clearLightData(slotName) {
	if (slotName === "Both") {
		slot.Left.dataset.lightCard = slot.Right.dataset.lightCard = "";
	} else {
		slot[slotName].dataset.lightCard = "";
	}
}
function highlightSlot(e) {
	const card = e.target.closest(".item-info")?.dataset?.lightSlot;
	const cl = "showcase__slot--highlight";
	if (card) {
		if (card === "Both") {
			slot.Left.classList.toggle(cl);
			slot.Right.classList.toggle(cl);
		} else {
			slot[card].classList.toggle(cl);
		}
	}
}
function highlightCard(e) {
	const name = e.target.closest(".showcase__slot")?.dataset?.lightCard;
	name && cardsWithDescr.get(name).classList.toggle("item-info--highlight");
}
function modalToCenter() {
	const a = dom.unequipMiniatureContainer, b = dom.unequipMiniatureModal, c = document.documentElement;
	const winHeight = c.clientHeight;
	const winMidLine = winHeight / 2;
	const rect = a.getBoundingClientRect();
	const conTop = rect.top;
	const conBottom = rect.bottom;
	const conBorder = a.clientTop;
	const modalHeight = b.offsetHeight;
	const modalHalf = modalHeight / 2;
	if (conTop >= 0) {
		const freeSpace = winMidLine - (conTop + conBorder);
		if (modalHalf <= freeSpace) {
			const newPos = freeSpace - modalHalf;
			b.style.top = newPos + "px";
		} else {
			b.style.top = "0px";
		}
	} else if (conBottom >= winHeight) {
		const newPos = Math.abs(conTop + conBorder) + winMidLine - modalHalf;
		b.style.top = newPos + "px";
	} else {
		const freeSpace = (conBottom - conBorder) - winMidLine;
		if (modalHalf <= freeSpace) {
			const newPos = Math.abs(conTop) - conBorder + winMidLine - modalHalf;
			b.style.top = newPos + "px";
		} else {
			b.style.top = a.clientHeight - modalHeight + "px";
		}
	}
}
export {replaceOrKeepItem, slotContent, closeAllItemsDetails, closeInventory};