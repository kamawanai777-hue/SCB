import {dom} from "./dom.js";
import {resistancesKeys, fillResistances, mapCanvases, resistancesParams} from "./canvas.js";
const resistances = {
	Argonian: {
		disease: 50,
	},
	Breton: {
		magic: 25,
	},
	"Dark Elf": {
		fire: 50,
	},
	Nord: {
		frost: 50,
	},
	Redguard: {
		poison: 50,
	},
	"Wood Elf": {
		poison: 50,
		disease: 50,
	},
	"Shield of Ysgramor": {
		magic: 20,
	},
	"Shield of Solitude": {
		magic: 30,
	},
	"Storm-Bear Shield": {
		frost: 10,
	},
	"Imperial Dragon Shield": {
		fire: 10,
	},
	"Shrouded Armor": {
		poison: 50,
	},
	"Savior's Hide": {
		magic: 15,
		poison: 50,
	},
	"Nightingale Armor": {
		frost: 50,
	},
	"Ancient Shrouded Armor": {
		poison: 100,
	},
	"Reforged Gauntlets of the Crusader": {
		disease: 50,
	},
	Zahkriisos: {
		shock: 50,
	},
	Otar: {
		fire: 30,
		fire: 30,
		shock: 30,
	},
	Hevnoraak: {
		disease: 100,
		poison: 100,
	},
	"Helm of Yngol": {
		frost: 30,
	},
	Dukaan: {
		frost: 50,
	},
	Ahzidal: {
		fire: 50,
	},
	Wraithguard: {
		shock: 10,
		fire: 10,
		frost: 10,
		magic: 10,
		disease: 10,
		poison: 10,
	},
	"Storm-Bear Boots": {
		frost: 20,
	},
	"Storm-Bear Armor": {
		frost: 20,
	},
	"Lord's Mail": {
		poison: 75,
		magic: 17,
	},
	"Imperial Dragon Boots": {
		fire: 20,
	},
	"Imperial Dragon Armor": {
		fire: 30,
		frost: 30,
		shock: 30,
	},
	"Gauntlets of the Crusader": {
		disease: 50,
	},
	"Ancient Helmet of the Unburned": {
		fire: 40,
	},
	"Telvanni Shoes": {
		shock: 70,
	},
	"Archmage's Boots": {
		shock: 40,
	},
	"Denstagmer's Ring": {
		fire: 20,
		frost: 20,
		shock: 20,
	},
	"Ring of Phynaster": {
		magic: 20,
		shock: 20,
		poison: 20,
	},
	"Nightingale Armor": {
		frost: 50,
	},
	"Ancient Shrouded Armor": {
		poison: 100,
	},
	"Shrouded Armor": {
		poison: 50,
	},
	"Magic Resistance": {
		magic: 10,
	},
	"The Apprentice Stone": {
		magic: -100,
	},
	"The Lord Stone": {
		magic: 25,
	},
	"Agent of Mara": {
		magic: 15,
	},
};
const currentRes = {
	magic: 0,
	fire: 0,
	fireTotal: 0,
	frost: 0,
	frostTotal: 0,
	shock: 0,
	shockTotal: 0,
	poison: 0,
	disease: 0,
};
const magicResistances = {};
for (const i of dom.resistances) magicResistances[i.dataset.resistances] = i;
function setMagicResistances(name, sign) {
	const r = resistances[name];
	if (!r) return;
	if (r.magic) {
		currentRes.magic += sign * r.magic;
		currentRes.fireTotal += sign * r.magic;
		currentRes.frostTotal += sign * r.magic;
		currentRes.shockTotal += sign * r.magic;
	}
	if (r.fire) {
		currentRes.fire += sign * r.fire;
		currentRes.fireTotal += sign * r.fire;
	}
	if (r.frost) {
		currentRes.frost += sign * r.frost;
		currentRes.frostTotal += sign * r.frost;
	}
	if (r.shock) {
		currentRes.shock += sign * r.shock;
		currentRes.shockTotal += sign * r.shock;
	}
	if (r.poison) currentRes.poison += sign * r.poison;
	if (r.disease) currentRes.disease += sign * r.disease;
	for (const i of resistancesKeys) fillResistances(mapCanvases[i], currentRes[i], resistancesParams[i]);
	displayResistances();
}
function displayResistances() {
	for (const [key, value] of Object.entries(currentRes)) {
		if (key.includes("Total")) {
			if (value >= 97.75) {
				magicResistances[key].textContent = 97.75 + " %";
			} else {
				magicResistances[key].textContent = value + " %";
			}
		} else if (key === "disease") {
			if (value >= 100) {
				magicResistances[key].textContent = 100 + " %";
			} else {
				magicResistances[key].textContent = value + " %";
			}
		} else {
			if (value >= 85) {
				magicResistances[key].textContent = 85 + " %";
			} else {
				magicResistances[key].textContent = value + " %";
			}
		}
	}
}
export {setMagicResistances};