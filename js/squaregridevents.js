import { walkOrthogonalSquareGrid, walkSquareGrid } from "./util.js";
import { SquareGridManager } from "./squaregridman.js"

var waypointArray;
var gridInstanceArray;
var lastCoord;

export let onDragLeftStart = async function (wrapped, ...args) {
    wrapped(...args);
    let data = args[0].data;
    let origin = canvas.grid.getSnappedPosition(data.origin.x - canvas.grid.grid.w / 2, data.origin.y - canvas.grid.grid.h / 2);
    waypointArray = [];
    waypointArray.push({ x: origin.x, y: origin.y });
    gridInstanceArray = [];
    gridInstanceArray.push(new SquareGridManager());
    lastCoord = { x: origin.x, y: origin.y };
}

export let onDragLeftMove = async function (wrapped, ...args) {
    wrapped(...args);
    let data = args[0].data;
    let origin = waypointArray[waypointArray.length - 1];
    let dest = canvas.grid.getSnappedPosition(data.destination.x - canvas.grid.grid.w / 2, data.destination.y - canvas.grid.grid.h / 2);
    if (lastCoord.x != dest.x || lastCoord.y != dest.y) {
        lastCoord.x = dest.x;
        lastCoord.y = dest.y;
        let pathArray = walkSquareGrid(origin, dest);
        await gridInstanceArray[gridInstanceArray.length - 1].buildGrid(pathArray);
    }
}

export let onDragLeftDrop = async function (wrapped, ...args) {
    wrapped(...args);
    //let mouse = canvas.app.renderer.plugins.interaction.mouse;
    //let local = mouse.getLocalPosition(canvas.app.stage);
    //console.log("Drag Left Drop", args[0]);
    //console.log(game);
    //console.log(canvas.scene);
    waypointArray = [];
    await gridInstanceArray[gridInstanceArray.length - 1].clearGrid();
}

export let onDragLeftCancel = async function (wrapped, ...args) {
    wrapped(...args);
    waypointArray = [];
    await gridInstanceArray[gridInstanceArray.length - 1].clearGrid();
}

export let handleCreateWaypoint = () => {
    //do nothing for now...
}