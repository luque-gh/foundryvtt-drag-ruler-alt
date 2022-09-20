import { walkSquareGrid } from "./util.js";

var coordMap;

Hooks.on("init", function () {
    //CONFIG.debug.hooks = true
    coordMap = new Map();
    let onDragLeftStart = async function (wrapped, ...args) {
        wrapped(...args);
        let data = args[0].data;
        console.log("Drag Left Start", data.origin);
    }

    libWrapper.register("movement-ruler", "Token.prototype._onDragLeftStart", onDragLeftStart, "WRAPPER");

    let onDragLeftMove = async function (wrapped, ...args) {
        wrapped(...args);
        let data = args[0].data;
        let origin = canvas.grid.getSnappedPosition(data.origin.x - canvas.grid.grid.w / 2, data.origin.y - canvas.grid.grid.h / 2);
        let dest = canvas.grid.getSnappedPosition(data.destination.x - canvas.grid.grid.w / 2, data.destination.y - canvas.grid.grid.h / 2);
        let distance = Math.trunc(canvas.grid.measureDistance(origin, dest));
        let key = JSON.stringify(dest);
        if (!coordMap.has(key)) {
            //Insert key with temporary value
            coordMap.set(key, '');
            let square = await canvas.scene.createEmbeddedDocuments(
                'Drawing', 
                [
                    {
                        x: dest.x,
                        y: dest.y,
                        fillColor: "#FF0000",
                        strokeWidth: 0,
                        fillType: 1,
                        fillAlpha: 0.4,
                        fontSize: 20,
                        text: distance,
                        shape: {width: canvas.grid.grid.w, height: canvas.grid.grid.h, type: CONST.DRAWING_TYPES.RECTANGLE}
                    }]
                );
            //Insert final value
            coordMap.set(key, square[0].id);
            console.log(walkSquareGrid(origin, dest));
        }
    }

    libWrapper.register("movement-ruler", "Token.prototype._onDragLeftMove", onDragLeftMove, "WRAPPER");

    let onDragLeftDrop = async function (wrapped, ...args) {
        wrapped(...args);
        
        const values = Array.from(coordMap.values());
        console.log(values);
        canvas.scene.deleteEmbeddedDocuments('Drawing', values);
        coordMap = new Map();

        //let mouse = canvas.app.renderer.plugins.interaction.mouse;
        //let local = mouse.getLocalPosition(canvas.app.stage);
        console.log("Drag Left Drop", args[0]);
        //let local = data.getLocalPosition(canvas.app.stage);
        //console.log(game);
        console.log(canvas.grid);
    }

    libWrapper.register("movement-ruler", "Token.prototype._onDragLeftDrop", onDragLeftDrop, "WRAPPER");
});

Hooks.once("ready", function () {
    console.log("This code runs once core initialization is ready and game data is available.");
});