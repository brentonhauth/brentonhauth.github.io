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

var scrollAmount = 60;

var docEl = document.documentElement;

var navbarIsWhite = docEl.scrollTop > scrollAmount;

var navbar = $("nav.navbar");

navbar.css({ "display": "none" });

navbar.removeClass(
    navbarIsWhite ? "" : "bg-light"
).css({
    "display": "flex",
    "transition": ".3s"
})


$(window).on("scroll", () => {
    if (navbarIsWhite && docEl.scrollTop < (scrollAmount + 1)) {
        navbarIsWhite = false;
        navbar.removeClass("bg-light");
    } else if (!navbarIsWhite && docEl.scrollTop > scrollAmount) {
        navbarIsWhite = true;
        navbar.addClass("bg-light");
    }
});



})( jQuery );
