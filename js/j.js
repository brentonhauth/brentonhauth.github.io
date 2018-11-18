(function() { "use strict";

/**
 * @param {String} str 
 */
window.charArray = function(str) {
    var chars = [];
    for (var i = 0; i < str.length; i++) {
        chars.push(str.charAt(i));
    }
    return chars;
}

/**
 * @param {String} txt 
 */
window.sanitize = function(txt) {
    var s = "";
    for (const char of charArray(txt)) {
        switch (char) {
            case "<": s += "&lt;"; break;
            case ">": s += "&gt;"; break;
            case "&": s += "&amp;"; break;
            default: s += char; break;
        }
    }
    return s;
}

/**
 * Function returns a color value based on a given ratio.
 * The closer to 0 the number is, the more red it will be,
 * the closer to 1 the more green it will be, and when it's at 0.5,
 * it will be in the middle (yellow)
 * @param {Number} n
 * @param {Boolean} formatColor
 */
window.ratioColorRGB = function(n, formatColor=true) {
    var r = 0, g = 0, b = 0;
    if (n < 0 || n > 1) return formatColor ? "rgb(0,0,0)" : [0, 0, 0];
    if (n > 0.5) {
        r = Math.round(((1 - n) / 0.5) * 255);
        g = 255;
    } else {
        r = 255;
        g = Math.round((n / 0.5) * 255);
    }
    return formatColor ? "rgb("+r+","+g+","+b+")" : [r, g, b];
}

window.enumerate = function*(set) {
    for (var count = 0; count < set.length; count++) {
        yield [count, set[count]];
    }
}

})();
