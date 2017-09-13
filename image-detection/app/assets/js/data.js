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
    return $.when(getProject(projectId), getPrediction(projectId))
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