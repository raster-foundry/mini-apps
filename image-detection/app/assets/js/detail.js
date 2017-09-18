
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
        getProjectAndPrediction(f.projects[0]).then(function (x, y) {
            console.log(x)
            console.log(y)
            var context = {
                date: x[0].date,
                id: x[0].id,
                detections: y[0].features.length
            };
            var html = template(context);
            // console.log(html);
            projectsList.append(html);
            var leafletMap = L.map('map-' + context.id, {attributionControl: false}).setView([51.505, -0.09], 13);
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}').addTo(leafletMap);
            var layer = L.geoJSON(y[0]);
            var bounds = layer.getBounds();
            layer.addTo(leafletMap);
            leafletMap.fitBounds(bounds);
            leafletMap.setZoom(leafletMap.getZoom() + 2);
            var projectLayer = getProjectLeafletLayer(x[0].id, x[0].mapToken);
            projectLayer.addTo(leafletMap);
        });
        console.log(f);
    });
})