import { initializeSettings } from "./settings.js";
import { onDragLeftStart, onDragLeftMove, onDragLeftDrop, onDragLeftCancel } from "./squaregridevents.js"

Hooks.on("init", function () {
    //CONFIG.debug.hooks = true
    initializeSettings();
    libWrapper.register("movement-ruler", "Token.prototype._onDragLeftStart", onDragLeftStart, "WRAPPER");
    libWrapper.register("movement-ruler", "Token.prototype._onDragLeftMove", onDragLeftMove, "WRAPPER");
    libWrapper.register("movement-ruler", "Token.prototype._onDragLeftDrop", onDragLeftDrop, "WRAPPER");
    libWrapper.register("movement-ruler", "Token.prototype._onDragLeftCancel", onDragLeftCancel, "WRAPPER");
});

Hooks.once("ready", function () {
    //nothing to do
});