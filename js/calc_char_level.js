import {dom} from "./dom.js";
import {raceSkills} from "./other.js";
import {state, updateState} from "./store.js";
import {charSkills} from "./skills.js";
import {calcArmorSkillMod, calcWeaponSkillMod, calcTotalValue, displayPhysValues} from "./calc_items_values.js";
import {updateTextSkill} from "./add_skills.js";
document.querySelector(".skills-header__buttons").addEventListener("click", e => changeSkillLevel(e));
function calcCharLevel(skill, bool) {
	const race = state.character.race;
	if (!race) return;
	const a = raceSkills[race][skill] + 1;
	const b = charSkills[skill].ownSkill;
	const n = b - a + 1;

	updateState(s => {
		s.character.xpBySkillTree[skill] = (a + b) * n * .5;
		s.character.totalXP = Object.values(s.character.xpBySkillTree).reduce((total, num) => total + num, 0);

		if (bool) {
			while (s.character.totalXP > s.character.xpToNextLevel) {
				s.character.xpToNextLevel += (++s.character.level + 3) * 25;
			}
		} else {
			while (s.character.xpToNextLevel > s.character.totalXP && s.character.level > 1) {
				s.character.xpToNextLevel -= (s.character.level-- + 3) * 25;
			}
		}
	});

	dom.currentLevel.textContent = state.character.level;
	displayPhysValues();
}
function changeSkillLevel(e) {
	const button = e.target;
	if (button.closest(".skills-header__button")) {
		const mod = Number(button.dataset.changeSkill);
		const skill = charSkills[state.skills.currentSkillTree];
		const lowestSkill = raceSkills[state.character.race][state.skills.currentSkillTree];
		if (skill.ownSkill + mod >= 100) {
			skill.ownSkill = 100;
		} else if (skill.ownSkill + mod <= lowestSkill) {
			skill.ownSkill = lowestSkill;
		} else {
			skill.ownSkill += mod;
		}
		calcWeaponSkillMod(state.skills.currentSkillTree);
		calcArmorSkillMod(state.skills.currentSkillTree);
		calcTotalValue();
		dom.treeSkillLevel.textContent = skill.total = skill.ownSkill + skill.otherSource;
		updateTextSkill(state.skills.currentSkillTree);
		if (mod < 0) {
			calcCharLevel(state.skills.currentSkillTree, false);
		} else {
			calcCharLevel(state.skills.currentSkillTree, true);
		}
	}
}
export {calcCharLevel, calcArmorSkillMod};