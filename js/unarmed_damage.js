import {dom} from "./dom.js";
import {state} from "./store.js";
import {slotContent} from "./equip_items.js";
import {selectedPerks} from "./skills.js"
import {cachedItems} from "./items_menu.js";
const unarmedBaseDam = {
	Argonian: 10,
	Breton: 4,
	"Dark Elf": 4,
	"High Elf": 4,
	Imperial: 4,
	Khajiit: 22,
	Nord: 4,
	Orc: 4,
	Redguard: 4,
	"Wood Elf": 4,
};
const enchUnarmArms = {
	"Gloves of the Pugilist": 10,
	"Brawler's Scaled Bracers": 10,
	"Brawler's Leather Bracers": 10,
	"Brawler's Hide Bracers": 10,
	"Brawler's Glass Gauntlets": 14,
	"Brawler's Fur Bracers": 8,
	"Brawler's Elven Gauntlets": 12,
	"Brawler's Dragonscale Gauntlets": 16,
	"Brawler's Steel Plate Gauntlets": 14,
	"Brawler's Steel Gauntlets": 12,
	"Brawler's Orcish Gauntlets": 14,
	"Brawler's Iron Gauntlets": 10,
	"Brawler's Ebony Gauntlets": 16,
	"Brawler's Dwarven Gauntlets": 12,
	"Brawler's Dragonplate Gauntlets": 20,
	"Brawler's Daedric Gauntlets": 18,
};
function displayUnarmedDamage() {
	let totalUnarmedDam = unarmedBaseDam[state.character.race];
	const armguards = slotContent.Arms?.name;
	if (armguards) {
		if (selectedPerks["Heavy Armor"].includes("Fists of Steel")) {
			const areHeavy = cachedItems["Armor"]["Heavy"][armguards];
			if (areHeavy) {
				totalUnarmedDam += areHeavy.armorRating;
			}
		}
		const ench = enchUnarmArms[armguards];
		if (ench) totalUnarmedDam += ench ;
		if (armguards === "Fists of Randagulf") totalUnarmedDam *= 1.2;
		if (armguards === "Imperial Dragon Gauntlets") totalUnarmedDam *= 1.1;
	}
	if (state.boons.selectedBlessings.includes("Seeker of Might")) totalUnarmedDam *= 1.1;
	totalUnarmedDam = Math.round(totalUnarmedDam);
	dom.unarmedDamageDom.textContent = totalUnarmedDam;
}
export {displayUnarmedDamage};