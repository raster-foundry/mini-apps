// Common Settings

var toolNdviBeforeNode = 'a1460c96-8377-4bf1-aad4-18a6e47093c6';
var toolNdviAfterNode = '722519bc-3312-4c35-924b-9f1a155f83ec';
var toolNdviDifferenceNode = '875f9059-2b87-49d4-8d2a-3ecc47d4b14d';

// Get Map - Add Difference Layers

var createMap = function() {

    // Declare a Tile layer with an OSM source

    var hereLayer = L.tileLayer('https://1.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/terrain.day/{z}/{x}/{y}/256/png8?app_id=v88MqS5fQgxuHyIWJYX7&app_code=5pn07ENomTHOap0u7nQSFA');

    var transmissionLineStyle = {
        color: '#FDF736',
        opacity: 0.6
    };
    var transmissionLines = new L.GeoJSON.AJAX(
        '/assets/js/transmission-lines.geojson',
        {style: transmissionLineStyle}
    );

    var liquidPipelineStyle = {
        color: '#01020A',
        opacity: 0.6
    };
    var liquidPipelines = new L.GeoJSON.AJAX(
        '/assets/js/liquid-pipelines.geojson',
        {style: liquidPipelineStyle}
    );

    var natGasPipelinesStyle = {
        color: '#FF4F00',
        opacity: 0.6
    };
    var natGasPipelines = new L.GeoJSON.AJAX(
        '/assets/js/nat-gas-pipelines.geojson',
        {style: natGasPipelinesStyle}
    );

    var map = L.map('map').setView([50.8212, -121.35], 12);

    // Add the created layer to the Map
    map.addLayer(hereLayer);
    map.addLayer(transmissionLines);
    map.addLayer(liquidPipelines);
    map.addLayer(natGasPipelines);

    var measureOptions = {
        position: 'bottomright',
        primaryLengthUnit: 'meters',
        secondaryLengthUnit: 'kilometers',
        primaryAreaUnit: 'hectares'
    };
    var measureControl = L.control.measure(measureOptions);
    measureControl.addTo(map);
    return map;
};

var getToolRunTileNode = function(nodeId, toolRunId, mapToken, colorRamp, bounds) {
    var url = 'https://tiles.rasterfoundry.com/tiles/tools/' +
            toolRunId + '/{z}/{x}/{y}?mapToken=' +
            mapToken + '&node=' + nodeId;

    return L.tileLayer(url, {bounds: bounds, errorTileUrl: '/assets/images/empty.png'});
};

var getProjectLayer = function(projectId, mapToken, bounds) {
    var url = 'https://tiles.rasterfoundry.com/tiles/' +
            projectId + '/{z}/{x}/{y}?mapToken=' +
            mapToken;
    return L.tileLayer(url, {bounds: bounds, errorTileUrl: '/assets/images/empty.png'});
};

var loadFires = function() {
    var fires = {};

    var ndviBeforeLayers = [];
    var ndviAfterLayers = [];
    var ndviDifferenceLayers = [];
    var projectBeforeLayers = [];
    var projectAfterLayers = [];

    var views = {};
    var cards = {};

    $('.card').each(function(i, fire) {
        var data = fire.dataset;

        // Create a View for Fire
        var view = {center: {lat: parseFloat(data.y), lng: parseFloat(data.x)},
                    zoom: data.z};

        views[fire.id] = view;
        cards[fire.id] = fire;
        var bounds = [[data.xmin, data.ymin], [data.xmax, data.ymax]];
        var ndviBeforeLayer = getToolRunTileNode(toolNdviBeforeNode, data.toolrun, data.toolrunmaptoken, 'viridis', bounds);
        ndviBeforeLayers.push(ndviBeforeLayer);
        var ndviAfterLayer = getToolRunTileNode(toolNdviAfterNode, data.toolrun, data.toolrunmaptoken, 'viridis', bounds);
        ndviAfterLayers.push(ndviAfterLayer);
        var ndviDifferenceLayer = getToolRunTileNode(toolNdviDifferenceNode, data.toolrun, data.toolrunmaptoken, 'magma', bounds);
        ndviDifferenceLayers.push(ndviDifferenceLayer);
        var projectBeforeLayer = getProjectLayer(data.projectbefore,
                                                 data.projectbeforemaptoken, bounds);
        projectBeforeLayers.push(projectBeforeLayer);
        var projectAfterLayer = getProjectLayer(data.projectafter,
                                                 data.projectaftermaptoken, bounds);
        projectAfterLayers.push(projectAfterLayer);

    });

    var ndviBeforeLayerGroup = L.layerGroup(ndviBeforeLayers);
    var ndviAfterLayerGroup = L.layerGroup(ndviAfterLayers);
    var ndviDifferenceLayerGroup = L.layerGroup(ndviDifferenceLayers);
    var projectBeforeLayerGroup = L.layerGroup(projectBeforeLayers);
    var projectAfterLayerGroup = L.layerGroup(projectAfterLayers);

    var layers = {
        ndviBefore: ndviBeforeLayerGroup,
        ndviAfter: ndviAfterLayerGroup,
        ndviDifference: ndviDifferenceLayerGroup,
        projectBefore: projectBeforeLayerGroup,
        projectAfter: projectAfterLayerGroup
    };
    return {views: views, layers:layers, cards: cards};
};


var addSlidertoLayer = function(slider, layerGroup) {
    layerGroup.getLayers().forEach(function(l) {
        l.on('precompose', function(event) {
            var ctx = event.context;
            var canvasWidth = ctx.canvas.width;
            var width = slider.position().left + 15;
            ctx.save();
            ctx.beginPath();
            ctx.rect(width, 0, ctx.canvas.width + width, ctx.canvas.height);
            ctx.clip();
        });

        l.on('postcompose', function(event) {
            var ctx = event.context;
            ctx.restore();
        });
    });
};

$( document ).ready(function() {
    $closeModalBtn = $('#close-modal');
    $modalBackdrop = $('.modal-backdrop');
    $modal = $('#modal');
    $modalToggle = $('[data-target="#modal"]');

    $activateComparisonBtn = $('#activate-comparison-layers');
    $activateExtentBtn = $('#activate-extent-layer');

    $mapContainer = $('#map');
    $mapOffset = $($mapContainer).offset().left;
    $mapSlider = $('#map-slider');

    $beforeLayerSelect = $('#left-side-select');
    $afterLayerSelect = $('#right-side-select');

    $thresholdControl = $('#threshold-control');

    /*
     * Show modal
     */
    $($modalToggle).on('click', function(el) {
        el.preventDefault();

        $($modal)
            .removeClass('hide')
            .delay(1).queue(function() {
                $(this).addClass('in');
                $(this).dequeue();
            });
    });

    /*
     * Hide modal
     */
    $('#close-modal, .modal-backdrop').on('click', function(el) {
        el.preventDefault();

        $($modal)
            .removeClass('in')
            .delay(400).queue(function() {
                $(this).addClass('hide');
                $(this).dequeue();
            });
    });

    /*
     * Mobile sidebar toggle
     */
     $('#sidebar-toggle').on('click', function(el) {
        el.preventDefault();

        $('.sidebar').toggleClass('active');
     });

    var map = createMap();
    var fireResults = loadFires();
    var fireLayers = fireResults.layers;

    var layerVisibleLeft = fireLayers.projectBefore;
    var layerVisibleRight = fireLayers.ndviDifference;

    var sideBySide = L.control.sideBySide(layerVisibleLeft.getLayers(),
                                          layerVisibleRight.getLayers());
    sideBySide.addTo(map);

    map.addLayer(layerVisibleLeft);
    map.addLayer(layerVisibleRight);

    var setVisibleLayer = function(side, layer) {
        if (side === 'left') {
            var currentLayer = layerVisibleLeft;
            map.removeLayer(currentLayer);
            layerVisibleLeft = layer;
            map.addLayer(layerVisibleLeft);
            sideBySide.setLeftLayers(layerVisibleLeft.getLayers());
        } else {
            var currentLayer = layerVisibleRight;
            map.removeLayer(currentLayer);
            layerVisibleRight = layer;
            map.addLayer(layerVisibleRight);
            sideBySide.setRightLayers(layerVisibleRight.getLayers());
        }
    };

    var getLayer = function(name) {
        if (name === 'ndvi-before') {
            return fireLayers.ndviBefore;
        } else if (name === 'ndvi-after') {
            return fireLayers.ndviAfter;
        } else if (name === 'natural-before') {
            return fireLayers.projectBefore;
        } else if (name === 'natural-after') {
            return fireLayers.projectAfter;
        } else if (name === 'burn-extent') {
            return fireLayers.ndviDifference;
        } else {
            throw 'Unexpected Layer Name: ' + name;
        }
    };

    /*
     * Choose Comparison
     */
    $($beforeLayerSelect).on('change', function() {
        var layer = getLayer(this.value);
        setVisibleLayer('left', layer);
    });

    $($afterLayerSelect).on('change', function() {
        var layer = getLayer(this.value);
        setVisibleLayer('right', layer);
    });

    $(document).ready(function() {
        $('.popup-link').magnificPopup({type:'image'});
    });

    $cards = $('.card');

    $cards.on('click', function(e) {
        var clickedCardId = e.currentTarget.id;

        for (var cardId in fireResults.cards) {
            var card = $(fireResults.cards[cardId]);
            if (clickedCardId === cardId) {
                card.addClass('active');
                var view = fireResults.views[clickedCardId];
                map.setView(view.center, view.zoom);
            } else {
                card.removeClass('active');
            }
        };
    });
});
