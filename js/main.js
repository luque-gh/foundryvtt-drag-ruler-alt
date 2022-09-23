import { initializeSettings } from "./settings.js";
import { onDragLeftStart, onDragLeftMove, onDragLeftDrop, onDragLeftCancel } from "./squaregridevents.js"

Hooks.on("init", function () {
    //CONFIG.debug.hooks = true
    initializeSettings();
    libWrapper.register("drag-ruler-alt", "Token.prototype._onDragLeftStart", onDragLeftStart, "WRAPPER");
    libWrapper.register("drag-ruler-alt", "Token.prototype._onDragLeftMove", onDragLeftMove, "WRAPPER");
    libWrapper.register("drag-ruler-alt", "Token.prototype._onDragLeftDrop", onDragLeftDrop, "MIXED");
    libWrapper.register("drag-ruler-alt", "Token.prototype._onDragLeftCancel", onDragLeftCancel, "WRAPPER");
});

Hooks.once("ready", function () {
    //nothing to do
});