export class SquareGridManager {

    _numberOfSteps = 0;
    _gridArrayHistory = [];
    _previousNumberOfSteps;

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
        let gridData = [];
        this._numberOfSteps = pathArray.length;
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
        let localGridArray = [];
        let square = await canvas.scene.createEmbeddedDocuments('Drawing', gridData);
        for (let j = 0; j < square.length; j++) {
            localGridArray.push(square[j].id);
        }
        await this.clearGrid();
        //Update Grid Array History
        this._gridArrayHistory.push(localGridArray);
    }
}
