/**
 * General JavaScript used to enhance the styles on the page.
 * 
 * @author Brenton Hauth
 */
;(function($) {
"use strict";


$('body').scrollspy({
    target: '#navbarList',
    offset: 55
});

$(`.scroll-to[href^="#"]`).on("click", function() {
    if (
        location.pathname === this.pathname &&
        location.hostname === this.hostname
    ) {
        $("html, body").animate({
            scrollTop: $(this.hash).offset().top - 54
        }, 1000, "easeInOutExpo");
        $(".navbar-collapse").collapse("hide");
        return false;
    }
});




if (isMobile()) return;

var docEl = document.documentElement;

var navbarIsWhite = docEl.scrollTop > 80;

var navbar = $("nav.navbar");
// trust
navbar.css({ "display": "none" });
//setTimeout(() => {
    navbar.removeClass(
        navbarIsWhite ? "" : "bg-light"
    ).css({
        "display": "flex",
        "transition": ".3s"
    })
//}, 10);


$(window).on("scroll", () => {
    if (navbarIsWhite && docEl.scrollTop < 81) {
        navbarIsWhite = false;
        navbar.removeClass("bg-light");
    } else if (!navbarIsWhite && docEl.scrollTop > 80) {
        navbarIsWhite = true;
        navbar.addClass("bg-light");
    }
});



})(jQuery);

