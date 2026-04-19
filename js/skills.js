import {isDesktop, raceSkills} from "./other.js";
import {dom} from "./dom.js";
import {menuToDefaultView} from "./items_menu.js";
import {toggleMenu} from "./main_win.js";
import {state, updateState} from "./store.js";
import {toggleTitle} from "./info_tabs.js";
import {setMagicResistances} from "./magic_resistances.js";
import {displayUnarmedDamage} from "./unarmed_damage.js";
import {skills, addPerkSection, returnLi, addLiPerks, updateTextSkill, deleteLiPerks, deletePerkSection, updateTextPerk} from "./add_skills.js";
import {setBonusForSameType} from "./same_type.js";
import {checkMatchingSetPerk} from "./same_set.js";
import {calcCharLevel} from "./calc_char_level.js";
import {calcArmorSkillMod, calcWeaponSkillMod, calcTotalValue, displayPhysValues, sumOfModifiers} from "./calc_items_values.js";
const charSkills = {
	Alchemy: {
		ownSkill: 0,
		otherSource: 0,
		total: 0,
	},
	Alteration: {
		ownSkill: 0,
		otherSource: 0,
		total: 0,
	},
	Archery: {
		ownSkill: 0,
		otherSource: 0,
		total: 0,
	},
	Block: {
		ownSkill: 0,
		otherSource: 0,
		total: 0,
	},
	Conjuration: {
		ownSkill: 0,
		otherSource: 0,
		total: 0,
	},
	Destruction: {
		ownSkill: 0,
		otherSource: 0,
		total: 0,
	},
	Enchanting: {
		ownSkill: 0,
		otherSource: 0,
		total: 0,
	},
	"Heavy Armor": {
		ownSkill: 0,
		otherSource: 0,
		total: 0,
	},
	Illusion: {
		ownSkill: 0,
		otherSource: 0,
		total: 0,
	},
	"Light Armor": {
		ownSkill: 0,
		otherSource: 0,
		total: 0,
	},
	Lockpicking: {
		ownSkill: 0,
		otherSource: 0,
		total: 0,
	},
	"One-Handed": {
		ownSkill: 0,
		otherSource: 0,
		total: 0,
	},
	Pickpocket: {
		ownSkill: 0,
		otherSource: 0,
		total: 0,
	},
	Restoration: {
		ownSkill: 0,
		otherSource: 0,
		total: 0,
	},
	Smithing: {
		ownSkill: 0,
		otherSource: 0,
		total: 0,
	},
	Sneak: {
		ownSkill: 0,
		otherSource: 0,
		total: 0,
	},
	Speech: {
		ownSkill: 0,
		otherSource: 0,
		total: 0,
	},
	"Two-Handed": {
		ownSkill: 0,
		otherSource: 0,
		total: 0,
	},
};
const perksModifiers = {
	Overdraw: {
		Archery: .2,
	},
	Juggernaut: {
		"Heavy Armor": .2,
	},
	Armsman: {
		"One-Handed": .2,
	},
	Barbarian: {
		"Two-Handed": .2,
	},
	"Agile Defender": {
		"Light Armor": .2,
	},
};
const numberOfChosenPerks = {
	Illusion: 0,
	Conjuration: 0,
	Destruction: 0,
	Restoration: 0,
	Alteration: 0,
	Enchanting: 0,
	Smithing: 0,
	"Heavy Armor": 0,
	Block: 0,
	"Two-Handed": 0,
	"One-Handed": 0,
	Archery: 0,
	"Light Armor": 0,
	Sneak: 0,
	Lockpicking: 0,
	Pickpocket: 0,
	Speech: 0,
	Alchemy: 0,
};
const maxPerksByTree = {
	Illusion: 13,
	Conjuration: 16,
	Destruction: 17,
	Restoration: 13,
	Alteration: 14,
	Enchanting: 13,
	Smithing: 10,
	"Heavy Armor": 12,
	Block: 13,
	"Two-Handed": 19,
	"One-Handed": 21,
	Archery: 16,
	"Light Armor": 10,
	Sneak: 13,
	Lockpicking: 11,
	Pickpocket: 12,
	Speech: 13,
	Alchemy: 15,
};
const startingPerks = {
	"Illusion": "Novice Illusion",
	"Conjuration": "Novice Conjuration",
	"Destruction": "Novice Destruction",
	"Restoration": "Novice Restoration",
	"Alteration": "Novice Alteration",
	"Enchanting": "Enchanter",
	"Smithing": "Steel Smithing",
	"Heavy Armor": "Juggernaut",
	"Block": "Shield Wall",
	"Two-Handed": "Barbarian",
	"One-Handed": "Armsman",
	"Archery": "Overdraw",
	"Light Armor": "Agile Defender",
	"Sneak": "Stealth",
	"Lockpicking": "Novice Locks",
	"Pickpocket": "Light Fingers",
	"Speech": "Haggling",
	"Alchemy": "Alchemist"
};
const perksOverall = {
	Alteration: {
		maxPerks: 14,
		chosenPerks: 0,
		"Novice Alteration": {
			description: "Cast Novice level Alteration spells for half magicka.",
			skill: 0,
		},
		"Alteration Dual Casting": {
			description: "Dual casting an Alteration spell overcharges the effects into an even more powerful version.",
			skill: 20,
		},
		"Apprentice Alteration": {
			description: "Cast Apprentice level Alteration spells for half magicka.",
			skill: 25,
		},
		"Magic Resistance": {
			isRanked: true,
			rankNow: 0,
			maxRank: 3,
			rankDesc: {
				1: "Blocks 10% of a spell's effects.",
				2: "Blocks 20% of a spell's effects.",
				3: "Blocks 30% of a spell's effects.",
			},
			rankSkill: {
				1: 30,
				2: 50,
				3: 70,
			},
			description: "Blocks 10% of a spell's effects.",
			skill: 30,
		},
		"Adept Alteration": {
			description: "Cast Adept level Alteration spells for half magicka.",
			skill: 50,
		},
		"Expert Alteration": {
			description: "Cast Expert level Alteration spells for half magicka.",
			skill: 75,
		},
		"Atronach": {
			description: "Absorb 30% of the magicka of any spells that hit you.",
			skill: 100,
		},
		"Master Alteration": {
			description: "Cast Master level Alteration spells for half magicka.",
			skill: 100,
		},
		"Stability": {
			description: "Alteration spells have 50% greater duration.",
			skill: 70,
		},
		"Mage Armor": {
			isRanked: true,
			rankNow: 0,
			maxRank: 3,
			rankDesc: {
				1: "Protection spells like Stoneflesh are twice as strong if not wearing armor.",
				2: "Protection spells like Stoneflesh are 2.5 times as strong if not wearing armor.",
				3: "Protection spells like Stoneflesh are three times as strong if not wearing armor.",
			},
			rankSkill: {
				1: 30,
				2: 50,
				3: 70,
			},
			description: "Protection spells like Stoneflesh are twice as strong if not wearing armor.",
			skill: 30,
		},
	},
	Conjuration: {
		maxPerks: 16,
		chosenPerks: 0,
		"Novice Conjuration": {
			description: "Cast Novice level Conjuration spells for half magicka.",
			skill: 0,
		},
		"Apprentice Conjuration": {
			description: "Cast Apprentice level Conjuration spells for half magicka.",
			skill: 25,
		},
		"Adept Conjuration": {
			description: "Cast Adept level Conjuration spells for half magicka.",
			skill: 50,
		},
		"Expert Conjuration": {
			description: "Cast Expert level Conjuration spells for half magicka.",
			skill: 75,
		},
		"Master Conjuration": {
			description: "Cast Master level Conjuration spells for half magicka.",
			skill: 100,
		},
		"Conjuration Dual Casting": {
			description: "Dual casting a Conjuration spell overcharges the spell, allowing it to last longer.",
			skill: 20,
		},
		"Mystic Binding": {
			description: "Bound weapons do more damage.",
			skill: 20,
		},
		"Soul Stealer": {
			description: "Bound weapons cast Soul Trap on targets.",
			skill: 30,
		},
		"Oblivion Binding": {
			description: "Bound weapons will banish summoned creatures and turn raised ones.",
			skill: 50,
		},
		"Necromancy": {
			description: "Greater duration for reanimated undead.",
			skill: 40,
		},
		"Dark Souls": {
			description: "Reanimated undead have 100 points more health.",
			skill: 70,
		},
		"Summoner": {
			isRanked: true,
			rankNow: 0,
			maxRank: 2,
			rankDesc: {
				1: "Can summon atronachs or raise undead twice as far away.",
				2: "Can summon atronachs or raise undead three times as far away.",
			},
			rankSkill: {
				1: 30,
				2: 70,
			},
			description: "Can summon atronachs or raise undead twice as far away.",
			skill: 30,
		},
		"Atromancy": {
			description: "Double duration for conjured Atronachs.",
			skill: 40,
		},
		"Elemental Potency": {
			description: "Conjured Atronachs are 50% more powerful.",
			skill: 80,
		},
		"Twin Souls": {
			description: "You can have two atronachs or reanimated zombies.",
			skill: 100,
		},
	},
	Destruction: {
		maxPerks: 17,
		chosenPerks: 0,
		"Novice Destruction": {
			description: "Cast Novice level Destruction spells for half magicka.",
			skill: 0,
		},
		"Apprentice Destruction": {
			description: "Cast Apprentice level Destruction spells for half magicka.",
			skill: 25,
		},
		"Adept Destruction": {
			description: "Cast Adept level Destruction spells for half magicka.",
			skill: 50,
		},
		"Expert Destruction": {
			description: "Cast Expert level Destruction spells for half magicka.",
			skill: 75,
		},
		"Master Destruction": {
			description: "Cast Master level Destruction spells for half magicka.",
			skill: 100,
		},
		"Rune Master": {
			description: "Can place runes five times farther away.",
			skill: 40,
		},
		"Augmented Flames": {
			isRanked: true,
			rankNow: 0,
			maxRank: 2,
			rankDesc: {
				1: "Fire spells do 25% more damage.",
				2: "Fire spells do 50% more damage.",
			},
			rankSkill: {
				1: 30,
				2: 60,
			},
			description: "Fire spells do 25% more damage.",
			skill: 30,
		},
		"Intense Flames": {
			description: "Fire damage causes targets to flee if their health is low.",
			skill: 50,
		},
		"Augmented Frost": {
			isRanked: true,
			rankNow: 0,
			maxRank: 2,
			rankDesc: {
				1: "Frost spells do 25% more damage.",
				2: "Frost spells do 50% more damage.",
			},
			rankSkill: {
				1: 30,
				2: 60,
			},
			description: "Frost spells do 25% more damage.",
			skill: 30,
		},
		"Deep Freeze": {
			description: "Frost damage paralyzes targets if their health is low.",
			skill: 60,
		},
		"Augmented Shock": {
			isRanked: true,
			rankNow: 0,
			maxRank: 2,
			rankDesc: {
				1: "Shock spells do 25% more damage.",
				2: "Shock spells do 50% more damage.",
			},
			rankSkill: {
				1: 30,
				2: 60,
			},
			description: "Shock spells do 25% more damage.",
			skill: 30,
		},
		"Disintegrate": {
			description: "Shock spells disintegrate targets if their health is low.",
			skill: 70,
		},
		"Destruction Dual Casting": {
			description: "Dual casting a Destruction spell overcharges the effects into an even more powerful version.",
			skill: 20,
		},
		"Impact": {
			description: "Most destruction spells will stagger an opponent when dual cast.",
			skill: 40,
		},
	},
	Enchanting: {
		maxPerks: 13,
		chosenPerks: 0,
		"Enchanter": {
			isRanked: true,
			rankNow: 0,
			maxRank: 5,
			rankDesc: {
				1: "New enchantments are 20% stronger.",
				2: "New enchantments are 40% stronger.",
				3: "New enchantments are 60% stronger.",
				4: "New enchantments are 80% stronger.",
				5: "New enchantments are 100% stronger.",
			},
			rankSkill: {
				1: 0,
				2: 20,
				3: 40,
				4: 60,
				5: 80,
			},
			description: "New enchantments are 20% stronger.",
			skill: 0,
		},
		"Fire Enchanter": {
			description: "Fire enchantments on weapons and armor are 25% stronger.",
			skill: 30,
		},
		"Frost Enchanter": {
			description: "Frost enchantments on weapons and armor are 25% stronger.",
			skill: 40,
		},
		"Storm Enchanter": {
			description: "Shock enchantments on weapons and armor are 25% stronger.",
			skill: 50,
		},
		"Insightful Enchanter": {
			description: "Skill enchantments on armor are 25% stronger.",
			skill: 50,
		},
		"Corpus Enchanter": {
			description: "Health, magicka, and stamina enchantments on armor are 25% stronger.",
			skill: 70,
		},
		"Extra Effect": {
			description: "Can put two enchantments on the same item.",
			skill: 100,
		},
		"Soul Squeezer": {
			description: "Soul gems provide extra magicka for recharging.",
			skill: 20,
		},
		"Soul Siphon": {
			description: "Death blows to creatures, but not people, trap 5% of the victim's soul, recharging the weapon.",
			skill: 40,
		},
	},
	Illusion: {
		maxPerks: 13,
		chosenPerks: 0,
		"Novice Illusion": {
			description: "Cast Novice level Illusion spells for half magicka.",
			skill: 0,
		},
		"Animage": {
			description: "Illusion spells now work on higher level animals.",
			skill: 20,
		},
		"Kindred Mage": {
			description: "All Illusion spells work on higher level people.",
			skill: 40,
		},
		"Quiet Casting": {
			description: "All spells you cast from any school of magic are silent to others.",
			skill: 50,
		},
		"Apprentice Illusion": {
			description: "Cast Apprentice level Illusion spells for half magicka.",
			skill: 25,
		},
		"Adept Illusion": {
			description: "Cast Adept level Illusion spells for half magicka.",
			skill: 50,
		},
		"Expert Illusion": {
			description: "Cast Expert level Illusion spells for half magicka.",
			skill: 75,
		},
		"Master Illusion": {
			description: "Cast Master level Illusion spells for half magicka.",
			skill: 100,
		},
		"Hypnotic Gaze": {
			description: "Calm spells now work on higher level opponents. Cumulative with Kindred Mage and Animage.",
			skill: 30,
		},
		"Aspect of Terror": {
			description: "Fear spells work on higher level opponents. Cumulative with Kindred Mage and Animage.",
			skill: 50,
		},
		"Rage": {
			description: "Frenzy spells work on higher level opponents. Cumulative with Kindred Mage and Animage.",
			skill: 70,
		},
		"Master of the Mind": {
			description: "Illusion spells work on undead, daedra, and automatons.",
			skill: 90,
		},
		"Illusion Dual Casting": {
			description: "Dual casting an Illusion spell overcharges the effects into an even more powerful version.",
			skill: 20,
		},
	},
	Restoration: {
		maxPerks: 13,
		chosenPerks: 0,
		"Novice Restoration": {
			description: "Cast Novice level Restoration spells for half magicka.",
			skill: 0,
		},
		"Apprentice Restoration": {
			description: "Cast Apprentice level Restoration spells for half magicka.",
			skill: 25,
		},
		"Adept Restoration": {
			description: "Cast Adept level Restoration spells for half magicka.",
			skill: 50,
		},
		"Expert Restoration": {
			description: "Cast Expert level Restoration spells for half magicka.",
			skill: 75,
		},
		"Master Restoration": {
			description: "Cast Master level Restoration spells for half magicka.",
			skill: 100,
		},
		"Recovery": {
			isRanked: true,
			rankNow: 0,
			maxRank: 2,
			rankDesc: {
				1: "Magicka regenerates 25% faster.",
				2: "Magicka regenerates 50% faster.",
			},
			rankSkill: {
				1: 30,
				2: 60,
			},
			description: "Magicka regenerates 25% faster.",
			skill: 30,
		},
		"Avoid Death": {
			description: "Once a day, heals 250 points automatically if you fall below 10% health.",
			skill: 90,
		},
		"Regeneration": {
			description: "Healing spells cure 50% more.",
			skill: 20,
		},
		"Necromage": {
			description: "All spells are more effective against undead.",
			skill: 70,
		},
		"Respite": {
			description: "Healing spells also restore Stamina.",
			skill: 40,
		},
		"Restoration Dual Casting": {
			description: "Dual casting a Restoration spell overcharges the effects into an even more powerful version.",
			skill: 20,
		},
		"Ward Absorb": {
			description: "Wards recharge your magicka when hit with spells.",
			skill: 60,
		},
	},
	Archery: {
		maxPerks: 16,
		chosenPerks: 0,
		"Overdraw": {
			isRanked: true,
			rankNow: 0,
			maxRank: 5,
			rankDesc: {
				1: "Bows do 20% more damage.",
				2: "Bows do 40% more damage.",
				3: "Bows do 60% more damage.",
				4: "Bows do 80% more damage.",
				5: "Bows do 100% more damage.",
			},
			rankSkill: {
				1: 0,
				2: 20,
				3: 40,
				4: 60,
				5: 80,
			},
			description: "Bows do 20% more damage.",
			skill: 0,
		},
		"Critical Shot": {
			isRanked: true,
			rankNow: 0,
			maxRank: 3,
			rankDesc: {
				1: "10% chance of a critical hit that does extra damage.",
				2: "15% chance of a critical hit that does 25% more critical damage.",
				3: "20% chance of a critical hit that does 50% more critical damage.",
			},
			rankSkill: {
				1: 30,
				2: 60,
				3: 90,
			},
			description: "10% chance of a critical hit that does extra damage.",
			skill: 30,
		},
		"Hunter's Discipline": {
			description: "Recover twice as many arrows from dead bodies.",
			skill: 50,
		},
		"Ranger": {
			description: "Able to move faster with a drawn bow.",
			skill: 60,
		},
		"Eagle Eye": {
			description: "Pressing Block while aiming will zoom in your view.",
			skill: 30,
		},
		"Power Shot": {
			description: "Arrows stagger all but the largest opponents 50% of the time.",
			skill: 50,
		},
		"Quick Shot": {
			description: "Can draw a bow 30% faster.",
			skill: 70,
		},
		"Steady Hand": {
			isRanked: true,
			rankNow: 0,
			maxRank: 2,
			rankDesc: {
				1: "Zooming in with a bow slows time by 25%.",
				2: "Zooming in with a bow slows time by 50%.",
			},
			rankSkill: {
				1: 40,
				2: 60,
			},
			description: "Zooming in with a bow slows time by 25%.",
			skill: 40,
		},
		"Bullseye": {
			description: "15% chance of paralyzing the target for a few seconds.",
			skill: 100,
		},
	},
	Block: {
		maxPerks: 13,
		chosenPerks: 0,
		"Shield Wall": {
			isRanked: true,
			rankNow: 0,
			maxRank: 5,
			rankDesc: {
				1: "Blocking is 10% more effective.",
				2: "Blocking is 20% more effective.",
				3: "Blocking is 30% more effective.",
				4: "Blocking is 40% more effective.",
				5: "Blocking is 50% more effective.",
			},
			rankSkill: {
				1: 0,
				2: 20,
				3: 40,
				4: 60,
				5: 80,
			},
			description: "Blocking is 10% more effective.",
			skill: 0,
		},
		"Deflect Arrows": {
			description: "Arrows that hit the shield do no damage.",
			skill: 30,
		},
		"Elemental Protection": {
			description: "Blocking with a shield reduces incoming fire, frost, and shock damage by 50%.",
			skill: 50,
		},
		"Block Runner": {
			description: "Able to move faster with a shield or weapon raised.",
			skill: 70,
		},
		"Power Bash": {
			description: "Able to do a power bash.",
			skill: 30,
		},
		"Deadly Bash": {
			description: "Bashing does five times more damage.",
			skill: 50,
		},
		"Disarming Bash": {
			description: "Chance to disarm when power bashing.",
			skill: 70,
		},
		"Shield Charge": {
			description: "Sprinting with a shield raised knocks down most targets.",
			skill: 100,
		},
		"Quick Reflexes": {
			description: "Time slows down if you are blocking during an enemy's power attack.",
			skill: 30,
		},
	},
	"Heavy Armor": {
		maxPerks: 12,
		chosenPerks: 0,
		"Juggernaut": {
			isRanked: true,
			rankNow: 0,
			maxRank: 5,
			rankDesc: {
				1: "Increases armor rating for Heavy Armor by 20%.",
				2: "Increases armor rating for Heavy Armor by 40%.",
				3: "Increases armor rating for Heavy Armor by 60%.",
				4: "Increases armor rating for Heavy Armor by 80%.",
				5: "Increases armor rating for Heavy Armor by 100%.",
			},
			rankSkill: {
				1: 0,
				2: 20,
				3: 40,
				4: 60,
				5: 80,
			},
			description: "Increases armor rating for Heavy Armor by 20%.",
			skill: 0,
		},
		"Fists of Steel": {
			description: "Unarmed attacks with Heavy Armor gauntlets do their armor rating in extra damage.",
			skill: 30,
		},
		"Cushioned": {
			description: "Half damage from falling if wearing all Heavy Armor: head, chest, hands, feet.",
			skill: 50,
		},
		"Conditioning": {
			description: "Heavy Armor weighs nothing and doesn't slow you down when worn.",
			skill: 70,
		},
		"Well Fitted": {
			description: "25% Armor bonus if wearing all Heavy Armor: head, chest, hands, feet.",
			skill: 30,
		},
		"Tower of Strength": {
			description: "50% less stagger when wearing only Heavy Armor.",
			skill: 50,
		},
		"Matching Set": {
			description: "Additional 25% Armor bonus if wearing a matched set of Heavy Armor.",
			skill: 70,
		},
		"Reflect Blows": {
			description: "10% chance to reflect melee damage back to the enemy while wearing all Heavy Armor: head, chest, hands, feet.",
			skill: 100,
		},
	},
	"One-Handed": {
		maxPerks: 21,
		chosenPerks: 0,
		"Armsman": {
			isRanked: true,
			rankNow: 0,
			maxRank: 5,
			rankDesc: {
				1: "One-Handed weapons do 20% more damage.",
				2: "One-Handed weapons do 40% more damage.",
				3: "One-Handed weapons do 60% more damage.",
				4: "One-Handed weapons do 80% more damage.",
				5: "One-Handed weapons do 100% more damage.",
			},
			rankSkill: {
				1: 0,
				2: 20,
				3: 40,
				4: 60,
				5: 80,
			},
			description: "One-Handed weapons do 20% more damage.",
			skill: 0,
		},
		"Bladesman": {
			isRanked: true,
			rankNow: 0,
			maxRank: 3,
			rankDesc: {
				1: "Attacks with swords have a 10% chance of doing critical damage.",
				2: "Attacks with swords have a 15% chance of doing more critical damage.",
				3: "Attacks with swords have a 20% chance of doing even more critical damage.",
			},
			rankSkill: {
				1: 30,
				2: 60,
				3: 90,
			},
			description: "Attacks with swords have a 10% chance of doing critical damage.",
			skill: 30,
		},
		"Bone Breaker": {
			isRanked: true,
			rankNow: 0,
			maxRank: 3,
			rankDesc: {
				1: "Attacks with maces ignore 25% of armor.",
				2: "Attacks with maces ignore 50% of armor.",
				3: "Attacks with maces ignore 75% of armor.",
			},
			rankSkill: {
				1: 30,
				2: 60,
				3: 90,
			},
			description: "Attacks with maces ignore 25% of armor.",
			skill: 30,
		},
		"Dual Flurry": {
			isRanked: true,
			rankNow: 0,
			maxRank: 2,
			rankDesc: {
				1: "Dual wielding attacks are 20% faster.",
				2: "Dual wielding attacks are 35% faster.",
			},
			rankSkill: {
				1: 30,
				2: 50,
			},
			description: "Dual wielding attacks are 20% faster.",
			skill: 30,
		},
		"Dual Savagery": {
			description: "Dual wielding power attacks do 50% bonus damage.",
			skill: 70,
		},
		"Fighting Stance": {
			description: "Power attacks with one-handed weapons cost 25% less stamina.",
			skill: 20,
		},
		"Critical Charge": {
			description: "Can do a one-handed power attack while sprinting that does double critical damage.",
			skill: 50,
		},
		"Savage Strike": {
			description: "Standing power attacks do 25% bonus damage with a chance to decapitate your enemies.",
			skill: 50,
		},
		"Paralyzing Strike": {
			description: "Backwards power attack has a 25% chance to paralyze the target.",
			skill: 100,
		},
		"Hack and Slash": {
			isRanked: true,
			rankNow: 0,
			maxRank: 3,
			rankDesc: {
				1: "Attacks with war axes cause extra bleeding damage.",
				2: "Attacks with war axes cause more bleeding damage.",
				3: "Attacks with war axes cause even more bleeding damage.",
			},
			rankSkill: {
				1: 30,
				2: 60,
				3: 90,
			},
			description: "Attacks with war axes cause extra bleeding damage.",
			skill: 30
		},
	},
	Smithing: {
		maxPerks: 10,
		chosenPerks: 0,
		"Steel Smithing": {
			description: "Can create Steel armor and weapons at forges, and improve them twice as much.",
			skill: 0,
		},
		"Arcane Blacksmith": {
			description: "You can improve magical weapons and armor.",
			skill: 60,
		},
		"Dwarven Smithing": {
			description: "Can create Dwarven armor and weapons at forges, and improve them twice as much.",
			skill: 30,
		},
		"Orcish Smithing": {
			description: "Can create Orcish armor and weapons at forges, and improve them twice as much.",
			skill: 50,
		},
		"Ebony Smithing": {
			description: "Can create Ebony armor and weapons at forges, and improve them twice as much.",
			skill: 80,
		},
		"Daedric Smithing": {
			description: "Can create Daedric armor and weapons at forges, and improve them twice as much.",
			skill: 90,
		},
		"Elven Smithing": {
			description: "Can create Elven armor and weapons at forges, and improve them twice as much.",
			skill: 30,
		},
		"Advanced Smithing": {
			description: "Can create Scaled and Plate armor at forges, and improve them twice as much.",
			skill: 50,
		},
		"Glass Smithing": {
			description: "Can create Glass armor and weapons at forges, and improve them twice as much.",
			skill: 70,
		},
		"Dragon Armor": {
			description: "Can create Dragon armor at forges, and improve them twice as much.",
			skill: 100,
		},
	},
	"Two-Handed": {
		maxPerks: 19,
		chosenPerks: 0,
		"Barbarian": {
			isRanked: true,
			rankNow: 0,
			maxRank: 5,
			rankDesc: {
				1: "Two-Handed weapons do 20% more damage.",
				2: "Two-Handed weapons do 40% more damage.",
				3: "Two-Handed weapons do 60% more damage.",
				4: "Two-Handed weapons do 80% more damage.",
				5: "Two-Handed weapons do 100% more damage.",
			},
			rankSkill: {
				1: 0,
				2: 20,
				3: 40,
				4: 60,
				5: 80,
			},
			description: "Two-Handed weapons do 20% more damage.",
			skill: 0,
		},
		"Champion's Stance": {
			description: "Power attacks with two-handed weapons cost 25% less stamina.",
			skill: 20,
		},
		"Devastating Blow": {
			description: "Standing power attacks do 25% bonus damage with a chance to decapitate your enemies.",
			skill: 50,
		},
		"Great Critical Charge": {
			description: "Can do a two-handed power attack while sprinting that does double critical damage.",
			skill: 50,
		},
		"Sweep": {
			description: "Sideways power attacks with two-handed weapons hit all targets in front of you.",
			skill: 70,
		},
		"Warmaster": {
			description: "Backwards power attack has a 25% chance to paralyze the target.",
			skill: 100,
		},
		"Deep Wounds": {
			isRanked: true,
			rankNow: 0,
			maxRank: 3,
			rankDesc: {
				1: "Attacks with greatswords have a 10% chance of doing critical damage.",
				2: "Attacks with greatswords have a 15% chance of doing more critical damage.",
				3: "Attacks with greatswords have a 20% chance of doing even more critical damage.",
			},
			rankSkill: {
				1: 30,
				2: 60,
				3: 90,
			},
			description: "Attacks with greatswords have a 10% chance of doing critical damage.",
			skill: 30,
		},
		"Limbsplitter": {
			isRanked: true,
			rankNow: 0,
			maxRank: 3,
			rankDesc: {
				1: "Attacks with battle axes cause extra bleeding damage.",
				2: "Attacks with battle axes cause more bleeding damage.",
				3: "Attacks with battle axes cause even more bleeding damage.",
			},
			rankSkill: {
				1: 30,
				2: 60,
				3: 90,
			},
			description: "Attacks with battle axes cause extra bleeding damage.",
			skill: 30,
		},
		"Skullcrusher": {
			isRanked: true,
			rankNow: 0,
			maxRank: 3,
			rankDesc: {
				1: "Attacks with warhammers ignore 25% of armor.",
				2: "Attacks with warhammers ignore 50% of armor.",
				3: "Attacks with warhammers ignore 75% of armor.",
			},
			rankSkill: {
				1: 30,
				2: 60,
				3: 90,
			},
			description: "Attacks with warhammers ignore 25% of armor.",
			skill: 30,
		},
	},
	Alchemy: {
		maxPerks: 15,
		chosenPerks: 0,
		"Alchemist": {
			isRanked: true,
			rankNow: 0,
			maxRank: 5,
			rankDesc: {
				1: "Potions and poisons you make are 20% stronger.",
				2: "Potions and poisons you make are 40% stronger.",
				3: "Potions and poisons you make are 60% stronger.",
				4: "Potions and poisons you make are 80% stronger.",
				5: "Potions and poisons you make are 100% stronger.",
			},
			rankSkill: {
				1: 0,
				2: 20,
				3: 40,
				4: 60,
				5: 80,
			},
			description: "Potions and poisons you make are 20% stronger.",
			skill: 0,
		},
		"Physician": {
			description: "Potions you mix that restore Health, Magicka or Stamina are 25% more powerful.",
			skill: 20,
		},
		"Benefactor": {
			description: "Potions you mix with beneficial effects have an additional 25% greater magnitude.",
			skill: 30,
		},
		"Experimenter": {
			isRanked: true,
			rankNow: 0,
			maxRank: 3,
			rankDesc: {
				1: "Eating an ingredient reveals first two effects.",
				2: "Eating an ingredient reveals first three effects.",
				3: "Eating an ingredient reveals all its effects.",
			},
			rankSkill: {
				1: 50,
				2: 70,
				3: 90,
			},
			description: "Eating an ingredient reveals first two effects.",
			skill: 50,
		},
		"Poisoner": {
			description: "Poisons you mix are 25% more effective.",
			skill: 30,
		},
		"Concentrated Poison": {
			description: "Poisons applied to weapons last for twice as many hits.",
			skill: 60,
		},
		"Green Thumb": {
			description: "Two ingredients are gathered from plants.",
			skill: 70,
		},
		"Snakeblood": {
			description: "50% resistance to all poisons.",
			skill: 80,
		},
		"Purity": {
			description: "All negative effects are removed from created potions, and all positive effects are removed from created poisons.",
			skill: 100,
		},
	},
	"Light Armor": {
		maxPerks: 10,
		chosenPerks: 0,
		"Agile Defender": {
			isRanked: true,
			rankNow: 0,
			maxRank: 5,
			rankDesc: {
				1: "Increase armor rating for Light armor by 20%.",
				2: "Increase armor rating for Light armor by 40%.",
				3: "Increase armor rating for Light armor by 60%.",
				4: "Increase armor rating for Light armor by 80%.",
				5: "Increase armor rating for Light armor by 100%.",
			},
			rankSkill: {
				1: 0,
				2: 20,
				3: 40,
				4: 60,
				5: 80,
			},
			description: "Increase armor rating for Light armor by 20%.",
			skill: 0,
		},
		"Custom Fit": {
			description: "25% Armor bonus if wearing all Light Armor: head, chest, hands, feet.",
			skill: 30,
		},
		"Matching Set": {
			description: "Additional 25% Armor bonus if wearing a matched set of Light Armor.",
			skill: 70,
		},
		"Unhindered": {
			description: "Light Armor weighs nothing and doesn't slow you down when worn.",
			skill: 50,
		},
		"Wind Walker": {
			description: "Stamina regenerates 50% faster in all Light Armor: head, chest, hands, feet.",
			skill: 60,
		},
		"Deft Movement": {
			description: "10% chance of avoiding all damage from a melee attack while wearing all Light Armor: head, chest, hands, feet.",
			skill: 100,
		},
	},
	Lockpicking: {
		maxPerks: 11,
		chosenPerks: 0,
		"Novice Locks": {
			description: "Novice locks are much easier to pick.",
			skill: 0,
		},
		"Apprentice Locks": {
			description: "Apprentice locks are much easier to pick.",
			skill: 25,
		},
		"Quick Hands": {
			description: "Able to pick locks without being noticed.",
			skill: 40,
		},
		"Wax Key": {
			description: "Automatically gives you a copy of a picked lock's key if it has one.",
			skill: 50,
		},
		"Adept Locks": {
			description: "Adept locks are much easier to pick.",
			skill: 50,
		},
		"Expert Locks": {
			description: "Expert locks are much easier to pick.",
			skill: 75,
		},
		"Golden Touch": {
			description: "Find more gold in chests.",
			skill: 60,
		},
		"Treasure Hunter": {
			description: "50% greater chance of finding special treasure.",
			skill: 70,
		},
		"Locksmith": {
			description: "Pick starts close to the lock opening position.",
			skill: 80,
		},
		"Unbreakable": {
			description: "Lockpicks never break.",
			skill: 100,
		},
		"Master Locks": {
			description: "Master locks are much easier to pick.",
			skill: 100,
		},
	},
	Pickpocket: {
		maxPerks: 12,
		chosenPerks: 0,
		"Light Fingers": {
			isRanked: true,
			rankNow: 0,
			maxRank: 5,
			rankDesc: {
				1: "Pickpocketing bonus of 20%. Item weight and value reduce pickpocketing odds.",
				2: "Pickpocketing bonus of 40%. Item weight and value reduce pickpocketing odds.",
				3: "Pickpocketing bonus of 60%. Item weight and value reduce pickpocketing odds.",
				4: "Pickpocketing bonus of 80%. Item weight and value reduce pickpocketing odds.",
				5: "Pickpocketing bonus of 100%. Item weight and value reduce pickpocketing odds.",
			},
			rankSkill: {
				1: 0,
				2: 20,
				3: 40,
				4: 60,
				5: 80,
			},
			description: "Pickpocketing bonus of 20%. Item weight and value reduce pickpocketing odds.",
			skill: 0,
		},
		"Night Thief": {
			description: "+25% chance to pickpocket if the target is asleep.",
			skill: 30,
		},
		"Cutpurse": {
			description: "Pickpocketing gold is 50% easier.",
			skill: 40,
		},
		"Keymaster": {
			description: "Pickpocketing keys almost always works.",
			skill: 60,
		},
		"Misdirection": {
			description: "Can pickpocket equipped weapons.",
			skill: 70,
		},
		"Perfect Touch": {
			description: "Can pickpocket equipped items.",
			skill: 100,
		},
		"Extra Pockets": {
			description: "Carrying capacity is increased by 100.",
			skill: 50,
		},
		"Poisoned": {
			description: "Silently harm enemies by placing poisons in their pockets.",
			skill: 40,
		},
	},
	Sneak: {
		maxPerks: 13,
		chosenPerks: 0,
		"Stealth": {
			isRanked: true,
			rankNow: 0,
			maxRank: 5,
			rankDesc: {
				1: "You are 20% harder to detect when sneaking.",
				2: "You are 40% harder to detect when sneaking.",
				3: "You are 60% harder to detect when sneaking.",
				4: "You are 80% harder to detect when sneaking.",
				5: "You are 100% harder to detect when sneaking.",
			},
			rankSkill: {
				1: 0,
				2: 20,
				3: 40,
				4: 60,
				5: 80,
			},
			description: "You are 20% harder to detect when sneaking.",
			skill: 0,
		},
		"Backstab": {
			description: "Sneak attacks with one-handed weapons now do six times damage.",
			skill: 30,
		},
		"Deadly Aim": {
			description: "Sneak attacks with bows now do three times damage.",
			skill: 40,
		},
		"Assassin's Blade": {
			description: "Sneak attacks with daggers now do a total of fifteen times normal damage.",
			skill: 50,
		},
		"Muffled Movement": {
			description: "Wearing armor makes half as much noise when you move.",
			skill: 30,
		},
		"Light Foot": {
			description: "You won't trigger pressure plates.",
			skill: 40,
		},
		"Silent Roll": {
			description: "Sprinting while sneaking executes a silent forward roll.",
			skill: 50,
		},
		"Silence": {
			description: "Walking and running does not affect detection.",
			skill: 70,
		},
		"Shadow Warrior": {
			description: "Crouching stops combat for a moment and forces distant opponents to search for a target.",
			skill: 100,
		},
	},
	Speech: {
		maxPerks: 13,
		chosenPerks: 0,
		"Haggling": {
			isRanked: true,
			rankNow: 0,
			maxRank: 5,
			rankDesc: {
				1: "Buying and selling prices are 10% better.",
				2: "Buying and selling prices are 15% better.",
				3: "Buying and selling prices are 20% better.",
				4: "Buying and selling prices are 25% better.",
				5: "Buying and selling prices are 30% better.",
			},
			rankSkill: {
				1: 0,
				2: 20,
				3: 40,
				4: 60,
				5: 80,
			},
			description: "Buying and selling prices are 10% better.",
			skill: 0,
		},
		"Allure": {
			description: "10% better prices with the opposite sex.",
			skill: 30,
		},
		"Merchant": {
			description: "Can sell any type of item to any kind of merchant.",
			skill: 50,
		},
		"Investor": {
			description: "Can invest 500 gold with a shopkeeper to increase his available gold permanently.",
			skill: 70,
		},
		"Fence": {
			description: "Can barter stolen goods with any merchant you have invested in.",
			skill: 90,
		},
		"Master Trader": {
			description: "Every merchant in the world gains 1000 gold for bartering.",
			skill: 100,
		},
		"Bribery": {
			description: "Can bribe guards to ignore crimes.",
			skill: 30,
		},
		"Persuasion": {
			description: "Persuasion attempts are 30% easier.",
			skill: 50,
		},
		"Intimidation": {
			description: "Intimidation is twice as likely to be successful.",
			skill: 70,
		},
	},
};
const lineClass = "skill-lines__line--selected";
const perkClass = "skill-perks__perk--selected";
const lineNodes = {};
const perkNodes = {};
const selectedPerks = {};
const selectedLines = [];
const parentPerks = {};
const childrenPerks = {};
const svgSkillTrees = {};
const skillIconsButtons = {};
const iconNames = {};
const skillIconsPerksNumber = {};
const currentPerkRank = {};

let currentSkillIcon = "Illusion";

(() => {
	function getArray(map, key) {
		let arr = map[key];
		if (!arr) {
			arr = [];
			map[key] = arr;
		}
		return arr;
	}
	for (const i of dom.svgSkillLines) {
		const lineName = i.dataset.to + " " + i.dataset.from;
		lineNodes[lineName] = i;
	}
	for (const i of dom.svgSkillTrees) {
		const pp = {}, cp = {}, map = {};
		for (const j of i.querySelectorAll(".skill-lines__line")) {
			const {to, from} = j.dataset;
			getArray(pp, from).push(to);
			getArray(cp, to).push(from);
		}
		for (const j of i.querySelectorAll(".skill-perks__perk")) map[j.dataset.perkName] = j;
		const skillTree = i.dataset.skillTree;
		perkNodes[skillTree] = map;
		svgSkillTrees[skillTree] = i;
		parentPerks[skillTree] = pp;
		childrenPerks[skillTree] = cp;
		selectedPerks[skillTree] = [];
	}
	for (const i of dom.skillIcons) skillIconsButtons[i.dataset.skillIcon] = i;
	for (const i of dom.iconNames) iconNames[i.dataset.iconName] = i;
	for (const i of dom.skillIconsPerksNumber) skillIconsPerksNumber[i.dataset.chosenPerks] = i;
	for (const i of dom.currentPerkRank) currentPerkRank[i.dataset.perkRank] = i;
})();
dom.skillsButton.addEventListener("click", () => {
	state.skills.currentSkillTree = currentSkillIcon = "Illusion";
	for (const i of Object.values(svgSkillTrees)) i.classList.add("hidden");
	svgSkillTrees[state.skills.currentSkillTree].classList.remove("hidden");
	for (const i of Object.values(skillIconsButtons)) i.classList.remove("icons__skill-icon--selected");
	dom.overlay.classList.remove("hidden");
	dom.skills.classList.remove("hidden");
	skillIconsButtons[currentSkillIcon].classList.add("icons__skill-icon--selected");
	showTreeInfo(state.skills.currentSkillTree);
	showActivePerks();
	menuToDefaultView();
	toggleMenu();
});
dom.boonsButton.addEventListener("click", () => {
	menuToDefaultView();
	toggleMenu();
});
dom.skillIconsWrapper.addEventListener("click", e => {
	const skillIcon = e.target.closest(".icons__skill-icon");
	if (!skillIcon) return;
	const clickedSkillTree = skillIcon.dataset.skillIcon;
	if (clickedSkillTree === state.skills.currentSkillTree) return;
	svgSkillTrees[state.skills.currentSkillTree].classList.add("hidden");
	svgSkillTrees[clickedSkillTree].classList.remove("hidden");
	skillIconsButtons[currentSkillIcon].classList.remove("icons__skill-icon--selected");
	skillIconsButtons[clickedSkillTree].classList.add("icons__skill-icon--selected");
	state.skills.currentSkillTree = currentSkillIcon = clickedSkillTree;
	showTreeInfo(state.skills.currentSkillTree);
	showActivePerks();
});
if (isDesktop) {
	dom.skillTreeWrapper.addEventListener("click", e => {
		const data = checkPerk(e);
		if (!data) return;
		const {clickedPerk, perkName, perk, ranked} = data;
		if (clickedPerk.classList.contains(perkClass) && !ranked) return;
		if (ranked && (perk.rankNow === perk.maxRank)) return;
		highlightSkillName();
		if (state.skills.sumOfChosenPerks === 0) toggleTitle(".info-win__character-skills-section");
		selectPerks(perkName);
		bundleFuncs(perk);
	});
	dom.skillTreeWrapper.addEventListener("contextmenu", e => {
		e.preventDefault();
		const targetClass = e.target.classList;
		if (!targetClass.contains("skill-perks__perk")) return;
		if (targetClass.contains("skill-perks__perk") && !targetClass.contains(perkClass)) return;
		const perkName = e.target.dataset.perkName;
		const perk = perksOverall[state.skills.currentSkillTree][perkName];
		deselectPerks(perkName);
		highlightSkillName();
		bundleFuncs(perk);
		if (state.skills.sumOfChosenPerks === 0) toggleTitle(".info-win__character-skills-section");
	});
	dom.skillTreeWrapper.addEventListener("mouseenter", e => {showPerkDes(e);}, true);
	dom.skillTreeWrapper.addEventListener("mouseleave", e => {
		if (!e.target.classList.contains("skill-perks__perk")) {
			dom.perkInfo.classList.add("invisible");
			dom.perkInfoNextRank.classList.add("invisible");
		}
	}, true);
} else {
	dom.skillsButton.addEventListener("click", () => {dom.skillIconsWrapper.scrollLeft = 0;});
	dom.perkInfo.classList.add("non-PC");
	document.querySelector(".perk-info > div").classList.add("decoration");
	dom.perkInfoNextRank.classList.remove("invisible");
	dom.perkInfoNextRank.style.display = "none";
	let blockClick = false, longTapTimer;
	dom.skillTreeWrapper.addEventListener("click", e => {
		if (!blockClick) cyclePerks(e);
		blockClick = true;
		setTimeout(() => {blockClick = false;}, 300);
	});
	dom.skillTreeWrapper.addEventListener("contextmenu", e => {
		e.preventDefault();
	}, {passive: false});
	dom.skillTreeWrapper.addEventListener("pointerdown", function(e) {
		longTapTimer = setTimeout(() => {showPerkDes(e)}, 800);
	});
	dom.skillTreeWrapper.addEventListener("pointerup", () => {clearTimeout(longTapTimer);});
	dom.skillTreeWrapper.addEventListener("pointerancel", () => {clearTimeout(longTapTimer);});
	dom.perkInfo.addEventListener("click", () => {
		dom.perkInfo.classList.add("invisible");
		dom.perkInfoNextRank.style.display = "none";
	});
}
dom.clearTree.addEventListener("click", () => clearTree());
dom.clearAllPerks.addEventListener("click", clearAllTrees);
function checkPerk(e) {
	const clickedPerk = e.target;
	if (!clickedPerk.classList.contains("skill-perks__perk")) return false;
	const perkName = e.target.dataset.perkName;
	const perk = perksOverall[state.skills.currentSkillTree][perkName];
	const ranked = perk.isRanked;
	return {clickedPerk, perk, perkName, ranked: perk.isRanked};
}
function showPerkDes(e) {
	const data = checkPerk(e);
	if (!data) return;
	const {clickedPerk, perkName, perk, ranked} = data;
	dom.perkName.textContent = perkName;
	if (perk.isRanked) {
		updateRankDescription(perk);
		if (!isDesktop && perk.rankNow !== 0 && perk.rankNow < perk.maxRank) dom.perkInfoNextRank.style.display = "block";
	} else {
		dom.perkDescription.textContent = perk.description;
		dom.perkInfoPerkSkill.textContent = perk.skill;
	}
	dom.perkInfo.classList.remove("invisible");
}
function cyclePerks(e) {
	const data = checkPerk(e);
	if (!data) return;
	const {clickedPerk, perkName, perk, ranked} = data;
	if (clickedPerk.classList.contains(perkClass) && !ranked) {
		deselectPerks(perkName);
		if (state.skills.sumOfChosenPerks === 0) toggleTitle(".info-win__character-skills-section");
		highlightSkillName();
	} else if (ranked && (perk.rankNow === perk.maxRank)) {
		for (let i = 0; i < perk.maxRank; i++) deselectPerks(perkName);
		if (state.skills.sumOfChosenPerks === 0) toggleTitle(".info-win__character-skills-section");
		highlightSkillName();
	} else {
		if (state.skills.sumOfChosenPerks === 0) toggleTitle(".info-win__character-skills-section");
		highlightSkillName();
		selectPerks(perkName);
	}
	bundleFuncs(perk);
}
function bundleFuncs(x) {
	showActivePerks();
	showPerksOnButton();
	updateRankDescription(x);
	displayUnarmedDamage();
	displayPhysValues();
	calcSumOfPerks();
}
function selectPerks(clickedPerk) {
	const initPerk = clickedPerk;
	const perk = perksOverall[state.skills.currentSkillTree][clickedPerk];
	if (perk.isRanked && perk.rankNow !== 0) {
		numberOfChosenPerks[state.skills.currentSkillTree]++;
		updatePerkRank(clickedPerk, true);
		updateTextPerk(clickedPerk, perk);
		setMagicResistances(clickedPerk, 1);
		displayUnarmedDamage();
		setRankedPerks(clickedPerk, 1);
	} else {
		drawLineToParentPerk(clickedPerk, state.skills.currentSkillTree);
		setMagicResistances(clickedPerk, 1);
		displayUnarmedDamage();
		if (!skills[state.skills.currentSkillTree]) addPerkSection();
		const perks = selectedPerks[state.skills.currentSkillTree];
		const ul = skills[state.skills.currentSkillTree].querySelector("ul");
		const frag = document.createDocumentFragment();
		while (true) {
			setBonusForSameType(clickedPerk, 1);
			checkMatchingSetPerk(clickedPerk, true, state.skills.currentSkillTree);
			numberOfChosenPerks[state.skills.currentSkillTree]++;
			const newPerk = perksOverall[state.skills.currentSkillTree][clickedPerk];
			if (newPerk.isRanked) updatePerkRank(clickedPerk, true);
			setRankedPerks(clickedPerk, 1);
			const li = returnLi(clickedPerk, newPerk);
			frag.appendChild(li);
			addLiPerks(clickedPerk, li);
			const [childPerkA, childPerkB] = childrenPerks[state.skills.currentSkillTree][clickedPerk] ?? [];
			const [firstSelected, secondSelected] = [perks.includes(childPerkA), perks.includes(childPerkB)];
			drawLinesToChildrenPerks(clickedPerk, childPerkA, childPerkB, firstSelected, secondSelected);
			perkNodes[state.skills.currentSkillTree][clickedPerk].classList.add(perkClass);
			if (!perks.includes(clickedPerk)) perks.push(clickedPerk);
			if (firstSelected || secondSelected || !childPerkA) {
				break;
			} else {
				clickedPerk = childPerkA;
			}
		}
		ul.appendChild(frag);
	}
	updateSkillLevelOnSelect(initPerk);
	updateTextSkill();
}
function deselectPerks(clickedPerk, skillTree) {
	const tree = skillTree ?? state.skills.currentSkillTree;
	const skill = selectedPerks[tree];
	const chP = childrenPerks[tree];
	const perk = perksOverall[tree][clickedPerk];
	const ranked = perk.isRanked;
	numberOfChosenPerks[tree]--;
	if (ranked) {
		updatePerkRank(clickedPerk, false, tree);
		updateSkillLevelOnDeselect(tree);
		setMagicResistances(clickedPerk, -1);
		displayUnarmedDamage();
		setRankedPerks(clickedPerk, -1);
	}
	if (perk.rankNow === 0 || perk.rankNow === undefined) {
		deselectPerkNode(clickedPerk);
		const anyChP = chP[clickedPerk];
		if (anyChP) {
			for (const i of anyChP) {
				const lineName = clickedPerk + " " + i;
				deselectLineNode(lineName);
			}
		}
		deselectPP(clickedPerk);
	}
	function deselectPP(clickedPerk) {
		const anyPP = parentPerks[tree][clickedPerk];
		if (anyPP) {
			for (const i of anyPP) {
				if (skill.includes(i)) {
					const lineName = i + " " + clickedPerk;
					deselectLineNode(lineName);
					if (chP[i].some(e => skill.includes(e))) continue;
					const perk = perksOverall[tree][i];
					const ranked = perk.isRanked;
					if (ranked) {
						for (let j = 0, len = perk.rankNow; j < len; j++) {
							numberOfChosenPerks[tree]--;
							updatePerkRank(i, false, tree);
							setMagicResistances(i, -1);
							displayUnarmedDamage();
							setRankedPerks(i, -1);
						}
					} else {
						numberOfChosenPerks[tree]--;
						setBonusForSameType(i, -1);
						checkMatchingSetPerk(i, false, tree);
					}
					deselectPerkNode(i);
					deselectPP(i);
				}
			}
		}
	}
	function deselectLineNode(lineName) {
		lineNodes[lineName].classList.remove(lineClass);
		const index = selectedLines.indexOf(lineName);
		if (index > -1) selectedLines.splice(index, 1);
	}
	function deselectPerkNode(clickedPerk) {
		perkNodes[tree][clickedPerk].classList.remove(perkClass);
		const index = skill.indexOf(clickedPerk);
		if (index > -1) skill.splice(index, 1);
		updateSkillLevelOnDeselect(tree);
		deleteLiPerks(clickedPerk, tree);
	}
	updateTextSkill(tree);
	deletePerkSection(tree);
}
function drawLineToParentPerk(clickedPerk, skillTree) {
	const pp = parentPerks[skillTree][clickedPerk];
	if (!pp) return;
	for (const i of pp) {
		if (selectedPerks[skillTree].includes(i)) {
			const lineName = i + " " + clickedPerk;
			lineNodes[lineName].classList.add(lineClass);
			if (!selectedLines.includes(lineName)) selectedLines.push(lineName);
			break;
		}
	}
}
function drawLinesToChildrenPerks(clickedPerk, perkA, perkB, perkASelected, perkBSelected) {
	if (!perkA && !perkB) return;
	const [lineAName, lineBName] = [clickedPerk + " " + perkA, clickedPerk + " " + perkB];
	if (perkASelected && perkBSelected) {
		lineNodes[lineAName].classList.add(lineClass);
		lineNodes[lineBName].classList.add(lineClass);
		if (!selectedLines.includes(lineAName)) selectedLines.push(lineAName);
		if (!selectedLines.includes(lineBName)) selectedLines.push(lineBName);
	} else if (perkBSelected) {
		lineNodes[lineBName].classList.add(lineClass);
		if (!selectedLines.includes(lineBName)) selectedLines.push(lineBName);
	} else {
		lineNodes[lineAName].classList.add(lineClass);
		if (!selectedLines.includes(lineAName)) selectedLines.push(lineAName);
	}
}
function updatePerkRank(clickedPerk, bool, x) {
	const tree = x ?? state.skills.currentSkillTree;
	const perk = perksOverall[tree][clickedPerk], {rankNow, maxRank} = perk;
	if (!bool && rankNow === 0 || bool && rankNow === maxRank) return;
	const newRank = bool ? perk.rankNow += 1 : perk.rankNow -= 1;
	updateCurrentPerkRankText(clickedPerk, newRank);
}
function showActivePerks(x) {
	const tree = x ?? state.skills.currentSkillTree;
	dom.treeActivePerks.textContent = numberOfChosenPerks[tree];
}
function highlightSkillName(x) {
	const tree = x ?? state.skills.currentSkillTree;
	if (numberOfChosenPerks[tree] === 0) iconNames[tree].classList.toggle("icon-name--selected");
}
function updateCurrentPerkRankText(clickedPerk, rank) {
	currentPerkRank[clickedPerk].textContent = rank;
}
function updateSkillLevelOnSelect(perkName) {
	const perk = perksOverall[state.skills.currentSkillTree][perkName];
	const skill = perk.isRanked ? perk.rankSkill[perk.rankNow] : perk.skill;
	const charSkill = charSkills[state.skills.currentSkillTree];
	if (skill > charSkill.ownSkill) {
		charSkill.ownSkill = skill;
		dom.treeSkillLevel.textContent = charSkill.total = charSkill.ownSkill + charSkill.otherSource;
		calcCharLevel(state.skills.currentSkillTree, true);
		calcArmorSkillMod(state.skills.currentSkillTree);
		calcWeaponSkillMod(state.skills.currentSkillTree);
		calcTotalValue();
	}
}
function updateSkillLevelOnDeselect(x) {
	const tree = x ?? state.skills.currentSkillTree;
	const perks = selectedPerks[tree];
	const baseSkill = raceSkills[state.character.race][tree];
	const arr = [...perks];
	const skills = arr.map(e => {
		const perk = perksOverall[tree][e];
		if (perk.isRanked) {
			return perk.rankSkill[perk.rankNow];
		} else {
			return perk.skill;
		}
	});
	const highestSkill = Math.max(...skills);
	const charSkill = charSkills[tree];
	if (perks.size === 0 || highestSkill < baseSkill) {
		charSkill.ownSkill = baseSkill;
		dom.treeSkillLevel.textContent = charSkill.total = charSkill.otherSource + baseSkill;
		calcCharLevel(tree, false);
		calcArmorSkillMod(tree);
		calcWeaponSkillMod(tree);
		calcTotalValue();
		return;
	}
	if (charSkill.ownSkill > highestSkill) {
		charSkill.ownSkill = highestSkill;
		dom.treeSkillLevel.textContent = charSkill.total = charSkill.otherSource + highestSkill;
		calcCharLevel(tree, false);
		calcArmorSkillMod(tree);
		calcWeaponSkillMod(tree);
		calcTotalValue();
	}
}
function showPerksOnButton(x) {
	if (window.matchMedia("(max-width: 769px)").matches) return;
	const tree = x ?? state.skills.currentSkillTree;
	skillIconsPerksNumber[tree].textContent = numberOfChosenPerks[state.skills.currentSkillTree];
}
function updateRankDescription(perk) {
	if (!perk.isRanked) return;
	const rank = perk.rankNow;
	const nextRank = rank + 1;
	if (rank === 0 || nextRank > perk.maxRank) {
		dom.perkInfoNextRank.classList.add("invisible");
	} else {
		dom.perkInfoNextRankDes.textContent = "Next Rank: " + perk.rankDesc[nextRank];
		dom.perkInfoNextSkill.textContent = "Requires Skill: " + perk.rankSkill[nextRank];
		dom.perkInfoNextRank.classList.remove("invisible");
	}
	dom.perkInfoPerkSkill.textContent = rank === 0 ? perk.skill : perk.rankSkill[rank];
	dom.perkDescription.textContent = rank === 0 ? perk.description : perk.rankDesc[rank];
}
function clearTree(key) {
	const tree = key ?? state.skills.currentSkillTree;
	if (numberOfChosenPerks[tree] === 0) return;
	const perkName = startingPerks[tree];
	const perkInfo = perksOverall[tree][perkName];
	if (perkInfo.isRanked) {
		const iter = perkInfo.rankNow;
		for (let i = 0; i < iter; i++) {
			deselectPerks(perkName, tree);
		}
	} else {
		deselectPerks(perkName, tree);
	}
	showActivePerks(tree);
	showPerksOnButton(tree);
	highlightSkillName(tree);
	calcSumOfPerks();
	if (state.skills.sumOfChosenPerks === 0) toggleTitle(".info-win__character-skills-section");
}
function clearAllTrees() {
	for (const tree of Object.keys(startingPerks)) clearTree(tree);
}
function showTreeInfo(tree) {
	dom.skillTreeName.textContent = tree;
	dom.treeMaxActivePerks.textContent = maxPerksByTree[tree];
	dom.treeSkillLevel.textContent = charSkills[tree].total;
}
function calcSumOfPerks() {
	updateState(s => { s.skills.sumOfChosenPerks = Object.values(numberOfChosenPerks).reduce((t, e) => t + e); });
}
function setRankedPerks(perk, sign) {
	if (!perksModifiers[perk]) return;
	const skill = Object.keys(perksModifiers[perk])[0];
	sumOfModifiers[skill].perks = perksOverall[skill][perk].rankNow * perksModifiers[perk][skill];
	calcTotalValue();
}
export {charSkills, selectedPerks};