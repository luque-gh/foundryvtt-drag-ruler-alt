export class SquareGridManager {

    //Array of set drawing ids
    _gridArrayHistory = [];
    //Number of steps from previous waypoint
    _previousNumberOfSteps;
    //Array of the current path (x,y)
    _currentPathArray = [];

    constructor(previousNumberOfSteps) {
        this._previousNumberOfSteps = previousNumberOfSteps;
    }

    get numberOfSteps() {return this._currentPathArray.length + this._previousNumberOfSteps;}

    async clearGrid() {
        let gridArrayToDelete = [...this._gridArrayHistory];
        this._gridArrayHistory = [];
        for (let i = 0; i < gridArrayToDelete.length; i++) {
            canvas.scene.deleteEmbeddedDocuments('Drawing', gridArrayToDelete[i]);
        }
    }

    async rebuildGrid(newPathArray) {
        let gridData = this._prepareSquareData(newPathArray);
        let localGridArray = [];
        let square = await canvas.scene.createEmbeddedDocuments('Drawing', gridData);
        for (let j = 0; j < square.length; j++) {
            localGridArray.push(square[j].id);
        }
        await this.clearGrid();
        //Update Grid Array History
        this._gridArrayHistory.push(localGridArray);
    }

    async buildGrid(newPathArray) {
        //Find common path
        let commonIndex = 0;
        while (commonIndex < this._currentPathArray.length && commonIndex < newPathArray.length) {
            let prevPoint = this._currentPathArray[commonIndex];
            let point = newPathArray[commonIndex];
            if (point.x != prevPoint.x || point.y != prevPoint.y) {
                break;
            }
            commonIndex++;
        }
        this._currentPathArray = newPathArray;
        let localGridArray = [];
        if (this._gridArrayHistory.length > 0) {
            let lastGridArrayHistory = this._gridArrayHistory.pop();
            await canvas.scene.deleteEmbeddedDocuments('Drawing', lastGridArrayHistory.slice(commonIndex))
            localGridArray = [...lastGridArrayHistory.slice(0, commonIndex)];
        }
        let gridData = this._prepareSquareData(newPathArray.slice(commonIndex), commonIndex);
        let square = await canvas.scene.createEmbeddedDocuments('Drawing', gridData);
        for (let j = 0; j < square.length; j++) {
            localGridArray.push(square[j].id);
        }
        //Update Grid Array History
        this._gridArrayHistory.push(localGridArray);
    }

    _prepareSquareData(pathArray, offset = 0) {
        let gridData = [];
        for (let i = 0; i < pathArray.length; i++) {
            let path = pathArray[i];
            gridData.push({
                x: path.x,
                y: path.y,
                fillColor: "#FF0000",
                strokeWidth: 0,
                fillType: 1,
                fillAlpha: 0.4,
                fontSize: canvas.grid.grid.w / 3,
                text: (i + 1 + this._previousNumberOfSteps + offset) * canvas.scene.grid.distance + canvas.scene.grid.units,
                shape: { width: canvas.grid.grid.w, height: canvas.grid.grid.h, type: CONST.DRAWING_TYPES.RECTANGLE }
            });
        }
        return gridData;
    }
}
