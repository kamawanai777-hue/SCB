import {setItemSkillBonus, basicValues, sumOfModifiers} from "./calc_items_values.js";
import {slotContent} from "./equip_items.js";
import {state, updateState} from "./store.js";
const armorSets = {
	Nightingale: ["Nightingale Armor", "Nightingale Boots", "Nightingale Gloves", "Nightingale Hood"],
	Shrouded: ["Shrouded Armor", "Shrouded Boots", "Shrouded Cowl", "Shrouded Gloves", "Ancient Shrouded Armor", "Ancient Shrouded Boots", "Ancient Shrouded Cowl", "Ancient Shrouded Gloves", "Worn Shrouded Armor", "Worn Shrouded Boots", "Worn Shrouded Cowl", " WornShrouded Gloves", "Tumblerbane Gloves"],
	Deathbrand: ["Deathbrand Armor", "Deathbrand Boots", "Deathbrand Gauntlets", "Deathbrand Helm"],
	Ahzidal: ["Ahzidal's Armor of Retribution", "Ahzidal's Boots of Waterwalking", "Ahzidal's Gauntlets of Warding", "Ahzidal's Helm of Vision", "Ahzidal's Ring of Necromancy", "Ahzidal's Ring of Arcana", "Ahzidal"],
};
const armorSet = {
	Nightingale: 25,
	Shrouded: 25,
	Deathbrand: 100,
	Ahzidal: {
		"Enchanting": 10,
	}
};
const deathbrandParts = {
	"Deathbrand Armor": {
		isOn: false,
		counted: false,
	},
	"Deathbrand Boots": {
		isOn: false,
		counted: false,
	},
	"Deathbrand Gauntlets": {
		isOn: false,
		counted: false,
	},
	"Deathbrand Helm": {
		isOn: false,
		counted: false,
	},
};
function checkForSet(name, sign) {
	let setName = ["Ahzidal", "Deathbrand", "Nightingale", "Shrouded", "Tumblerbane"].find(e => name.includes(e));
	if (!setName) return;
	if (setName === "Tumblerbane") setName = "Shrouded";
	let counter = 0;
	if (sign === 1) {
		updateState(s => { if (!s.equipment.partsOfSet.includes(name)) s.equipment.partsOfSet.push(name); });
		for (const i of armorSets[setName]) state.equipment.partsOfSet.includes(i) && counter++;
	} else if (sign === -1) {
		for (const i of armorSets[setName]) state.equipment.partsOfSet.includes(i) && counter++;
		updateState(s => { s.equipment.partsOfSet = s.equipment.partsOfSet.filter(item => item !== name); });
	}
	if (counter === 4) {
		if (setName === "Ahzidal") {
			setItemSkillBonus(name, sign, armorSet[setName]);
			return;
		}
		basicValues.setBonus += sign * armorSet[setName];
	}
}
function setDeathbrand(slot, name, sign) {
	const cancelBonus = () => {
		for (const i of Object.values(deathbrandParts)) {
			if (i.isOn) {
				i.counted = false;
				sumOfModifiers["One-Handed"].items += sign * .1;
			}
		}
	}
	if (sign === 1) {
		if (name.includes("Deathbrand")) deathbrandParts[name].isOn = true;
		if (deathbrandParts["Deathbrand Gauntlets"].isOn && slotContent.Left && slotContent.Right) {
			for (const i of Object.values(deathbrandParts)) {
				if (i.isOn && !i.counted) {
					i.counted = true;
					sumOfModifiers["One-Handed"].items += sign * .1;
				}
			}
		}
	} else if (sign === -1) {
		if ((slot === "Left" || slot === "Right") && deathbrandParts["Deathbrand Gauntlets"].isOn) {
			cancelBonus();
		} else if (name === "Deathbrand Gauntlets" && slotContent.Left && slotContent.Right) {
			cancelBonus();
			deathbrandParts[name].isOn = false;
		} else if (name.includes("Deathbrand")) {
			deathbrandParts[name].isOn = false;
			deathbrandParts[name].counted = false;
			if (deathbrandParts["Deathbrand Gauntlets"].isOn && slotContent.Left && slotContent.Right) sumOfModifiers["One-Handed"].items += sign * .1;
		}
	}
}
export {setDeathbrand, checkForSet};