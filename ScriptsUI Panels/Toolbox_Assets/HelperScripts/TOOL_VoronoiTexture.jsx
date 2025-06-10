(function TOOL_VoronoiTexture(thisObj){
	var gridResolution = 2; // Adjust for finer or coarser grid
	function TOOL_VoronoiTexture_buildUI(thisObj){
        //var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", 'Voronoi Texture Generator', undefined, {resizeable:true});
        var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "VoronoiTexture", undefined, {resizeable:true});
			if (pal !== null){

				// Create the UI
				var mainWindow = pal.add("group", undefined, '');
				mainWindow.orientation = "column";

				// Slider for Initial Point Count
				var pointCountGroup = mainWindow.add("group", undefined, "Point Count Group");
				pointCountGroup.add("statictext", undefined, "Point Count:");
				var pointCountSlider = pointCountGroup.add("slider", undefined, 10, 1, 100);
				var pointCountInput = pointCountGroup.add("edittext", undefined, "10");
				pointCountInput.characters = 4;

				// Slider for Distribution
				var distributionGroup = mainWindow.add("group", undefined, "Distribution Group");
				distributionGroup.add("statictext", undefined, "Distribution:");
				var distributionSlider = distributionGroup.add("slider", undefined, 50, 1, 100);
				var distributionInput = distributionGroup.add("edittext", undefined, "50");
				distributionInput.characters = 4;

				// Slider for Randomness
				var randomnessGroup = mainWindow.add("group", undefined, "Randomness Group");
				randomnessGroup.add("statictext", undefined, "Randomness:");
				var randomnessSlider = randomnessGroup.add("slider", undefined, 50, 0, 100);
				var randomnessInput = randomnessGroup.add("edittext", undefined, "50");
				randomnessInput.characters = 4;

				// Button to Generate Voronoi Texture
				var generateButton = mainWindow.add("button", undefined, "Generate Texture");

					// Function to update values from sliders
					function updateValue(input, slider) {
					    input.text = slider.value.toString();
					}

					// Event Listeners for sliders and inputs
					pointCountSlider.onChanging = function() { updateValue(pointCountInput, pointCountSlider); }
					distributionSlider.onChanging = function() { updateValue(distributionInput, distributionSlider); }
					randomnessSlider.onChanging = function() { updateValue(randomnessInput, randomnessSlider); }

					// Function to Generate Voronoi Texture
					generateButton.onClick = function() {
					    // Retrieve slider values
					    var pointCount = parseInt(pointCountInput.text, 10);
					    var distribution = parseFloat(distributionInput.text);
					    var randomness = parseFloat(randomnessInput.text);
						GenerateVoronoi(pointCount, distribution, randomness);
					}

		        pal.layout.layout(true);
		        mainWindow.minimumSize = mainWindow.size;
		        pal.layout.resize();
		        pal.onResizing = pal.onResize = function () {this.layout.resize();}
			}
			return pal;
		}

		  function GenerateVoronoi(pntcnt, dist, rdm) {
		        var comp = app.project.activeItem;
		        if (!comp || !(comp instanceof CompItem)) {
		            alert("Please select a composition.");
		            return;
		        }

		        app.beginUndoGroup("Generate Voronoi Texture");

		        var points = createRandomPoints(pntcnt, dist, rdm, comp.width, comp.height);
		        var voronoiRegions = calculateVoronoiRegions(points, comp.width, comp.height);
		        var cleanRegions = orderRegionPerimeters(voronoiRegions, comp.width, comp.height, gridResolution);
		        drawVoronoiCells(cleanRegions, comp);

		        app.endUndoGroup();
		    }

		    function createRandomPoints(count, distribution, randomness, width, height) {
		        var points = [];
		        for (var i = 0; i < count; i++) {
		            // Modify this to utilize distribution and randomness if needed
		            var x = Math.random() * width;
		            var y = Math.random() * height;
		            points.push({x: x, y: y});
		        }
		        return points;
		    }


		function calculateVoronoiRegions(points, width, height) {
		    var regions = [];

		    // Initialize regions array based on points
		    for (var i = 0; i < points.length; i++) {
		        regions[i] = [];
		    }

		    // Assign each grid cell to the closest point
		    for (var x = 0; x < width; x += gridResolution) {
		        for (var y = 0; y < height; y += gridResolution) {
		            var closestPointIndex = findClosestPointIndex(points, x, y);
		            regions[closestPointIndex].push([x, y]);
		        }
		    }

		    return regions;
		}

	    function findClosestPointIndex(points, x, y) {
	        var closestIndex = 0;
	        var minDist = Number.MAX_VALUE;

	        for (var i = 0; i < points.length; i++) {
	            var dist = Math.sqrt(Math.pow(points[i].x - x, 2) + Math.pow(points[i].y - y, 2));
	            if (dist < minDist) {
	                minDist = dist;
	                closestIndex = i;
	            }
	        }

	        return closestIndex;
	    }


		function distance(x1, y1, x2, y2) {
		    // Euclidean distance
		    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
		}

		function drawVoronoiCells(regions, comp) {
		    // Create a new shape layer in the composition
		    var shapeLayer = comp.layers.addShape();
		    shapeLayer.name = "VoronoiDiagram";

		    for (var index = 0; index < regions.length; index++) {
		        var region = regions[index];
		        
		        // Add a group for each Voronoi cell
		        var cellGroup = shapeLayer.property("Contents").addProperty("ADBE Vector Group");
		        cellGroup.name = "VoronoiCell" + index;

		        // Add a path to the group
		        var cellShape = cellGroup.property("Contents").addProperty("ADBE Vector Shape - Group");
		        cellShape.name = "CellShape" + index;

		        // Define the path using vertices
		        var shapePath = new Shape();
		        shapePath.vertices = region; // Assuming each region is an array of [x, y] pairs
		        shapePath.inTangents = [];
		        shapePath.outTangents = [];
		        shapePath.closed = true;

		        // Set the path value
		        cellShape.property("ADBE Vector Shape").setValue(shapePath);
		    }
		}




function orderRegionPerimeters(regions, width, height, gridResolution) {
    var orderedRegions = [];

    for (var i = 0; i < regions.length; i++) {
        var edgePoints = findEdgePoints(regions[i], width, height, gridResolution);
        var orderedPoints = sortPointsApprox(edgePoints);
        orderedRegions.push(orderedPoints);
    }
    return orderedRegions;
}


function findEdgePoints(region, width, height, gridResolution) {
    var edgePoints = [];

    for (var i = 0; i < region.length; i++) {
        var point = region[i];
        if (isOnBoundary(point, width, height) || hasExternalNeighbors(point, region, gridResolution)) {
            edgePoints.push(point);
        }
    }

    return edgePoints;
}

function isOnBoundary(point, width, height) {
    // Check if the point is on the edge of the composition
    var x = point[0];
    var y = point[1];
    return x === 0 || x === width || y === 0 || y === height;
}

function hasExternalNeighbors(point, region, gridResolution) {
    // Check if the point has neighboring cells that are not in the region
    var neighbors = getNeighbors(point, gridResolution);
    for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];
        if (!isPointInRegion(neighbor, region)) {
            return true;
        }
    }
    return false;
}

function getNeighbors(point, gridResolution) {
    // Generate the neighboring points of a given point
    var x = point[0];
    var y = point[1];
    return [
        [x - gridResolution, y], // left
        [x + gridResolution, y], // right
        [x, y - gridResolution], // top
        [x, y + gridResolution]  // bottom
    ];
}

function isPointInRegion(point, region) {
    // Check if a point is in the given region
    for (var i = 0; i < region.length; i++) {
        if (region[i][0] === point[0] && region[i][1] === point[1]) {
            return true;
        }
    }
    return false;
}

function sortPointsApprox(points) {
    if (points.length === 0) return [];

    var orderedPoints = [];
    var currentPoint = points[0];
    var remainingPoints = points.slice(1);

    orderedPoints.push(currentPoint);

    while (remainingPoints.length > 0) {
        var nearestPointIndex = findNearestPointIndex(currentPoint, remainingPoints);
        currentPoint = remainingPoints[nearestPointIndex];
        remainingPoints.splice(nearestPointIndex, 1);
        orderedPoints.push(currentPoint);
    }

    return orderedPoints;
}

function findNearestPointIndex(point, points) {
    var nearestIndex = 0;
    var minDistance = Number.MAX_VALUE;

    for (var i = 0; i < points.length; i++) {
        var distance = calculateDistance(point, points[i]);
        if (distance < minDistance) {
            minDistance = distance;
            nearestIndex = i;
        }
    }

    return nearestIndex;
}

function calculateDistance(point1, point2) {
    return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2));
}









	    var rdetPal = TOOL_VoronoiTexture_buildUI(thisObj);
	    if (rdetPal !== null)
	    {		        
	        if (rdetPal instanceof Window)
	        {
	            // Show the palette
	            rdetPal.center();
	            rdetPal.show();
	        }
	        else
	            rdetPal.layout.layout(true);
	    }
	}
)(this);