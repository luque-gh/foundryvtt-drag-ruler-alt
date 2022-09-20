export let walkSquareGrid = (from, to) => {
    //let vector = {x: to.x - from.x, y: to.y - from.y};
    let path = [];
    let walking = {x: from.x, y: from.y};
    while (Math.trunc(to.x - walking.x) != 0 || Math.trunc(to.y - walking.y) != 0) {
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