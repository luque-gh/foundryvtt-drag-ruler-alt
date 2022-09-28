import { walkOrthogonalSquareGrid, walkSquareGrid } from "./util.js";
import { SquareGridManager } from "./squaregridman.js"
import { DrawingSquarePool } from "./dsquarepool.js";

var waypointArray;
var gridInstanceArray;
var lastCoord;
var pool;

export let onDragLeftStart = async function (wrapped, ...args) {
    wrapped(...args);
    let data = args[0].data;
    let origin = canvas.grid.getSnappedPosition(data.origin.x - canvas.grid.grid.w / 2, data.origin.y - canvas.grid.grid.h / 2);
    waypointArray = [];
    waypointArray.push({ x: origin.x, y: origin.y });
    gridInstanceArray = [];
    gridInstanceArray.push(new SquareGridManager(0));
    lastCoord = { x: origin.x, y: origin.y };
    pool = new DrawingSquarePool();
    pool.grow(20);
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
        await gridInstanceArray[gridInstanceArray.length - 1].build(pathArray, pool, new Date().getTime());
    }
}

export let onDragLeftDrop = async function (wrapped, ...args) {
    if (waypointArray.length <= 1) {
        await wrapped(...args);
    } else {
        let data = args[0].data;
        let dest = canvas.grid.getSnappedPosition(data.destination.x - canvas.grid.grid.w / 2, data.destination.y - canvas.grid.grid.h / 2);
        waypointArray.push({ x: dest.x, y: dest.y });
        let waypointCopy = waypointArray.slice(1);
        let token = args[0].target;
        for (let i = 0; i < waypointCopy.length; i++) {
            await token.scene.updateEmbeddedDocuments(token.constructor.embeddedName, [{x: waypointCopy[i].x, y: waypointCopy[i].y, _id: token.id}]);
            console.log(waypointCopy[i]);
        }
    }
    //let mouse = canvas.app.renderer.plugins.interaction.mouse;
    //let local = mouse.getLocalPosition(canvas.app.stage);
    //console.log("Drag Left Drop", args[0]);
    //console.log(game);
    //console.log(canvas.scene);
    waypointArray = [];
    console.log(args[0].target);
    pool.destroy();
}

export let onDragLeftCancel = async function (wrapped, ...args) {
    wrapped(...args);
    waypointArray = [];
    pool.destroy();
}

export let handleCreateWaypoint = () => {
    if (gridInstanceArray.length == 0) {
        return;
    }
    let mouse = canvas.app.renderer.plugins.interaction.mouse;
    let local = mouse.getLocalPosition(canvas.app.stage);
    let dest = canvas.grid.getSnappedPosition(local.x - canvas.grid.grid.w / 2, local.y - canvas.grid.grid.h / 2);
    waypointArray.push({ x: dest.x, y: dest.y });
    gridInstanceArray.push(new SquareGridManager(gridInstanceArray[gridInstanceArray.length-1].numberOfSteps));
}

export let handleDeleteWaypoint = () => {
    if (gridInstanceArray.length <= 1) {
        return;
    }
    waypointArray.pop();
    gridInstanceArray.pop();
}