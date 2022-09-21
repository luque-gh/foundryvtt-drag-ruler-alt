export const settingsKey = "movement-ruler";

export let initializeSettings = () => {
    game.keybindings.register(settingsKey, "createWaypoint", {
        name: "movement-ruler.keybindings.createWaypoint",
        onDown: handleCreateWaypoint,
        editable: [{
            key: "Space"
        }],
        precedence: -1,
    });
}

let handleCreateWaypoint = () => {
    //do nothing...
}