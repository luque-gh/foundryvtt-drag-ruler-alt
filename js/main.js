import { walkOrthogonalSquareGrid, walkSquareGrid } from "./util.js";

var waypointArray;
var lastCoord;
var gridArrayHistory;

Hooks.on("init", function () {
    //CONFIG.debug.hooks = true
    let onDragLeftStart = async function (wrapped, ...args) {
        wrapped(...args);
        let data = args[0].data;
        //console.log("Drag Left Start", data.origin);
        waypointArray = [];
        gridArrayHistory = [];
        let origin = canvas.grid.getSnappedPosition(data.origin.x - canvas.grid.grid.w / 2, data.origin.y - canvas.grid.grid.h / 2);
        waypointArray.push({x: origin.x, y: origin.y});
        lastCoord = {x: origin.x, y: origin.y};
    }

    libWrapper.register("movement-ruler", "Token.prototype._onDragLeftStart", onDragLeftStart, "WRAPPER");

    let onDragLeftMove = async function (wrapped, ...args) {
        wrapped(...args);
        let data = args[0].data;
        let origin = waypointArray[waypointArray.length - 1];
        let dest = canvas.grid.getSnappedPosition(data.destination.x - canvas.grid.grid.w / 2, data.destination.y - canvas.grid.grid.h / 2);
        if (lastCoord.x != dest.x || lastCoord.y != dest.y) {
            lastCoord.x = dest.x;
            lastCoord.y = dest.y;
            let pathArray = walkSquareGrid(origin, dest);
            await buildGrid(pathArray);
        }
    }

    libWrapper.register("movement-ruler", "Token.prototype._onDragLeftMove", onDragLeftMove, "WRAPPER");

    let onDragLeftDrop = async function (wrapped, ...args) {
        wrapped(...args);
        
        //let mouse = canvas.app.renderer.plugins.interaction.mouse;
        //let local = mouse.getLocalPosition(canvas.app.stage);
        //console.log("Drag Left Drop", args[0]);
        //console.log(game);
        //console.log(canvas.scene);
        waypointArray = [];
        await clearGrid();
   }

    libWrapper.register("movement-ruler", "Token.prototype._onDragLeftDrop", onDragLeftDrop, "WRAPPER");
});

Hooks.once("ready", function () {
    console.log("This code runs once core initialization is ready and game data is available.");
});

let clearGrid = async () => {
    let gridArrayToDelete = [...gridArrayHistory];
    gridArrayHistory = [];
    for (var i = 0; i < gridArrayToDelete.length; i++) {
        canvas.scene.deleteEmbeddedDocuments('Drawing', gridArrayToDelete[i]);
    }
}

let buildGrid = async (pathArray) => {
    let gridData = [];
    for (var i = 0; i < pathArray.length; i++) {
        let path = pathArray[i];
        gridData.push({
            x: path.x,
            y: path.y,
            fillColor: "#FF0000",
            strokeWidth: 0,
            fillType: 1,
            fillAlpha: 0.4,
            fontSize: 20,
            text: (i + 1) * canvas.scene.grid.distance + canvas.scene.grid.units,
            shape: {width: canvas.grid.grid.w, height: canvas.grid.grid.h, type: CONST.DRAWING_TYPES.RECTANGLE}
        });
    }
    let localGridArray = [];
    let square = await canvas.scene.createEmbeddedDocuments('Drawing', gridData);
    for (var j = 0; j < square.length; j++) {
        localGridArray.push(square[j].id);
    }
    await clearGrid();
    //Update Grid Array History
    gridArrayHistory.push(localGridArray);
}