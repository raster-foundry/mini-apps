$(function() {
    var feedName = getUrlParameter('feed');
    console.log(feedName);

    var projectId = getUrlParameter('project');
    var mapToken = getUrlParameter('mapToken');

    var source = $("#prediction--template").html();

    var numImagesSource = $('#num-images--template').html();

    var template = Handlebars.compile(source);
    var numImagesTemplate = Handlebars.compile(numImagesSource);

    var predictionList = $('#table-list');
    var numImagesList = $('#num-images');

    $.fn.editable.defaults.mode = 'inline';

    var features = {};

    var fillData = function (data) {

        var sliced = data.slice(0, 40);

        $.each(sliced, function (i, v) {
            var bufferedGeom = turf.buffer(v.geometry, 600, 'meters');
            var bbox = turf.bbox(bufferedGeom).toString();
            v.properties.bbox = bbox;
            v.properties.exportURL = getProjectExport(projectId, bbox, mapToken);
            var upScore = v.properties.score * 10000000;
            v.properties.score = Math.round(upScore) / 10000000;
            console.log(v.properties.score.toString());
            v.properties.num = i;
            v.properties.id = i;
            var html = template(v.properties);
            // console.log(html);
            predictionList.append(html);

            // $().click(function () {
            //     console.log("here");
            //
            // });
        });
        var leafletMap = L.map('map', {attributionControl: false}).setView([51.505, -0.09], 13);
        var layer = L.geoJSON(data);
        var bounds = layer.getBounds();
        layer.addTo(leafletMap);
        leafletMap.fitBounds(bounds);
        leafletMap.setZoom(leafletMap.getZoom() + 2);
        var projectLayer = getProjectLeafletLayer(projectId, mapToken);
        projectLayer.addTo(leafletMap);


        $( "img" ).click(function(el) {
            var bbox = this.getAttribute("data-bbox").split(",");
            leafletMap.fitBounds([
                        [bbox[1], bbox[0]],
                        [bbox[3], bbox[2]]
            ]);
        });

        // $("#date-setting").text(function() {
        //     debugger;
        //     return data.date;   
        // });
    };

    var fillNumImages = function(geojson) {
      var html = numImagesTemplate({numImages: geojson.features.length});
      numImagesList.append(html)
    };

    getPrediction(projectId).then(function (data) {
        var sortedData = _.sortBy(data.features, function(d) {
            console.log(d.properties);
            return -1 * d.properties.score;
        });
        fillNumImages(data);
        fillData(sortedData);
    });
});
