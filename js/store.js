export const state = {
    character: {
        name: "",
        race: "",
        level: 1,
        totalXP: 0,
        xpToNextLevel: 100, // (1 + 3) * 25
        xpBySkillTree: {
            Alchemy: 0,
            Alteration: 0,
            Archery: 0,
            Block: 0,
            Conjuration: 0,
            Destruction: 0,
            Enchanting: 0,
            "Heavy Armor": 0,
            Illusion: 0,
            "Light Armor": 0,
            Lockpicking: 0,
            "One-Handed": 0,
            Pickpocket: 0,
            Restoration: 0,
            Smithing: 0,
            Sneak: 0,
            Speech: 0,
            "Two-Handed": 0,
        }
    },
    skills: {
        currentSkillTree: "Illusion",
        currentSkillIcon: "Illusion",
        sumOfChosenPerks: 0,
        selectedPerks: {}, // key: perkName, value: array/object of perks chosen
        selectedLines: [], // array of line names
    },
    equipment: {
        Head: null,
        Body: null,
        Arms: null,
        Legs: null,
        Left: null,
        Right: null,
        Amulet: null,
        Ring: null,
        itemsEquipped: 0,
        equippedMatchingItems: [], // array of set names
        partsOfSet: [],
    },
    boons: {
        selectedStandingStones: [],
        standingStoneSavedInAC: null,
        selectedBlessings: [],
    },
    ui: {
        anyBuild: false,
        menuOpen: false,
        itemsOpen: false,
        bigIMG: null,
        bigIMGToken: null,
    },
    timers: {
        findItemTimer: null,
    }
};

const listeners = [];

export function subscribe(listener) {
    listeners.push(listener);
    return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    };
}

export function notify() {
    for (const listener of listeners) {
        listener(state);
    }
}

export function updateState(updater) {
    updater(state);
    notify();
}
