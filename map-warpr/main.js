$(document).ready(function () {
    var map = L.map('map', {
        center: [39.5, -98.35],
        zoom: 5
    });
    var tileLayer = new L.StamenTileLayer('terrain');
    map.addLayer(tileLayer);

    var file;
    var imageLayer;

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
    }

    function warpImage() {
        // https://gis.stackexchange.com/questions/181292/failed-gdal-script-from-qgis-georeferencer-using-thin-plate-spline-tps
        if (!imageLayer) { return; }

        console.log(imageLayer.getCorners());
        var image = imageLayer._image;
        console.log('Image:', image.width, 'x', image.height);
    }

    // Return array of control points
    // Consider returning in more directly useful form
    function getControlPoints(imageLayer) {
        var width = imageLayer._image.width;
        var height = imageLayer._image.height;
        var corners = imageLayer.getCorners();

        return [{
            pixel: 0,
            line: 0,
            x: 0,
            y: 0
        }, {
            pixel: 1,
            line: 1,
            x: 10,
            y: 10
        }];

        function latLngAtPixel(xRatio, yRatio, image, latLngCorners) {
            // Calculate lat/lng at a particular spot on the image
            // Must account for non-rectangular images
            // Use turf.js distance() + along()?
            return [0, 0];
        }

    }
});
