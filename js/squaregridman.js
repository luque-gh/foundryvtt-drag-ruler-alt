export class SquareGridManager {

    _numberOfSteps = 0;
    _gridArrayHistory = [];
    _previousNumberOfSteps;
    _previousPathArray = [];

    constructor(previousNumberOfSteps) {
        this._previousNumberOfSteps = previousNumberOfSteps;
    }

    get numberOfSteps() {return this._numberOfSteps + this._previousNumberOfSteps;}

    async clearGrid() {
        let gridArrayToDelete = [...this._gridArrayHistory];
        this._gridArrayHistory = [];
        for (let i = 0; i < gridArrayToDelete.length; i++) {
            canvas.scene.deleteEmbeddedDocuments('Drawing', gridArrayToDelete[i]);
        }
    }

    async buildGrid(pathArray) {
        this._numberOfSteps = pathArray.length;
        let gridData = this._prepareSquareData(pathArray);
        let localGridArray = [];
        let square = await canvas.scene.createEmbeddedDocuments('Drawing', gridData);
        for (let j = 0; j < square.length; j++) {
            localGridArray.push(square[j].id);
        }
        await this.clearGrid();
        //Update Grid Array History
        this._gridArrayHistory.push(localGridArray);
    }

    async rebuildGrid(pathArray) {
        let commonIndex = 0;
        while (commonIndex < this._previousPathArray.length && commonIndex < pathArray.length) {
            let prevPoint = this._previousPathArray[commonIndex];
            let point = pathArray[commonIndex];
            if (point.x != prevPoint.x || point.y != prevPoint.y) {
                break;
            }
            commonIndex++;
        }
        this._previousPathArray = pathArray;
        this._gridArrayHistory[this._gridArrayHistory.length - 1] = this._gridArrayHistory[this._gridArrayHistory.length - 1].slice(commonIndex);
        let gridData = this._prepareSquareData(pathArray.slice(commonIndex));
        let square = await canvas.scene.createEmbeddedDocuments('Drawing', gridData);
        for (let j = 0; j < square.length; j++) {
            localGridArray.push(square[j].id);
        }
        await this.clearGrid();
        //Update Grid Array History
        this._gridArrayHistory.push(localGridArray);
    }

    _prepareSquareData(pathArray) {
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
                text: (i + 1 + this._previousNumberOfSteps) * canvas.scene.grid.distance + canvas.scene.grid.units,
                shape: { width: canvas.grid.grid.w, height: canvas.grid.grid.h, type: CONST.DRAWING_TYPES.RECTANGLE }
            });
        }
        return gridData;
    }
}
