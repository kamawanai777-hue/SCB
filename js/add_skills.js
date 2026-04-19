import {dom} from "./dom.js";
import {charSkills} from "./skills.js";
import {state} from "./store.js";
const skills = {};
const perks = {};
function updateTextPerk(clickedPerk, perk) {
	perks[state.skills.currentSkillTree][clickedPerk].textContent = clickedPerk + " " + perk.rankNow + "/" + perk.maxRank;
}
function addPerkSection() {
	const node = dom.template.content.cloneNode(true);
	const section = node.querySelector("section");
	const h3 = node.querySelector("h3");
	h3.textContent = state.skills.currentSkillTree;
	dom.characterSkills.appendChild(node);
	skills[state.skills.currentSkillTree] = section;
}
function returnLi(clickedPerk, perk) {
	const li = document.createElement("li");
	const rank = perk.isRanked ? " " + perk.rankNow + "/" + perk.maxRank : "";
	li.textContent = clickedPerk + rank;
	return li;
}
function addLiPerks(clickedPerk, li) {
	if (!perks[state.skills.currentSkillTree]) {
		perks[state.skills.currentSkillTree] = {};
	}
	perks[state.skills.currentSkillTree][clickedPerk] = li;
}
function updateTextSkill(tree) {
	tree = tree ?? state.skills.currentSkillTree;
	if (!skills[tree]) return;
	skills[tree].querySelector("h3").textContent = tree + " " + charSkills[tree].total;
}
function deleteLiPerks(clickedPerk, skillTree) {
	const tree = perks[skillTree];
	if (tree && tree[clickedPerk]) {
		tree[clickedPerk].remove();
		delete tree[clickedPerk];
	}
}
function deletePerkSection(skillTree) {
	if (perks[skillTree] && Object.keys(perks[skillTree]).length === 0) {
		if (skills[skillTree]) {
			skills[skillTree].remove();
			delete skills[skillTree];
		}
	}
}
export {skills, addPerkSection, returnLi, addLiPerks, updateTextSkill, deleteLiPerks, deletePerkSection, updateTextPerk};