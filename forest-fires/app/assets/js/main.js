// Common Settings

var toolNdviBeforeNode = 'a1460c96-8377-4bf1-aad4-18a6e47093c6';
var toolNdviAfterNode = '722519bc-3312-4c35-924b-9f1a155f83ec';
var toolNdviDifferenceNode = '875f9059-2b87-49d4-8d2a-3ecc47d4b14d';

var HERE_APP_CODE = '';
var HERE_APP_ID = '';

// Get Map - Add Difference Layers

var createMap = function() {

    // Declare a Tile layer with an OSM source

    var hereLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://1.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/terrain.day/{z}/{x}/{y}/256/png8?app_id=mXP4DZFBZGyBmuZBKNeo&app_code=kBWb6Z7ZLcuQanT_RoP60A'
        })
    });

    // Create latitude and longitude and convert them to default projection
    var cacheCreek = ol.proj.transform([-121.34468078613281,
                                        50.82285473543414],
                                       'EPSG:4326', 'EPSG:3857');
    // Create a View, set it center and zoom level
    var view = new ol.View({
        center: cacheCreek,
        zoom: 11
    });

    // Instanciate a Map, set the object target to the map DOM id
    var map = new ol.Map({
        target: 'map'
    });
    // Add the created layer to the Map
    map.addLayer(hereLayer);

    // Set the view for the map
    map.setView(view);
    return map;
};

var getToolRunTileNode = function(nodeId, toolRunId) {
    var url = 'https://tiles.rasterfoundry.com/tiles/tools/' +
            toolRunId + '/{z}/{x}/{y}?token=' +
            JWT + '&node=' + nodeId + '&cramp=inferno';

    return new ol.layer.Tile({
        source: new ol.source.XYZ({url: url}),
        opacity: 0.7
    });
};

var getProjectLayer = function(projectId, mapToken) {
    var url = 'https://tiles.rasterfoundry.com/tiles/' +
            projectId + '/{z}/{x}/{y}?mapToken=' +
            mapToken;

    return new ol.layer.Tile({
        source: new ol.source.XYZ({url: url})
    });
};

var loadFires = function() {
    var fires = {};

    var ndviBeforeLayers = [];
    var ndviAfterLayers = [];
    var ndviDifferenceLayers = [];
    var projectBeforeLayers = [];
    var projectAfterLayers = [];

    var views = {};

    $('.card').each(function(i, fire) {
        var data = fire.dataset;

        // Create a View for Fire
        var view = new ol.View({
            center: ol.proj.transform([data.x,data.y], 'EPSG:4326', 'EPSG:3857'),
            zoom: data.z
        });

        views[fire.id] = view;

        var ndviBeforeLayer = getToolRunTileNode(toolNdviBeforeNode, data.toolrun);
        ndviBeforeLayers.push(ndviBeforeLayer);
        var ndviAfterLayer = getToolRunTileNode(toolNdviAfterNode, data.toolrun);
        ndviAfterLayers.push(ndviAfterLayer);
        var ndviDifferenceLayer = getToolRunTileNode(toolNdviDifferenceNode, data.toolrun);
        ndviDifferenceLayers.push(ndviDifferenceLayer);
        var projectBeforeLayer = getProjectLayer(data.projectbefore,
                                                 data.projectbeforemaptoken);
        projectBeforeLayers.push(projectBeforeLayer);
        var projectAfterLayer = getProjectLayer(data.projectafter,
                                                 data.projectaftermaptoken);
        projectAfterLayers.push(projectAfterLayer);

    });

    var ndviBeforeLayerGroup = new ol.layer.Group({layers: ndviBeforeLayers});
    var ndviAfterLayerGroup = new ol.layer.Group({layers: ndviAfterLayers});
    var ndviDifferenceLayerGroup = new ol.layer.Group({layers: ndviDifferenceLayers});
    var projectBeforeLayerGroup = new ol.layer.Group({layers: projectBeforeLayers});
    var projectAfterLayerGroup = new ol.layer.Group({layers: projectAfterLayers});

    var layers = {
        ndviBefore: ndviBeforeLayerGroup,
        ndviAfter: ndviAfterLayerGroup,
        ndviDifference: ndviDifferenceLayerGroup,
        projectBefore: projectBeforeLayerGroup,
        projectAfter: projectAfterLayerGroup
    };
    return {views: views, layers:layers};
};


var addSlidertoLayer = function(slider, layerGroup) {
    layerGroup.getLayers().forEach(function(l) {
        l.on('precompose', function(event) {
            var ctx = event.context;

            console.log(swipe.value);
            var width = ctx.canvas.width * (swipe.value / 100);

            ctx.save();
            ctx.beginPath();
            ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height);
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

    $beforeLayerSelect = $('#before-comparison-layer-select');
    $afterLayerSelect = $('#after-comparison-layer-select');

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

    var map = createMap();
    var fireResults = loadFires();
    var fireLayers = fireResults.layers;

    map.addLayer(fireLayers.ndviBefore);
    map.addLayer(fireLayers.ndviAfter);

    fireLayers.ndviDifference.setVisible(false);
    fireLayers.projectBefore.setVisible(false);
    fireLayers.projectAfter.setVisible(false);
    map.addLayer(fireLayers.ndviDifference);
    map.addLayer(fireLayers.projectBefore);
    map.addLayer(fireLayers.projectAfter);

    var swipe = document.getElementById('swipe');

    addSlidertoLayer(swipe, fireLayers.projectAfter);
    addSlidertoLayer(swipe, fireLayers.ndviAfter);

    swipe.addEventListener('input', function() {
        map.render();
    }, false);

    $($mapSlider).bind('mousedown', function(e){

        $($mapContainer).bind('mousemove', function(e){
            var sliderPos = e.clientX - $mapOffset - 15;
            $($mapSlider).css('left', sliderPos);
        });

        $($mapSlider).bind('mouseup',function(){
            $($mapContainer).unbind('mousemove')
        });
    });

    /*
     * Extent vs Comparison
     */
    $($activateExtentBtn).on('click', function(el) {
        el.preventDefault();

        $($activateExtentBtn).addClass('active');
        $($activateComparisonBtn).removeClass('active');
        $($beforeLayerSelect).addClass('hide');
        $($afterLayerSelect).addClass('hide');
        $($thresholdControl).removeClass('hide');

        fireLayers.ndviDifference.setVisible(true);

        fireLayers.projectBefore.setVisible(false);
        fireLayers.projectAfter.setVisible(false);

        fireLayers.ndviBefore.setVisible(false);
        fireLayers.ndviAfter.setVisible(false);
    });

    $($activateComparisonBtn).on('click', function(el) {
        el.preventDefault();

        $($activateComparisonBtn).addClass('active');
        $($activateExtentBtn).removeClass('active');
        $($beforeLayerSelect).removeClass('hide');
        $($afterLayerSelect).removeClass('hide');
        $($thresholdControl).addClass('hide');

        fireLayers.ndviDifference.setVisible(false);

        fireLayers.projectBefore.setVisible(false);
        fireLayers.projectAfter.setVisible(false);

        fireLayers.ndviBefore.setVisible(true);
        fireLayers.ndviAfter.setVisible(true);
    });

    /*
     * Choose Comparison
     */
    $($beforeLayerSelect).on('change', function() {
        if (this.value === "natural") {
            fireLayers.projectBefore.setVisible(true);
            fireLayers.ndviBefore.setVisible(false);
        } else {
            fireLayers.projectBefore.setVisible(false);
            fireLayers.ndviBefore.setVisible(true);
        };
    });

    $($afterLayerSelect).on('change', function() {
        if (this.value === "natural") {
            fireLayers.projectAfter.setVisible(true);
            fireLayers.ndviAfter.setVisible(false);
        } else {
            fireLayers.projectAfter.setVisible(false);
            fireLayers.ndviAfter.setVisible(true);
        };
    });
});
