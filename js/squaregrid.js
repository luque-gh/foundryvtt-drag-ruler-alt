var gridArrayHistory = [];

export let clearGrid = async () => {
    let gridArrayToDelete = [...gridArrayHistory];
    gridArrayHistory = [];
    for (var i = 0; i < gridArrayToDelete.length; i++) {
        canvas.scene.deleteEmbeddedDocuments('Drawing', gridArrayToDelete[i]);
    }
}

export let buildGrid = async (pathArray) => {
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
            fontSize: canvas.grid.grid.w / 3,
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