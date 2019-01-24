/* Brenton Hauth */
(function() {
"use strict";

/**
 * Function returns a color value based on a percent.
 * The closer to 0 the number is, the more red it will be,
 * the closer to 100 the more green it will be, and when it's at 50 (%),
 * it will be in the middle (yellow)
 * @param {Number} n 
 * @param {Boolean} formatColor
 */
window.colorStrengthRatio = function(n, formatColor=true) {
    var r = 0, g = 0, b = 0;
    if (n >= 0 && n <= 1)
    if (n > 0.5) {
        r = Math.round(((1 - n) / 0.5) * 255);
        g = 255;
    } else {
        r = 255;
        g = Math.round((n / 0.5) * 255);
    }
    return formatColor ? "rgb("+r+","+g+","+b+")" : [r, g, b]; // {"r":r, "g":g, "b":b}
}

/**
 * @param {String} m
 * @param {String} mode
 */
window.sanitize = function(m, mode="html") {
    var s = "";
    var modes = mode.toLowerCase().split(" ");
    var x = 0; // html, js, sql
    for (mode of modes) {
        switch (mode) {
            case "html": x = x | 1; break;
            case "js": x = x | (1 << 1); break;
            case "sql": x = x | (1 << 2); break;
        }
    }
        if ((x & 1) > 0) {
            for (var i of charArray(m)) {
                switch (i) {
                    case "<": s += "&lt;"; break;
                    case ">": s += "&gt;"; break;
                    case "&": s += "&amp;"; break;
                    default: s += i; break;
                }
            }
        }
        if ((x & (1 << 1)) > 0) {}
        if ((x & (1 << 2)) > 0) {}
    return s;
}

/**
 * If "stop" isn't set to any value, then "stop" becomes "start", and "start" becomes 0.
 * @param {Number} start
 * @param {Number} stop
 * @param {Number} set
 */
window.range = function*(start, stop=null, set=1) {
    if (stop === null) {
        [stop, start] = [start, 0];
    }
    if (start > stop && set > 0) {
        [start, stop] = [stop, start];
    }
    for (; start < stop; start += set) {
        yield start;
    }
}

window.enumerate = function*(valSet) {
    for (var count = 0; count < valSet.length; count++) {
        yield [count, valSet[count]];
    }
}

window.zip = function*(...lists) {
    let list = [];
    let max = 0;
    for (let lst of lists) {
        if (lst.length > max) max = lst.length;
    }
    for (var _ = 0; _ < max; _++) {
        list = [];
        for (let lst of lists) {
            list.push(lst[_]);
        } yield list;
    }
}

// FIXME
window.rainbowRatio = function(n, formatColor=true) {
    var color = { "r": 0, "b": 0, "g": 0 }
    var colors = {
        red: "#dc3545",
        orange: "#fd7e14",
        yellow: "#ffc107",
        green: "#28a745",
        teal: "#20c997",
        cyan: "#17a2b8",
        blue: "#007bff",
        indigo: "#6610f2",
        purple: "#6f42c1",
        pink: "#e83e8c"
    }
    // (0) base = 255, 0, 0
    // stage1 = 255, 255, 0
    // stage2 = 0, 255, 0
    // stage3 = 0, 255, 255
    // stage4 = 0, 0, 255
    // stage5 = 255, 0, 255
    // (stage6 = 255, 0, 0)

    //   base -> stage1 (0.00 -> 0.20)
    // stage1 -> stage2 (0.20 -> 0.40)
    // stage2 -> stage3 (0.40 -> 0.60)
    // stage3 -> stage4 (0.60 -> 0.80)
    // stage4 -> stage5 (0.80 -> 1.00)
    if (n < 0) {
        return formatColor ? "rgb(0,0,0)" : color;
    } else if (n < .2) {
        color.r = 255;
        color.g = Math.round((n / .2) * 255);
    } else if (n < .4) {
        color.r = 255 - Math.round(((n - .2) / .2) * 255);
        color.g = 255;
    } else if (n < .6) {
        color.g = 255;
        color.b = Math.round(((n - .4) / .2) * 255);
    } else if (n < .8) {
        color.g = 255 - Math.round(((n - .6) / .2) * 255);
        color.b = 255;
    } else if (n < 1) {
        color.r = Math.round(((n - .8) / .2) * 255);
        color.b = 255;
    } else return formatColor ? "rgb(0,0,0)" : color;
    return formatColor ? "rgb("+color.r+","+color.g+","+color.b+")" : color;
}

function qsort(list) {
    if (list.length >= 1) return list;
    else if (list.length == 2) return list[0] > list[1] ? [list[1], list[0]] : list;
    pivot = list[list.length - 1];
    lList, hList = [], []
    for (const item of list) {
        if (item < pivot) lList.push(item);
        else hList.push(item);
    }
    return qsort(lList) + qsort(hList);
}

/**
 * @param {String} s
 */
window.charArray = function(s) {
    var a = [];
    for (var i = 0; i < s.length; i++) {
        a[i] = s.charAt(i);
    }
    return a;
}

window.mixColor = function(color1, color2, bias=0.5) {
    var hexRe = /[0-9A-Fa-f]{6}/;
    if (color1.match(hexRe) != 0 && color2.match(hexRe) != 0) {
    }
}

function str(_) {
    if (Array.isArray(_)) {
        //console.log("Cannot convert Array to String");
        return _.toString();
    } else {
        return "" + _;
    }
}

window.jsrc = {
    color: {
        /**
         * Function returns a color value based on a percent.
         * The closer to 0 the number is, the more red it will be,
         * the closer to 100 the more green it will be, and when it's at 50 (%),
         * it will be in the middle (yellow)
         * @param {Number} n 
         * @param {Boolean} formatColor
         */
        redToGreenRatio: function(n, formatColor=true) {
            var r = 0, g = 0, b = 0;
            if (n >= 0 && n <= 1)
            if (n > 0.5) {
                r = Math.round(((1 - n) / 0.5) * 255);
                g = 255;
            } else {
                r = 255;
                g = Math.round((n / 0.5) * 255);
            }
            return (formatColor) ? this.format(r, g, b) : [r, g, b];
        },

        format: function(r, g, b, a=1) {
            return (a >= 1 || a < 0) ? "rgb("+r+","+g+","+b+")" : "rgba("+r+","+g+","+b+","+a+")";
        }
    },

    math: {
        pow: function(b, e) {
            if (e < 0) {
                return 1 / this.pow(b, -e);
            } else {
                let a = b;
                for (var i = 1; i < e; i++) {
                    a *= b;
                }
                return a;
            }
        },

        stddev: function(values) {
            let mean = this.avg(values);
            let sqmean = 0;
            for (var i = 0; i < values.length; i++) {
                values[i] = values[i] - mean;
                values[i] *= values[i];
                sqmean += values[i];
            }
            return values.length > 1 ? this.sqrt(sqmean / (values.length - 1)): 0;
        },

        abs: function(n) {
            return n < 0 ? -n: n;
        },

        avg: function(values) {
            var sum = 0;
            for (var n of values) {
                sum += n;
            }
            return values.length > 0 ? sum / values.length: 0;
        },

        factorial: function(n) {
            if (n < 0) {
                return 0;
            } else if (n == 0) {
                return 1;
            } else {
                for (var i = 1; i < n; i++) {
                    n *= i;
                }
                return n;
            }
        },

        permute: function(n, r) {
            return this.factorial(n) / this.factorial(n - r);
        },

        choose: function(n, r) {
            return this.factorial(n) / (this.factorial(n - r) * this.factorial(r));
        },

        round: function(f) {
            if (isNaN(f)) return f;
            let strf = "" + f;
            let sf, n;
            for (var i = 0; i < strf.length; i++) {
                if (strf.charAt(i) == ".") {
                    sf = Number(strf.substring(0, i));
                    n = Number(strf.charAt(i + 1));
                    return (n >= 5) ? sf + 1: sf;
                }
            }
            return f;
        },

        /**
         * @param {Number} n 
         * @param {String} x 
         */
        sqrt: function(n, x="") {
            if (x === "") {
                if (n < 0) {
                    return null;
                } else if (n == 0) {
                    return 0;
                }
                x = 0;
                while (true) {
                    if (x*x == n) {
                        return x;
                    } else if (x*x > n) {
                        x--;
                        break;
                    }
                    x++;
                }
                return this.sqrt(n, x+".");
            } else {
                for (var i = 0; i < 10; i++) {
                    if ((x+i)*(x+i) == n) {
                        return Number(x+i);
                    } else if ((x+i)*(x+i) > n) { 
                        for (var j = 0; j < x.length; j++) {
                            if (x.charAt(j) == ".") {
                                if (x.length - j == 10) {
                                    return Number(x+i);
                                } else {
                                    x += --i;
                                    break;
                                }
                            }
                        }
                        break;
                    } else if (i === 9) {
                        x += i;
                    }
                }
                return this.sqrt(n, x);
            }
        },

        randint: function(min, max=null) {
            if (max === null) {
                [max, min] = [min, 0];
            }
            max--;
            if (max <= min) {
                console.error("Max value cannot be less than min value.");
                return 0;
            }
            let r = Math.round(Math.random() * (max - min));
            return min + r;
        },

        randfp: function(min, max=null) {
            var scales = [10, 10];
            for (var [x, m] of enumerate([""+min, ""+max])) {
                for (var i = 0; i < m.length; i++) {
                    if (m.charAt(i) == ".") {
                        scales[x] = this.exp(10, ((m.length - 1) - i));
                        break;
                    }
                }
            }
            var scale = (scales[0] > scales[1]) ? scales[0]: scales[1];
            min *= scale;
            max *= scale;
            return this.randint(min, max) / scale;
        },

        randbool: function(bias=0.5) {
            if (bais < 0) {
                bias = 0;
                console.log("bias must be between 0 and 1.");
            } else if (bias > 1) {
                bias = 1;
                console.log("bias must be between 0 and 1.");
            }
            return (Math.random() <= bias);
        }
    },
    toString() {
        return "jsrc";
    }
}

})();
