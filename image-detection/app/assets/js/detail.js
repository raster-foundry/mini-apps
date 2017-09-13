
$(function() {
    var feedName = getUrlParameter('feed');
    console.log(feedName);

    var source = $("#card--template").html();

    var template = Handlebars.compile(source);

    var projectsList = $('#card--container--home');

    var fillData = function (data) {
        debugger;
        $.each(data.results, function (i, v) {
            var html = template(v);
            // console.log(html);
            projectsList.append(html);
        });
    };
    getFolios().then(fillData);
})