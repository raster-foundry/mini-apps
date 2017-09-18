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

    var fillData = function (data) {
        $.each(data, function (i, v) {
            var bufferedGeom = turf.buffer(v.geometry, 600, 'meters');
            var bbox = turf.bbox(bufferedGeom).toString();
            v.properties.exportURL = getProjectExport(projectId, bbox, mapToken);
            var upScore = v.properties.score * 10000000;
            v.properties.score = Math.round(upScore) / 10000000;
            console.log(v.properties.score.toString());
            v.properties.num = i;
            var html = template(v.properties);
            // console.log(html);
            predictionList.append(html);
            $('#description-' + i).editable();
        });
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
