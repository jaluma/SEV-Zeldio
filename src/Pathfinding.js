var findShortestPath = function(model, grid, limit = Number.MAX_SAFE_INTEGER) {
    var distanceFromTop = Math.floor(model.y / 64);
    var distanceFromLeft = Math.floor((model.x - model.ancho / 2) / 64);

    var gridCopy = grid.map(function(arr) {
        return arr.slice();
    });

    var location = {
        distanceFromTop: distanceFromTop,
        distanceFromLeft: distanceFromLeft,
        path: [],
        status: estadosMC.start
    };

    var queue = [location];

    while (queue.length > 0 && queue.length <= limit) {
        var currentLocation = queue.shift();

        var directionList = [directions.north, directions.east, directions.south, directions.west]
        for (var i = 0; i < directionList.length; i++) {
            var newLocation = exploreInDirection(currentLocation, directionList[i], gridCopy);
            if (newLocation.status === estadosMC.jugador) {
                return newLocation.path;
            } else if (newLocation.status === estadosMC.valid) {
                queue.push(newLocation);
            }
        }

    }
    return false;

};

var locationStatus = function(location, grid) {
    var gridWidth = grid[0].length;
    var gridHeight = grid.length;
    var dft = location.distanceFromTop;
    var dfl = location.distanceFromLeft;

    if (location.distanceFromLeft < 0 ||
        location.distanceFromLeft >= gridWidth ||
        location.distanceFromTop < 0 ||
        location.distanceFromTop >= gridHeight) {

        return estadosMC.invalid;
    } else if (grid[dft][dfl] === estadosMC.jugador) {
        return estadosMC.jugador;
    } else if (grid[dft][dfl] !== estadosMC.vacio) {
        return estadosMC.blocked;
    } else {
        return estadosMC.valid;
    }
};

var exploreInDirection = function(currentLocation, direction, grid) {
    var newPath = currentLocation.path.slice();
    newPath.push(direction);

    var dft = currentLocation.distanceFromTop + direction[1];
    var dfl = currentLocation.distanceFromLeft + direction[0]

    var newLocation = {
        distanceFromTop: dft,
        distanceFromLeft: dfl,
        path: newPath,
        status: estadosMC.unknown
    };
    newLocation.status = locationStatus(newLocation, grid);

    if (newLocation.status === estadosMC.valid) {
        grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = estadosMC.visited;
    }

    return newLocation;
};