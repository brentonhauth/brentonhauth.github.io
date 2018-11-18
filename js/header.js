(function() { "use strict";

var hdr = document.querySelectorAll("div.header")[0];

window.format = {
    header : function() {
        var pxl = document.documentElement.scrollTop;
        if (pxl > 200) return;
        var ratio = pxl / 200;
        hdr.style.opacity = (1 - (ratio / 2));
    },
    navBar : function(element) {
        for (const link of document.querySelectorAll("a.navBar")) {
            link.style.color = "var(--primary)";
        }
        element.style.color = "var(--secondary)";
        //this.header();
    }
}

window.addEventListener("scroll", function() {
    format.header();
});

for (const link of document.querySelectorAll("a.navBar")) {
    link.setAttribute("onclick", "format.navBar(this)");
}

})();
