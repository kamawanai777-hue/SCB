import { dom } from "./dom.js";
import { state, subscribe } from "./store.js";
import { charSkills } from "./skills.js";

function renderMenuOptions() {
    if (state.ui.menuOpen) {
        dom.menu.classList.remove("menu--hidden");
        dom.menu.classList.add("menu--slide-down");
        dom.menuButton.classList.add("is-open");
    } else {
        dom.menu.classList.add("menu--hidden");
        dom.menu.classList.remove("menu--slide-down");
        dom.menuButton.classList.remove("is-open");
    }
}

function renderItemsWindow() {
    if (state.ui.itemsOpen) {
        dom.itemsWindow.classList.remove("hidden");
        dom.overlay.dataset.closeModal = ".items-window .filter-window";
        dom.overlay.classList.remove("hidden");
    } else {
        dom.itemsWindow.classList.add("hidden");
        dom.overlay.classList.add("hidden");
        dom.overlay.dataset.closeModal = "#overlay #searchWindow .create-character .skills .boons .items-window";
    }
}

function renderSkillsSectionTitle() {
    const el = document.querySelector(".info-win__character-skills-section .nothing-there-yet");
    if (state.skills.sumOfChosenPerks === 0) {
        el.classList.remove("hidden");
    } else {
        el.classList.add("hidden");
    }
}

export function initRenderers() {
    let prevMenuOpen = state.ui.menuOpen;
    let prevItemsOpen = state.ui.itemsOpen;
    let prevSumOfChosenPerks = state.skills.sumOfChosenPerks;
    subscribe((currentState) => {
        if (prevMenuOpen !== currentState.ui.menuOpen) {
            renderMenuOptions();
            prevMenuOpen = currentState.ui.menuOpen;
        }
        if (prevItemsOpen !== currentState.ui.itemsOpen) {
            renderItemsWindow();
            prevItemsOpen = currentState.ui.itemsOpen;
        }
        if ((prevSumOfChosenPerks === 0 && currentState.skills.sumOfChosenPerks > 0) ||
            (prevSumOfChosenPerks > 0 && currentState.skills.sumOfChosenPerks === 0)) {
            renderSkillsSectionTitle();
        }
        prevSumOfChosenPerks = currentState.skills.sumOfChosenPerks;
    });
}
