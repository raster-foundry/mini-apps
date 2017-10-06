$(function() {
    var source = $("#card--template").html();

    var template = Handlebars.compile(source);

    var projectsList = $('#card--container--home');

    var fillData = function (data) {
        $.each(data.results, function (i, v) {
            v.elId = 'card--chart-' + i;
            var html = template(v);
            // console.log(html);
            projectsList.append(html);
        });
    };

    getFolios().then(fillData);

});

