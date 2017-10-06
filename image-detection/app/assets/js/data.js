// Utilities for loading data

var getFolios = function() {
    return $.getJSON('/assets/js/data/folios.json');
};

var getProject = function(projectId) {
    return $.getJSON('/assets/js/data/projects/' + projectId + '.json');
};

var getPrediction = function(projectId) {
    return $.getJSON('/assets/js/data/predictions/' + projectId + '.json');
};

var getProjectAndPrediction = function(projectId) {
    return $.when(getProject(projectId), getPrediction(projectId)).done(function(x, y) {
        // debugger
    })
};

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var getProjectLeafletLayer = function(projectId, mapToken) {
    return L.tileLayer(
        'https://tiles.rasterfoundry.com/tiles/{projectId}/{z}/{x}/{y}/?mapToken={mapToken}',
        {projectId: projectId, mapToken: mapToken}
    );
};

var getProjectExport = function(projectId, bbox, mapToken) {
    return 'https://tiles.rasterfoundry.com/tiles/' + projectId +
        '/export/?bbox=' + bbox +
        '&zoom=20&mapToken=' + mapToken;
};