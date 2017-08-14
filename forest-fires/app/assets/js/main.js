// Common Settings

var toolNdviBeforeNode = 'a4d3b166-7dda-4eb4-bfd1-d1d42400b15e';
var toolNdviAfterNode = 'd0029397-e300-4c9a-af71-21ad3f2224ec';
var toolNdviDifferenceNode = '01f88817-acd7-4bbd-93cb-6fdd253e9c83';

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
    var cacheCreek = ol.proj.transform([-121.3092, 50.8292],
                                       'EPSG:4326', 'EPSG:3857');
    // Create a View, set it center and zoom level
    var view = new ol.View({
        center: cacheCreek,
        zoom: 13
    });

    var mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(4),
        projection: 'EPSG:4326',
        // comment the following two lines to have the mouse position
        // be placed within the map.
        // className: 'custom-mouse-position',
        // target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;'
    });

    // Instanciate a Map, set the object target to the map DOM id
    var map = new ol.Map({
        target: 'map',
        controls: ol.control.defaults().extend([mousePositionControl])
    });
    // Add the created layer to the Map
    map.addLayer(hereLayer);

    // Set the view for the map
    map.setView(view);
    return map;
};

var getToolRunTileNode = function(nodeId, toolRunId, mapToken, colorRamp) {
    var url = 'https://tiles.rasterfoundry.com/tiles/tools/' +
            toolRunId + '/{z}/{x}/{y}?mapToken=' +
            mapToken + '&node=' + nodeId + '&cramp=' + colorRamp;

    return new ol.layer.Tile({
        source: new ol.source.XYZ({url: url}),
        opacity: 1.0
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
    var cards = {};

    $('.card').each(function(i, fire) {
        var data = fire.dataset;

        // Create a View for Fire
        var view = new ol.View({
            center: ol.proj.transform([parseFloat(data.x), parseFloat(data.y)],
                                      'EPSG:4326', 'EPSG:3857'),
            zoom: data.z
        });

        views[fire.id] = view;
        cards[fire.id] = fire;

        var ndviBeforeLayer = getToolRunTileNode(toolNdviBeforeNode, data.toolrun, data.toolrunmaptoken, 'viridis');
        ndviBeforeLayers.push(ndviBeforeLayer);
        var ndviAfterLayer = getToolRunTileNode(toolNdviAfterNode, data.toolrun, data.toolrunmaptoken, 'viridis');
        ndviAfterLayers.push(ndviAfterLayer);
        var ndviDifferenceLayer = getToolRunTileNode(toolNdviDifferenceNode, data.toolrun, data.toolrunmaptoken, 'magma');
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

    // var swipe = document.getElementById('swipe');

    addSlidertoLayer($mapSlider, fireLayers.projectAfter);
    addSlidertoLayer($mapSlider, fireLayers.ndviAfter);

    // swipe.addEventListener('input', function() {
    //     map.render();
    // }, false);

    $($mapSlider).bind('mousedown', function(e){

        $($mapContainer).bind('mousemove', function(e){
            var sliderPos = e.clientX - $mapOffset - 15;
            $($mapSlider).css('left', sliderPos);
            console.log(sliderPos);
            map.render();
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
        // $($thresholdControl).removeClass('hide');
        $($mapSlider).addClass('hide');

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
        // $($thresholdControl).addClass('hide');
        $($mapSlider).removeClass('hide');

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


    $cards = $('.card');

    $cards.on('click', function(e) {
        var clickedCardId = e.currentTarget.id;

        for (var cardId in fireResults.cards) {
            var card = $(fireResults.cards[cardId]);
            if (clickedCardId === cardId) {
                card.addClass('active');
                map.setView(fireResults.views[clickedCardId]);
            } else {
                card.removeClass('active');
            }
        };
    });

});
