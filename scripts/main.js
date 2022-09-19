Hooks.on("init", function () {
    //CONFIG.debug.hooks = true
    let onDragLeftStart = async function (wrapped, ...args) {
        wrapped(...args);
        let data = args[0].data;
        console.log("Drag Left Start", data.origin);
    }

    libWrapper.register("movement-ruler", "Token.prototype._onDragLeftStart", onDragLeftStart, "WRAPPER");

    let onDragLeftMove = async function (wrapped, ...args) {
        wrapped(...args);
        let data = args[0].data;
        //console.log("Drag Left Move", data.destination);
        console.log(canvas.grid.getSnappedPosition(data.destination.x, data.destination.y));
    }

    libWrapper.register("movement-ruler", "Token.prototype._onDragLeftMove", onDragLeftMove, "WRAPPER");

    let onDragLeftDrop = async function (wrapped, ...args) {
        wrapped(...args);
        let data = args[0].data;
        console.log("Drag Left Drop", data.destination);
        let originSnapped = canvas.grid.getSnappedPosition(data.origin.x, data.origin.y);
        let destSnapped = canvas.grid.getSnappedPosition(data.destination.x, data.destination.y);
        console.log("Grid MeasureDistance", canvas.grid.measureDistance(originSnapped, destSnapped));
    }

    libWrapper.register("movement-ruler", "Token.prototype._onDragLeftDrop", onDragLeftDrop, "WRAPPER");
});

Hooks.once("ready", function () {
    console.log("This code runs once core initialization is ready and game data is available.");
});