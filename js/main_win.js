import {state, updateState} from "./store.js";
import {dom} from "./dom.js";
import {raceSkills} from "./other.js";
import {setMagicResistances} from "./magic_resistances.js";
import {replaceOrKeepItem} from "./equip_items.js";
import {charSkills} from "./skills.js";
import {hideItems} from "./items_menu.js";
import {calcWeaponSkillMod, calcArmorSkillMod, calcTotalValue} from "./calc_items_values.js";
import {displayUnarmedDamage} from "./unarmed_damage.js";
import {setRaceAbilityDesc} from "./passive_effects.js";
const matchQuery = window.matchMedia("(max-width: 909px");
if (matchQuery.matches) dom.H1.textContent = "SCB";
matchQuery.addEventListener("change", e => {
	if (e.matches) {
		dom.H1.textContent = "SCB";
	} else {
		dom.H1.textContent = "SKYRIM CHARACTER BUILDER";
	}
})
dom.saveCharacter.addEventListener("click", saveYourBuild);
for (const button of dom.closeModal) button.addEventListener("click", () => closeModal(button));
dom.closeMenu.addEventListener("click", toggleMenu);
dom.characterButton.addEventListener("click", e => {
	openCreateChar();
	focusCharName(e);
	hideWarning();
	if (state && state.ui && state.ui.menuOpen) toggleMenu();
});
dom.menuButton.addEventListener("click", () => {
	isThereAnyBuild();
	createBuildFirst();
	replaceOrKeepItem("No");
});
function toggleMenu() {
	dom.menuOptions.scrollTop = 0;
	for (const i of dom.typeContainers) {
		i.classList.add("hidden");
		i.parentElement.style.order = "";
	}
	updateState(s => { s.ui.menuOpen = !s.ui.menuOpen; });
}
function isThereAnyBuild() {
	clearTimeout(createBuildFirst.timerID);
	if (state.ui.anyBuild) toggleMenu();
}
function createBuildFirst() {
	if (!state.ui.anyBuild) {
		dom.warning.classList.remove("hidden");
		createBuildFirst.timerID = setTimeout(() => dom.warning.classList.add("hidden"), 2000);
	}
}
function hideWarning() {
	dom.warning.classList.add("hidden");
}
function openCreateChar() {
	dom.overlay.classList.remove("hidden");
	dom.createCharacter.classList.remove("hidden");
}
function saveYourBuild(event) {
	let a = dom.races, b = dom.characterName;
	if (b.value && a.value) {
		if (state.character.race) {
			setMagicResistances(state.character.race, -1);
		}
		const race = dom.races.value;
		updateState(s => { s.character.race = race; s.character.name = b.value; });
		for (const [key, value] of Object.entries(raceSkills[race])) {
			charSkills[key].ownSkill = value;
			charSkills[key].total = value;
			calcWeaponSkillMod(key);
			calcArmorSkillMod(key);
		}
		for (const i of document.querySelectorAll(".statistics")) i.classList.remove("hidden");
		if (!state.ui.anyBuild) document.querySelector(".info-win__statistics-section .nothing-there-yet").classList.add("hidden");
		updateState(s => { s.ui.anyBuild = true; });
		dom.currentName.textContent = state.character.name;
		dom.currentRace.textContent = a.value;
		dom.treeSkillLevel.textContent = charSkills[state.skills.currentSkillTree].total;
		dom.skillTreeRace.textContent = race;
		setMagicResistances(race, 1);
		displayUnarmedDamage();
		calcTotalValue();
		setRaceAbilityDesc();
		return true;
	} else {
		validateInput(dom.characterName, dom.races);
		event.stopImmediatePropagation();
		return false;
	}
}
function closeModal(button) {
	const selectors = button?.dataset.closeModal?.split(" ") ?? [];
	for (const selector of selectors) {
		const el = document.querySelector(selector);
		if (el) el.classList.add("hidden");
	}
	removeValidation();
	replaceOrKeepItem("No");
	if (state.ui.itemsOpen) hideItems();
}
function closeOnKey() {
	const overlay = dom.overlay?.dataset.closeModal?.split(" ").map(e => document.querySelector(e)) ?? [];
	for (const el of overlay) if (el) el.classList.add("hidden");
	replaceOrKeepItem("No");
	removeValidation();
	if (state.ui.itemsOpen) hideItems();
}
function focusCharName(e) {
	e.preventDefault();
	dom.characterName.focus();
}
function validateInput(...args) {
	for (const arg of args) {
		if (!arg.value) {
			arg.classList.add("check-validity");
			arg.reportValidity();
		}
	}
}
function removeValidation() {
	dom.characterName.classList.remove("check-validity");
	dom.races.classList.remove("check-validity");
}
window.addEventListener("keydown", e => {
	if (e.key === "Escape") closeOnKey();
});
function isVisible(el) {
	return !el.classList.contains("hidden");
}
document.addEventListener("keydown", e => {
	if (e.key === "Enter" && isVisible(dom.createCharacter)) saveYourBuild(e) && closeOnKey();
});
export {toggleMenu};