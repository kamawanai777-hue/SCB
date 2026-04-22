import {dom} from "./dom.js";
import {state} from "./store.js";
import {standingStones, blessings} from "./boons.js";
import {toggleTitle} from "./info_tabs.js";
const racialBonuses = {
	Argonian: {
		"Resist Disease": "Your Argonian blood gives you 50% resistant to disease.",
		"Waterbreathing": "You can stay underwater without drowning.",
	},
	Breton: {
		"Resist Magic": " Breton blood grants you a 25% resistance to magic.",
	},
	"Dark Elf": {
		"Resist Fire": "Your Dark Elf blood gives you 50% resistance to fire.",
	},
	"High Elf": {
		Highborn: "High Elves are born with 50 extra magicka.",
	},
	Imperial: {
		"Imperial Luck": "Imperials always find more gold.",
	},
	Khajiit: {
		Claws: "Khajiit claws do 12 points of damage in addition to unarmed damage.",
	},
	Nord: {
		"Resist Frost": "Your Nord blood gives you 50% resistance to frost.",
	},
	Redguard: {
		"Resist Poison": "Your Redguard blood gives you 50% resistance to poison.",
	},
	"Wood Elf": {
		"Resist Disease": "Your Wood Elf blood gives you 50% resistance to disease.",
		"Resist Poison": "Your Wood Elf blood gives you 50% resistance to poison.",
	},
};
const mapPassiveEffects = {};
let passEffcounter = 0, racialPassive = false;
function setBoonDescription(boon, bool) {
	const boonDesc = standingStones[boon] ?? blessings[boon];
	if (bool) {
		const fragment = dom.passEffTemp.content.cloneNode(true);
		const term = fragment.querySelector(".passive-effects__term");
		const desc = fragment.querySelector(".passive-effects__desc");
		term.textContent = boon;
		desc.textContent = boonDesc;
		dom.dlPassEff.appendChild(fragment);
		mapPassiveEffects[boon] = [term, desc];
		if (passEffcounter === 0 && !racialPassive) toggleTitle(".info-win__passive-effects-section");
		++passEffcounter;
		dom.passEffNothing.classList.add("hidden");
	} else {
		if (mapPassiveEffects[boon]) {
			for (const i of mapPassiveEffects[boon]) i.remove();
			delete mapPassiveEffects[boon];
		}
		--passEffcounter;
		if (passEffcounter === 0 && !racialPassive) toggleTitle(".info-win__passive-effects-section");
	}
}
function setRaceAbilityDesc() {
	if (!racialBonuses[state.character.race]) return;
	for (const [key, value] of Object.entries(racialBonuses[state.character.race])) {
		const fragment = dom.passEffTemp.content.cloneNode(true);
		const term = fragment.querySelector(".passive-effects__term");
		const desc = fragment.querySelector(".passive-effects__desc");
		term.textContent = key;
		desc.textContent = value;
		dom.dlPassEff.appendChild(fragment);
	}
	racialPassive = true;
	dom.passEffNothing.classList.add("hidden");
}
export {setRaceAbilityDesc, setBoonDescription};