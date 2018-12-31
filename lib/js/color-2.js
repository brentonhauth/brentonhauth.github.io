/* Brenton Hauth */
(function() {
"use strict";

//var Num = Number;

var Round = Math.round;

var Min = Math.min;

var Max = Math.max;

var avg = function avg(arr) {
    if (arr.length == 0) return 0;
    let sum = 0;
    for (var i of arr) {
        sum += i;
    } return sum / arr.length;
}

var isHex = function isHex(s) {
    if (typeof s != "string") return false;
    if (s.charAt(0) == "#") s = s.substr(1);
    let rex = /[A-Fa-f0-9]{6}/;
    return (s.length===6 && rex.test(s));// || (s.length===3 && /[A-Fa-f0-9]{3}/.test(s));
}

//------------------------------------------------------------

window.Mixer = {

    mix: function(args) {
        if (typeof(args) === "object") {

            // if is "[]"
            if (Array.isArray(args)) {
            // else is "{}"
            } else {
                let total = 0;
                for (var i in args) {
                    console.log(String(i) + " " + isHex(i) + " " + typeof args[i]);
                    if (isHex(i) && typeof args[i] === "number") {
                        total += Math.abs(args[i]);
                    }
                }
                if (total === 0) total = 1;
                let Rs = [], Gs = [], Bs = [];
                for (var i in args) {
                    let c = new ColorRGB(0,0,0);
                    if (isHex(i) && typeof args[i] === "number") {
                        c.hex = String(i);
                        let ratio = args[i] / total;
                        console.log(ratio + ` ${c.r},${c.g},${c.b}`);
                        Rs.push(c.r * ratio);
                        Gs.push(c.g * ratio);
                        Bs.push(c.b * ratio);
                    }
                }
                let m = new ColorRGB(Round(avg(Rs)), Round(avg(Gs)), Round(avg(Bs)));
                return m;
            }
        }
    }
}

//------------------------------------------------------------

window.ColorRGB = class {

    constructor(R, G, B, a=1) {
        this.red = R;
        this.green = G;
        this.blue = B;
        /*this.r = R;
        this.g = G;
        this.b = B;*/
        this.alpha = a;
    }

    //------------------------------------------------------------
    get r() { return this.red; }

    set r(value) {
        if (isNaN(value)) return;
        value = Round(value);
        if (value < 0) {
            this.red = 0;
        } else if (value > 255) {
            this.red = 255;
        } else this.red = value;
    }

    //------------------------------------------------------------
    get g() { return this.green; }

    set g(value) {
        if (isNaN(value)) return;
        value = Round(value);
        if (value < 0) {
            this.green = 0;
        } else if (value > 255) {
            this.green = 255;
        } else this.green = value;
    }

    //------------------------------------------------------------
    get b() { return this.blue; }

    set b(value) {
        if (isNaN(value)) return;
        value = Round(value);
        if (value < 0) {
            this.blue = 0;
        } else if (value > 255) {
            this.blue = 255;
        } else this.blue = value;
    }

    //------------------------------------------------------------
    get a() { return this.alpha; }

    set a(value) {
        if (isNaN(value)) return;
        if (value < 0) {
            this.alpha = 0;
        } else if (value > 1) {
            this.alpha = 1;
        } else this.alpha = value;
    }

    //------------------------------------------------------------
    set hex(s) {
        var re = /[A-Fa-f0-9]{6}/;
        if (!isHex(s)) return;
        var h = s.match(re)[0]; var ca = [];
        for (var i = 0; i < 3; i++) {ca.push(h.substr(i*2, 2));}
        this.r = parseInt(ca[0], 16);
        this.g = parseInt(ca[1], 16);
        this.b = parseInt(ca[2], 16);
    }

    get hex() {
        let R = this.r;
        let G = this.g;
        let B = this.b;
        let s = "#"+R.toString(16);
        s += G.toString(16);
        s += B.toString(16);
        return s;
    }

    //------------------------------------------------------------
    toHSL() {
        let H = 0; let S = 0; let L = 0;
        let ratR = this.r / 255;
        let ratG = this.g / 255;
        let ratB = this.b / 255;
        let rMin = Min(ratR, ratG, ratB);
        let rMax = Max(ratR, ratG, ratB);
        L = (rMin + rMax) / 2;
        if ((rMax - rMin) == 0) return new ColorHSL(0,0,L);
        S = (rMax - rMin) / (L < 0.5 ? (rMax + rMin) : (2 - rMax - rMin));
        if (ratR == rMax) {
            H = (ratG - ratB) / (rMax - rMin);
        } else if (ratG == rMax) {
            H = ((ratB - ratR) / (rMax - rMin)) + 2;
        } else {
            H = ((ratR - ratG) / (rMax - rMin)) + 4;
        }; H *= 60;
        return new ColorHSL(H, S, L);
    }

    //------------------------------------------------------------
    get formatRGB() {
        
        if (this.a == 1) return `rgb(${this.r},${this.g},${this.b})`;
        else return `rgba(${this.r},${this.g},${this.b},${this.a})`;
        
    }

    //------------------------------------------------------------
    static mix(color1, color2, bias=0.5, formatColor=true) {
        let c1 = new ColorRGB(0,0,0);
        let c2 = new ColorRGB(0,0,0);
        let mix = new ColorRGB(0,0,0);
        if (color1 instanceof ColorRGB && color1 instanceof ColorRGB) {
            c1 = color1; c2 = color2;
        } else if (!isHex(color1) || !isHex(color2)) {
            return formatColor ? mix.formatRGB : mix;
        } else {
            c1.hex = color1;
            c2.hex = color2;
        }
        mix.r = c1.r + Round((c2.r - c1.r) * bias);
        mix.g = c1.g + Round((c2.g - c1.g) * bias);
        mix.b = c1.b + Round((c2.b - c1.b) * bias);
        return formatColor ? mix.formatRGB : mix;
    }
}

//------------------------------------------------------------

window.ColorHSL = class {
    constructor(pH, pS, pL, pA=1) {
        this.hue = pH;
        this.sat = pS;
        this.lum = pL;
        this.a = pA;
    }

    //------------------------------------------------------------
    get h() { return this.hue; }

    set h(value) {
        if (isNaN(value)) return;
        value = Round(value);
        if (value < 0) {
            this.hue = 0;
        } else if (value > 360) {
            this.hue = 360;
        } else this.hue = value;
    }

    //------------------------------------------------------------
    get s() { return this.sat; }

    set s(value) {
        if (isNaN(value)) return;
        value = Round(value * 100);
        if (value < 0) {
            this.sat = 0;
        } else if (value > 100) {
            this.sat = 1;
        } else this.sat = value / 100;
    }

    //------------------------------------------------------------
    get l() { return this.lum; }

    set l(value) {
        if (isNaN(value)) return;
        value = Round(value * 100);
        if (value < 0) {
            this.lum = 0;
        } else if (value > 100) {
            this.lum = 1;
        } else this.lum = value / 100;
    }

    //------------------------------------------------------------
    get formatHSL() {
        let H = this.h;
        let S = Round(this.s * 100);
        let L = Round(this.l * 100);
        if (this.a == 1) {
            return `hsl(${H},${S}%,${L}%)`;
        } else {
            return `hsla(${H},${S}%,${L}%,${this.a})`;
        }
    }

    //------------------------------------------------------------
    static mix(color1, color2, bias=0.5, formatColor=true) {
        let c1 = new ColorRGB(0,0,0);
        let c2 = new ColorRGB(0,0,0);
        let mixc = new ColorRGB(0,0,0);
        if (color1 instanceof ColorRGB && color1 instanceof ColorRGB) {
            c1 = color1; c2 = color2;
        } else if (!isHex(color1) || !isHex(color2)) {
            return formatColor ? mixc.formatRGB : mixc;
        } else {
            c1.hex = color1;
            c2.hex = color2;
        }
        let x = c1.toHSL(); let y = c2.toHSL();
        let H; let S; let L;
        H = x.h + Round((y.h - x.h) * bias);
        S = x.s + ((y.s - x.s) * bias);
        L = x.l + ((y.l - x.l) * bias);
        mixc = new ColorHSL(H, S, L);
        return formatColor ? mixc.formatHSL : mixc;//"hsl("+H+","+S+"%,"+L+"%)";
    }
}

//------------------------------------------------------------
window.LinkedColorElement = class {

    constructor(R, G, B, D) {
        this.DiplayElement = D;
        this.alpha = 1;
        R.style.backgroundColor = "#f00";
        R.value = jsrc.math.randint(101);
        G.style.backgroundColor = "#0f0";
        G.value = jsrc.math.randint(101);
        B.style.backgroundColor = "#00f";
        B.value = jsrc.math.randint(101);
        this.ElementR = R;
        this.ElementG = G;
        this.ElementB = B;
        this.Listen(this);
        LinkedColorElement.UpdateColor(this);
    }

    //------------------------------------------------------------
    get r() { return Round((this.ElementR.value / 100)*255); }

    set r(value) { this.ElementR.value = Round((value/255)*100); }

    //------------------------------------------------------------
    get g() { return Round((this.ElementG.value / 100)*255); }

    set g(value) { this.ElementG.value = Round((value/255)*100); }

    //------------------------------------------------------------
    get b() { return Round((this.ElementB.value / 100)*255); }

    set b(value) { this.ElementB.value = Round((value/255)*100); }

    //------------------------------------------------------------
    setDisplayColor(c, t="_default") {
        let x = "";
        if (t != "_default") {
            var re = /[color]/i;
            if (!re.test(t)) return;
            var s = t.split("-");
            for (var i = 0; i < s.length; i++) {
                if (i == 0) { x += s[0]; continue; }
                s[i] = s[i].charAt(0).toUpperCase() + s[i].substr(1);
                x += s[i];
            }
        } else x = "backgroundColor";

        if (c instanceof ColorRGB) {
            this.DiplayElement.style[x] = c.formatRGB;
        } else if (c instanceof ColorHSL) {
            this.DiplayElement.style[x] = c.formatRGB;
        } else {
            this.DiplayElement.style[x] = c;
        }
    }

    //------------------------------------------------------------
    static UpdateColor(e) {
        e.setDisplayColor(e.getColor(false));
    }

    //------------------------------------------------------------
    getColor(format=false) {
        var c = new ColorRGB(this.r,this.g,this.b, this.alpha);
        return format ? c.formatRGB : c;
    }

    //------------------------------------------------------------
    Listen(el) {
        $(this.ElementR).on("input", function() { LinkedColorElement.UpdateColor(el); });
        $(this.ElementG).on("input", function() { LinkedColorElement.UpdateColor(el); });
        $(this.ElementB).on("input", function() { LinkedColorElement.UpdateColor(el); });
    }
}   
   
})();
