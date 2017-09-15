
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

    getFolios().then(fillData);
    getFolios().then(findFolio).then(function(f) {
        getProjectAndPrediction(f.projects[0]).then(function (x, y) {
            console.log(x)
            console.log(y)
        });
        console.log(f);
    });
})