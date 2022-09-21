import { handleCreateWaypoint } from "./squaregridevents.js";

export const settingsKey = "movement-ruler";

export let initializeSettings = () => {
    game.keybindings.register(settingsKey, "createWaypoint", {
        name: settingsKey + ".keybindings.createWaypoint",
        onDown: handleCreateWaypoint,
        editable: [{
            key: "Space"
        }],
        precedence: -1,
    });
}
