import {charSkills} from "./skills.js";
import {setDeathbrand, checkForSet} from "./special_sets.js";
import {displayUnarmedDamage} from "./unarmed_damage.js";
import {slotContent} from "./equip_items.js";
import {fillArmor, mapCanvases} from "./canvas.js";
const dwarvenArmor = ["Brawler's Dwarven Gauntlets", "Dwarven Plate Armor", "Visage of Mzund", "Wraithguard", "Dwarven Shield", "Dwarven Mail Armor", "Dwarven Mail Boots", "Dwarven Mail Gauntlets", "Dwarven Mail Helmet", "Dwarven Armor", "Dwarven Boots", "Dwarven Gauntlets", "Dwarven Helmet", "Dwarven Plate Armor", "Dwarven Plate Boots"];
const basicValues = {
	"One-Handed": 0,
	"Two-Handed": 0,
	Archery: 0,
	"Heavy Armor": {
		Head: 0,
		Body: 0,
		Legs: 0,
		Arms: 0,
	},
	"Light Armor": {
		Head: 0,
		Body: 0,
		Legs: 0,
		Arms: 0,
	},
	"Dwarven Heavy": {
		Head: 0,
		Body: 0,
		Legs: 0,
		Arms: 0,
	},
	"Dwarven Light": {
		Head: 0,
		Body: 0,
		Legs: 0,
		Arms: 0,
	},
	"Shields Heavy": 0,
	"Shields Light": 0,
	nonArmor: 0,
	"The Lord Stone": 0,
	setBonus: 0,
};
const totalValues = {
	totalArmor: 0,
	totalDamage: 0,
	totalWeight: 0,
};
const sumOfModifiers = {
	"One-Handed": {
		skill: 0,
		perks: 0,
		items: 0,
		seeker: 0,
	},
	"Two-Handed": {
		skill: 0,
		perks: 0,
		items: 0,
		seeker: 0,
	},
	Archery: {
		skill: 0,
		perks: 0,
		items: 0,
		seeker: 0,
	},
	"Light Armor": {
		skill: 0,
		perks: 0,
		sameType: 0,
		sameSet: 0,
		items: 0,
		seeker: 0,
	},
	"Heavy Armor": {
		skill: 0,
		perks: 0,
		sameType: 0,
		sameSet: 0,
		items: 0,
		seeker: 0,
	},
	"Dwarven Light": {
		knowledge: 0,
	},
	"Dwarven Heavy": {
		knowledge: 0,
	},
};
const percentageModifiers = {
	"Shrouded Hood": {
		Archery: .2,
	},
	"Nightingale Gloves": {
		"One-Handed": .25,
	},
	"Linwe's Hood": {
		Archery: .15,
	},
	"Linwe's Gloves": {
		"One-Handed": .15,
	},
	"Krosis": {
		Archery: .2,
	},
	"Gauntlets of the Old Gods": {
		Archery: .2,
	},
	"Ancient Shrouded Cowl": {
		Archery: .35,
	},
	"Remnant Agent Gloves": {
		"One-Handed": .25,
	},
	"Reforged Cuirass of the Crusader": {
		"Light Armor": .1,
		"Heavy Armor": .1,
	},
	"Ironhand Gauntlets": {
		"Two-Handed": .15,
	},
	"Imperial Dragon Gauntlets": {
		"One-Handed": .1,
		"Two-Handed": .1,
	},
	"Fists of Randagulf": {
		"One-Handed": .2,
		"Two-Handed": .2,
	},
	"Cuirass of the Crusader": {
		"Light Armor": .1,
		"Heavy Armor": .1,
	},
	"Cicero’s Clothes": {
		"One-Handed": .2,
	},
	"Jester’s Clothes": {
		"One-Handed": .12,
	},
	"Hunter Backpack with Bedroll": {
		Archery: .1,
	},
	"Hunter Backpack": {
		Archery: .1,
	},
	"Kyne’s Token": {
		Archery: .05,
	},
	"Ancient Knowledge": 0,
	"Seeker of Might": {
		"One-Handed": .1,
		"Two-Handed": .1,
		"Heavy Armor": .1,
		Archery: .1,
	},
	"Seeker of Shadows": {
		"Light Armor": .1,
	},
};
const skillModifiers = {
	"Remnant Agent Armor": {
		"Light Armor": 17,
	},
	"Masque of Clavicus Vile": {
		Speech: 10,
	},
	"Dibella": {
		Speech: 15,
	},
	"Lynea's Amulet of Dibella": {
		Speech: 15,
	},
	"Viriya's Charm": {
		"Light Armor": 22,
		"Heavy Armor": 22,
	},
};
const slotsToCheckArmor = ["Head", "Body", "Arms", "Legs", "Left"];
const weaponSkills = ["Archery", "One-Handed", "Two-Handed"];
const armorOnMods = {
	"Heavy Armor": ["Heavy Armor", "Dwarven Heavy"],
	"Light Armor": ["Light Armor", "Dwarven Light"],
};
const shieldKeys = {
	"Heavy Armor": "Shields Heavy",
	"Light Armor": "Shields Light",
};
const physicalValues = {};
for (const i of document.querySelectorAll("[data-phys-values]")) physicalValues[i.dataset.physValues] = i;
function setPhysStats(slot, item, name, sign) {
	if (item) {
		const armor = item.armorRating, damage = item.damage, type = item.type, category = item.category, weight = item.weight;
		if (armor !== undefined) {
			const value = sign * armor;
			const isDwarven = dwarvenArmor.includes(name);
			const isShield = category === "Shields";
			if (type === "Heavy") {
				if (isDwarven) {
					basicValues["Dwarven Heavy"][slot] += value;
				} else if (isShield) {
					basicValues["Shields Heavy"] += value;
				} else {
					basicValues["Heavy Armor"][slot] += value;
				}
			} else if (type === "Light") {
				if (isDwarven) {
					basicValues["Dwarven Light"][slot] += value;
				} else if (isShield) {
					basicValues["Shields Light"] += value;
				} else {
					basicValues["Light Armor"][slot] += value;
				}
			} else {
				basicValues.nonArmor += value;
			}
		}
		if (damage !== undefined) {
			const value = sign * damage;
			if (type === "Bows" || type === "Crossbows") {
				basicValues["Archery"] += value;
			} else {
				basicValues[item.hands === "One" ? "One-Handed" : "Two-Handed"] += value;
			}
		}
		totalValues.totalWeight += sign * weight;
	}
	setItemsBonuses(name, sign);
	setDeathbrand(slot, name, sign);
	checkForSet(name, sign);
	setItemSkillBonus(name, sign);
	calcArmorSkillMod(item?.type + " Armor");
	calcWeaponSkillMod(item?.hands + "-Handed");
	calcTotalValue();
	displayUnarmedDamage();
	displayPhysValues();
}
function setItemsBonuses(name, sign) {
	if (name === "Storm-Bear Helmet" && slotContent.Body?.name === "Storm-Bear Armor") {
		sumOfModifiers["Heavy Armor"].items += sign * value;
		return;
	}
	if (name === "Storm-Bear Armor" && slotContent.Head?.name === "Storm-Bear Helmet") {
		sumOfModifiers["Heavy Armor"].items += sign * value;
		return;
	}
	const mod = percentageModifiers[name];
	if (mod) {
		for (const [key, value] of Object.entries(mod)) {
			sumOfModifiers[key].items += sign * value;
		}
	}
}
function setItemSkillBonus(name, sign, otherObj) {
	const item = otherObj ?? skillModifiers[name];
	if (!item) return;
	for (const [key, value] of Object.entries(item)) {
		const skill = charSkills[key];
		skill.otherSource += sign * value;
		skill.total = skill.ownSkill + skill.otherSource;
	}
}
function setTheLordStone(name, sign) {
	if (name === "The Lord Stone") {
		basicValues[name] += sign * 50;
		calcTotalValue();
		displayPhysValues();
		return;
	}
}
function setAncientKnowledge(name, sign) {
	if (name === "Ancient Knowledge") {
		sumOfModifiers["Dwarven Heavy"].knowledge += sign * .25;
		sumOfModifiers["Dwarven Light"].knowledge += sign * .25;;
		calcTotalValue();
		displayPhysValues();
		return;
	}
}
function calcWeaponSkillMod(skill) {
	if (skill === "One-Handed" || skill === "Two-Handed" || skill === "Archery") {
		sumOfModifiers[skill].skill = charSkills[skill].total / 200;
	}
}
function calcArmorSkillMod(skill) {
	if (skill === "Heavy Armor" || skill === "Light Armor") {
		sumOfModifiers[skill].skill = .4 * charSkills[skill].total / 100;
	}
}
function calcTotalValue() {
	let armorSum = 0, shieldsSum = 0, damageSum = 0;
	for (const i of weaponSkills) {
		damageSum += Math.round(basicValues[i] * (1 + sumOfModifiers[i].skill) * (1 + sumOfModifiers[i].perks) * (1 + sumOfModifiers[i].items) * (1 + sumOfModifiers[i].seeker));
	}
	for (const key in armorOnMods) {
		const arr = armorOnMods[key];
		const mod = sumOfModifiers[key];
		for (let i = 0, len = arr.length; i < len; i++) {
			const armor = basicValues[arr[i]];
			for (const slot in armor) {
				const value = armor[slot];
				armorSum += Math.round(Math.ceil(value * (1 + mod.skill)) * (1 + mod.sameType) * (1 + mod.sameSet) *	(1 + mod.items) * (1 + mod.seeker) * (1 + mod.perks) * (1 + (sumOfModifiers[arr[i]]?.knowledge ?? 0)));
			}
		}
	}
	for (const key in shieldKeys) {
		const value = basicValues[shieldKeys[key]], mod = sumOfModifiers[key];
		shieldsSum += Math.round(Math.ceil(value * (1 + mod.skill)) * (1 + mod.sameType) * (1 + mod.sameSet) *	(1 + mod.items) * (1 + mod.seeker));
	}
	totalValues.totalArmor = armorSum + shieldsSum + basicValues["The Lord Stone"] + basicValues.nonArmor + basicValues.setBonus;
	totalValues.totalDamage = damageSum;
}
function setSeekerMod(name, sign) {
	const mod = percentageModifiers[name];
	if (mod) {
		for (const [key, value] of Object.entries(mod)) sumOfModifiers[key].seeker += sign * value;
		calcTotalValue();
	}
}
function displayPhysValues() {
	physicalValues["totalArmor"].textContent = totalValues.totalArmor;
	physicalValues["totalDamage"].textContent = totalValues.totalDamage;
	physicalValues["totalWeight"].textContent = totalValues.totalWeight;
	calcAndDisplayPhysProtection();
}
function calcAndDisplayPhysProtection() {
	let pieces = 0;
	for (const i of slotsToCheckArmor) {
		if (slotContent[i]?.category === "Armor" || slotContent[i]?.category === "Shields") ++pieces;
	}
	let reduction = Math.round((totalValues.totalArmor * .12 + (3 * pieces)) * 10) / 10;
	if (reduction >= 80) reduction = 80;
	physicalValues["physProtection"].textContent = reduction + " %";
	fillArmor(mapCanvases["totalArmor"], reduction);
}
export {calcWeaponSkillMod, calcArmorSkillMod, calcTotalValue, setPhysStats, setItemSkillBonus, basicValues, sumOfModifiers, displayPhysValues, setTheLordStone, setAncientKnowledge, setSeekerMod};