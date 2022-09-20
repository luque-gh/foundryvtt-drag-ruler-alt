export let walkOrthogonalSquareGrid = (from, to) => {
    //let vector = {x: to.x - from.x, y: to.y - from.y};
    let path = [];
    let walking = {x: from.x, y: from.y};
    while ((Math.abs(to.x - walking.x) > canvas.grid.grid.w / 2) || (Math.abs(to.y - walking.y) > canvas.grid.grid.h / 2)) {
        if (Math.abs(to.x - walking.x) > Math.abs(to.y - walking.y)) {
            if (to.x > walking.x) {
                walking.x += canvas.grid.grid.w;
            } else {
                walking.x -= canvas.grid.grid.w;
            }
        } else {
            if (to.y > walking.y) {
                walking.y += canvas.grid.grid.h;
            } else {
                walking.y -= canvas.grid.grid.h;
            }
        }
        let clone = {x: walking.x, y: walking.y};
        path.push(clone);
    }
    return path;
}

export let walkSquareGrid = (from, to) => {
    let path = [];
    let walking = {x: from.x, y: from.y};
    while ((Math.abs(to.x - walking.x) > canvas.grid.grid.w / 2) || (Math.abs(to.y - walking.y) > canvas.grid.grid.h / 2)) {
        let vector = {x: to.x - walking.x, y: to.y - walking.y};
        let dist = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        vector.x /= dist;
        vector.y /= dist;
        if (vector.x > 0.5) {
            walking.x += canvas.grid.grid.w;
        } else {
            if (vector.x < -0.5) {
                walking.x -= canvas.grid.grid.w;
            }
        }
        if (vector.y > 0.5) {
            walking.y += canvas.grid.grid.h;
        } else {
            if (vector.y < -0.5) {
                walking.y -= canvas.grid.grid.h;
            }
        }

        let clone = {x: walking.x, y: walking.y};
        path.push(clone);
    }
    return path;
}