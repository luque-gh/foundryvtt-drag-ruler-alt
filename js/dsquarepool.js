export class DrawingSquarePool {

    //Fifo of free ids
    _free = [];
    //Array of allocated ids
    _used = [];
    //Drawing initial data
    _data = {
        x: 5,
        y: 5,
        fillColor: "#FF0000",
        strokeWidth: 0,
        fillType: 1,
        fillAlpha: 0,
        fontSize: 24,
        shape: { width: 10, height: 10, type: CONST.DRAWING_TYPES.RECTANGLE }
    };

    async grow(size) {
        let squareData = [];
        for (let i = 0; i < size; i++) {
            squareData.push(this._data);
        }
        let list = await canvas.scene.createEmbeddedDocuments('Drawing', squareData);
        this._free = this._free.concat(list.map(x => x.id));
    }

    async allocate(size) {
        if (this._free.length < size) {
            await this.grow(this._used.length + size);
        }
        let slice = this._free.slice(0, size);
        this._free = this._free.slice(size, this._free.length);
        this._used = this._used.concat(slice);
        return slice;
    }

    async release(id) {
        for (let i = 0; i < this._used.length; i++) {
            if (this._used[i] == id) {
                this._used.splice(i,1);
                let data = {...this._data, _id: id};
                await canvas.scene.updateEmbeddedDocuments('Drawing', [data]);
                this._free.push(id);
                break;
            }
        }
    }

    async destroy() {
        let freeCopy = [...this._free];
        this._free = [];
        await canvas.scene.deleteEmbeddedDocuments('Drawing', freeCopy);
        let usedCopy = [...this._used];
        this._used = [];
        await canvas.scene.deleteEmbeddedDocuments('Drawing', usedCopy);
    }
}

