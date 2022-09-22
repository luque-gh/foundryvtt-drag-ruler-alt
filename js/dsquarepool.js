export class DrawingSquarePool {

    //Fifo of free ids
    _free = [];
    //Array of allocated ids
    _used = [];
    //Drawing initial data
    _data = {
        x: 2,
        y: 2,
        fillColor: "#FF0000",
        strokeWidth: 0,
        fillType: 1,
        fillAlpha: 0,
        fontSize: 24,
        shape: { width: 2, height: 2, type: CONST.DRAWING_TYPES.RECTANGLE }
    };

    async grow(size) {
        let squareData = [];
        for (let i = 0; i < size; i++) {
            squareData.push(this._data);
        }
        let list = await canvas.scene.createEmbeddedDocuments('Drawing', squareData);
        this._free.concat(list.map(x => x.id));
    }

    async allocate(size) {
        if (this._free.length < size) {
            await this.grow(size * 2);
        }
        let slice = this._free(0, size);
        this._free.slice(size, this._free.length);
        this._used.concat(slice);
    }

    async release(id) {
        for (let i = 0; i < this._used.length; i++) {
            if (this._used[i] == id) {
                this._used = this._used.splice(i,1);
                let data = {...this._data, _id: id};
                await canvas.scene.updateEmbeddedDocuments('Drawing', data);
                this._free.push(id);
                break;
            }
        }
    }

    async destroy() {
        await canvas.scene.deleteEmbeddedDocuments('Drawing', this._free);
        this._free = [];
        await canvas.scene.deleteEmbeddedDocuments('Drawing', this._used);
        this._used = [];
    }
}

