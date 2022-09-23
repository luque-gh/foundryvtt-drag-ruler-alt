export class SquareGridManager {

    //Number of steps from previous waypoint
    _previousNumberOfSteps;
    //Array of the current path (x,y)
    _currentPathArray = [];
    //Avoid race condition
    _lock = false;
    //Awaiting for timeout to retry
    _timeout = false;
    //Path waiting to update rule
    _waitingPathArray = null;

    constructor(previousNumberOfSteps) {
        this._previousNumberOfSteps = previousNumberOfSteps;
    }

    get numberOfSteps() {return this._currentPathArray.length + this._previousNumberOfSteps;}

    async build(newPathArray, pool) {
        if (this._lock) {
            //If locked, wait for the right time...
            this._waitingPathArray = newPathArray;
            if (!this._timeout) {
                this._timeout = true;
                setTimeout(() => {this._retry(pool);}, 200);
            }
            return;
        }
        //Lock to avoid race condition
        this._lock = true;
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
        //Copy ids from common path...
        for (let i = 0; i < commonIndex; i++) {
            newPathArray[i].id = this._currentPathArray[i].id;
        }
        //Release all useless ids...
        for (let i = commonIndex; i < this._currentPathArray.length; i++) {
            pool.release(this._currentPathArray[i].id);
        }
        //Set new path
        this._currentPathArray = newPathArray;
        //Prepare data to update ids...
        let pathToBuild = this._currentPathArray.slice(commonIndex);
        let gridId = await pool.allocate(pathToBuild.length);
        let gridData = this._prepareSquareData(pathToBuild, commonIndex);
        for (let i = 0; i < gridData.length; i++) {
            this._currentPathArray[commonIndex + i].id = gridId[i];
            gridData[i] = {...gridData[i], _id: gridId[i]};
        }
        await canvas.scene.updateEmbeddedDocuments('Drawing', gridData);
        //Release lock
        this._lock = false;
    }

    async _retry(pool) {
        this._timeout = false;
        if (this._waitingPathArray != null) {
            let newPathArray = [...this._waitingPathArray];
            this._waitingPathArray = null;
            this.build(newPathArray, pool);
        }
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
