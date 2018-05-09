$(document).ready(function () {
    var $boringBtn = $("#boring-mode-button");
    var isBoring = false;

    var map = L.map('map', {
        center: [35, -85],
        zoom: 5
    });
    var satelliteBasemap = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'}
        );
    var mapboxTerminal = L.tileLayer(
        'https://api.mapbox.com/styles/v1/mwilliamsazavea/cjeu69bgh082r2rpndhj2o52b/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXdpbGxpYW1zYXphdmVhIiwiYSI6ImNpZ21oMmMzZzAyMmV1bmx6a20zbjllOHMifQ.JsUVaCRdxK16APj3-M1xDQ', {
            attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
        });
    var mapboxBoring = L.tileLayer(
        'https://api.mapbox.com/styles/v1/mwilliamsazavea/cjgz7tv1r000d2sp075mvfldi/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXdpbGxpYW1zYXphdmVhIiwiYSI6ImNpZ21oMmMzZzAyMmV1bmx6a20zbjllOHMifQ.JsUVaCRdxK16APj3-M1xDQ', {
            attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
        });
    map.addLayer(mapboxTerminal);

    var file;
    var imageLayer;
    var layerGroup = L.layerGroup([]);
    layerGroup.addTo(map);

    var $basemapButton = $('#basemap-switcher');
    $basemapButton.click(switchBasemap);

    var $inputElement = $('#image-upload');
    $inputElement.on('change', handleFiles);

    var $warpButton = $('#button-warp');
    $warpButton.click(warpImage);

    var $resetButton = $('#button-reset');
    $resetButton.click(clearMap);

    var anchorIcon = L.icon({
        iconUrl: './assets/images/warp-anchor.png',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        className: 'anchor-point'
    });

    $boringBtn.click(toggleBoring);
    function toggleBoring() {
        if (!isBoring) {
            $('body').addClass('boring-mode');
            $('body').removeClass('awesome-mode');
            $(this).html('Awesome mode')
            
            map.removeLayer(satelliteBasemap);
            map.removeLayer(mapboxTerminal);
            map.addLayer(mapboxBoring);
            
            isBoring = !isBoring;
        } else {
            $('body').addClass('awesome-mode');
            $('body').removeClass('boring-mode');
            $(this).html('Boring mode');

            map.removeLayer(satelliteBasemap);
            map.removeLayer(mapboxBoring);
            map.addLayer(mapboxTerminal);
            
            isBoring = !isBoring;
        }
    }

    function switchBasemap() {
        if (isBoring) {
            if ( map.hasLayer(mapboxBoring) ) {
                map.removeLayer(mapboxBoring);
                map.addLayer(satelliteBasemap);
                $(this).html('Activate hybrid map');
            } else {
                map.removeLayer(satelliteBasemap);
                map.addLayer(mapboxBoring);
                $(this).html('Activate satellite map');
            }
        } else {
            if ( map.hasLayer(mapboxTerminal) ) {
                map.removeLayer(mapboxTerminal);
                map.addLayer(satelliteBasemap);
                $(this).html('Activate hybrid map');
            } else {
                map.removeLayer(satelliteBasemap);
                map.addLayer(mapboxTerminal);
                $(this).html('Activate satellite map');
            }
        }
    }

    function handleFiles() {
        var files = this.files;
        if (!(files && files.length)) { return; }
        file = files[0];

        loam.initialize();

        fileToImage(file).then(function(image) {
            setupImageLayer(image);
        });

        $('.image-list').html(
            '<li class="uploaded-image">' +
            '<div class="image-name">' +
            file.name +
            '</div></li>'
        );
    }

    function setEngageButtonState(isEnabled) {
        $warpButton.prop('disabled', !isEnabled);
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

        setEngageButtonState(false);

        console.log(imageLayer.getCorners());
        var image = imageLayer._image;
        console.log('Image:', image.width, 'x', image.height);

        layerGroup.clearLayers();
        var controlPoints = getControlPoints(imageLayer);
        console.log(controlPoints);
        controlPoints.map(function (gcp) {
            return gcp.getLatLng();
        }).forEach(function (point) {
            layerGroup.addLayer(L.marker(point, {icon: anchorIcon}));
        });

        var datasetOpen, datasetTranslate;
        loam.open(file).then(function (ds) {
            datasetOpen = ds;
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
            datasetTranslate = ds;
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
            // bytes is a UInt8Array
            var blob = new Blob([bytes], {type: 'image/tiff'});
            var oldFileName = file.name.lastIndexOf('.') === -1 ?
                file.name : file.name.slice(0, file.name.lastIndexOf('.'));
            var filename = oldFileName + '-warped.tif';
            saveAs(blob, filename);
        }).finally(function () {
            // Manually close intermediate datasets to release memory
            if (datasetOpen) { datasetOpen.close(); }
            if (datasetTranslate) { datasetTranslate.close(); }
            setEngageButtonState(true);
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
