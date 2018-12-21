function loadPage(p) {
    p = p.toLowerCase();
    $("#Content").load(p+".html");
    var titled = p.charAt(0).toUpperCase() + p.substr(1);
    $("#heading").text(titled);
    $("title").text("Brenton Hauth | "+titled);
}
$(document).ready(function() {
    $(".nav-link").click(function() {
        var lastActive = $(".nav-link.active"), t = $(this).text();
        if (lastActive.text() === t) return;
        lastActive.toggleClass("active");
        $(this).toggleClass("active");
        loadPage(t);
    });
    loadPage("about");
});
