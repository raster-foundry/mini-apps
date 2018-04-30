$(document).ready(function () {
    var map = L.map('map', {
        center: [39.5, -98.35],
        zoom: 5
    });
    var tileLayer = new L.StamenTileLayer('terrain');
    map.addLayer(tileLayer);

    var file;
    var imageLayer;
    var layerGroup = L.layerGroup([]);
    layerGroup.addTo(map);

    var $inputElement = $('#image-upload');
    $inputElement.on('change', handleFiles);

    var $warpButton = $('#button-warp');
    $warpButton.click(warpImage);

    var $resetButton = $('#button-reset');
    $resetButton.click(clearMap);

    function handleFiles() {
        var files = this.files;
        if (!(files && files.length)) { return; }
        file = files[0];

        fileToImage(file).then(function(image) {
            setupImageLayer(image);
        });
    }

    function fileToImage(fileBlob) {
        var dfd = $.Deferred();
        var img = new Image();
        img.src = URL.createObjectURL(fileBlob);
        img.onload = function () {
            dfd.resolve(img);
        }
        return dfd.promise();
    }

    // image is an instance of Image()
    function setupImageLayer(image) {
        if (!map) { return; }

        deleteImageLayer();
        var imageBounds = map.getBounds().pad(-0.35);
        imageLayer = new L.DistortableImageOverlay(image.src, {
            corners: [
                imageBounds.getNorthWest(),
                imageBounds.getNorthEast(),
                imageBounds.getSouthWest(),
                imageBounds.getSouthEast()
            ]
        });
        imageLayer.addTo(map);
        L.DomEvent.on(imageLayer._image, 'load', imageLayer.editing.enable, imageLayer.editing);
    }

    function deleteImageLayer() {
        if (imageLayer) {
            URL.revokeObjectURL(imageLayer._image);
            imageLayer.remove();
            imageLayer = undefined;
        }
    }

    function clearMap() {
        $inputElement.val('');
        file = undefined;
        deleteImageLayer();
        layerGroup.clearLayers();
    }

    function warpImage() {
        // https://gis.stackexchange.com/questions/181292/failed-gdal-script-from-qgis-georeferencer-using-thin-plate-spline-tps
        if (!imageLayer) { return; }

        console.log(imageLayer.getCorners());
        var image = imageLayer._image;
        console.log('Image:', image.width, 'x', image.height);

        layerGroup.clearLayers();
        var controlPoints = getControlPoints(imageLayer);
        console.log(controlPoints);
        controlPoints.map(function (gcp) {
            return gcp.getLatLng();
        }).forEach(function (point) {
            layerGroup.addLayer(L.marker(point));
        });

        var translateArgs =
        loam.open(file).then(function (ds) {
            var convertArgs = ['-of', 'GTiff'];
            var gcpArgs = controlPoints.map(function (gcp) {
                return gcp.toCLIArgArray();
            }).reduce(function (accum, x) {
                x.forEach(function (val) { accum.push(val); });
                return accum;
            }, []);
            convertArgs = convertArgs.concat(gcpArgs);
            console.log('GDAL translate: ', convertArgs.join(' '));
            return ds.convert(convertArgs);
        }).then(function (ds) {
            var warpArgs = [
                '-r',
                'near',
                '-tps',
                '-s_srs',
                'EPSG:4326',
                '-t_srs',
                'EPSG:4326'
            ];
            console.log('GDAL warp: ', warpArgs.join(' '));
            return ds.warp(warpArgs);
        }).then(function (ds) {
            console.log('GDAL close');
            return ds.closeAndReadBytes();
        }).then(function (bytes) {
            console.log('Output file size: ', bytes.length);
        });
    }

    // Return array of control points
    // Consider returning in more directly useful form
    function getControlPoints(imageLayer) {
        var width = imageLayer._image.width;
        var height = imageLayer._image.height;
        var corners = imageLayer.getCorners();
        var ne = corners[0];
        var nw = corners[1];
        var se = corners[2];
        var sw = corners[3];
        midpointEast = lineMidpoint(ne, se);
        midpointWest = lineMidpoint(nw, sw);

        return [
            new ControlPoint(0, 0, ne),
            new ControlPoint(width, 0, nw),
            new ControlPoint(0, height, se),
            new ControlPoint(width, height, sw),
            new ControlPoint(0, height / 2, midpointEast),
            new ControlPoint(width, height / 2, midpointWest),
            new ControlPoint(width / 2, 0, lineMidpoint(ne, nw)),
            new ControlPoint(width / 2, height, lineMidpoint(se, sw)),
            new ControlPoint(width / 2, height / 2, lineMidpoint(midpointEast, midpointWest))
        ];

        // Takes two Leaflet LatLng and returns the LatLng of the midpoint along the line
        // Easy to extend to arbitrary distances along the line between the points
        function lineMidpoint(point1, point2, alongPct) {
            if (!alongPct) {
                alongPct = 0.5;
            }
            // Could also calculate with turf.js distance()
            var distanceMeters = point1.distanceTo(point2);
            var distanceKm = distanceMeters / 1000;
            var distanceAlong = distanceKm * alongPct;
            var from = [point1.lng, point1.lat];
            var to = [point2.lng, point2.lat];
            var line = turf.lineString([from, to]);
            var midpoint = turf.along(line, distanceAlong, {units: 'kilometers'});
            return L.latLng(midpoint.geometry.coordinates[1], midpoint.geometry.coordinates[0]);
        }
    }
});

class ControlPoint {

    constructor(pixel, line, latLng) {
        this.pixel = pixel;
        this.line = line;
        this.x = latLng.lng;
        this.y = latLng.lat;
    }

    getLatLng() {
        return L.latLng([this.y, this.x]);
    }

    toCLIArgArray() {
        return [
            '-gcp',
            this.pixel.toString(),
            this.line.toString(),
            this.x.toString(),
            this.y.toString()
        ];
    }
}
