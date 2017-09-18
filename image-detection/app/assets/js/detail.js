
$(function() {
    var feedName = getUrlParameter('feed');
    console.log(feedName);

    var source = $("#card--template").html();

    var template = Handlebars.compile(source);

    var projectsList = $('#card--container--home');

    var fillData = function (data) {
        $.each(data.results, function (i, v) {
            var html = template(v);
            // console.log(html);
            projectsList.append(html);
        });
    };

    var findFolio = function (data) {
        var x = _.find(data.results, function (d) {
            return d.id == feedName
        });
        return x
    };

    // getFolios().then(fillData);
    getFolios().then(findFolio).then(function(f) {
        $.each(f.projects, function(i, project) {
            getProjectAndPrediction(project).then(function (x, y) {
                var context = {
                    date: x[0].date,
                    id: x[0].id,
                    mapToken: x[0].mapToken,
                    detections: y[0].features.length
                };
                var html = template(context);
                // console.log(html);
                projectsList.append(html);
                var leafletMap = L.map('map-' + context.id, {attributionControl: false, zoomControl: false, scrollWheelZoom: false, touchZoom: false, doubleClickZoom: false, dragging: false}).setView([51.505, -0.09], 13);
                var layer = L.geoJSON(y[0]);
                var bounds = layer.getBounds();
                layer.addTo(leafletMap);
                leafletMap.fitBounds(bounds);
                leafletMap.setZoom(leafletMap.getZoom() + 2);
                var projectLayer = getProjectLeafletLayer(x[0].id, x[0].mapToken);
                projectLayer.addTo(leafletMap);
            });
        });

        console.log(f);
    });
})
