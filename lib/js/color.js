(function() {
window.Color = class {

    constructor(v1, v2, v3) {
        this.values = new Array(3);
        this.values[0] = v1;
        this.values[1] = v2;
        this.values[2] = v3;
    }

    static isHex(str) {
        if (typeof str != "string") return false;
        var re = /[A-Fa-f0-9]{6}/;
        return re.test(str);
    }
};

//--------------------------------------------------------------------------------

window.ColorRGB = class extends Color {

    constructor(R, G, B, a=1) {
        super(R, G, B);
        this.alpha = a;
    }

    //--------------------------------------------------------------------------------
    get r() { return this.values[0]; }

    set r(value) {
        if (isNaN(value)) return;
        value = Math.round(value);
        if (value < 0) {
            this.values[0] = 0;
        } else if (value > 255) {
            this.values[0] = 255;
        } else this.values[0] = value;
    }

    //--------------------------------------------------------------------------------
    get g() { return this.values[1]; }

    set g(value) {
        if (isNaN(value)) return;
        value = Math.round(value);
        if (value < 0) {
            this.values[1] = 0;
        } else if (value > 255) {
            this.values[1] = 255;
        } else this.values[1] = value;
    }

    //--------------------------------------------------------------------------------
    get b() { return this.values[2]; }

    set b(value) {
        if (isNaN(value)) return;
        value = Math.round(value);
        if (value < 0) {
            this.values[2] = 0;
        } else if (value > 255) {
            this.values[2] = 255;
        } else this.values[2] = value;
    }

    //--------------------------------------------------------------------------------
    get a() { return this.alpha; }

    set a(value) {
        if (isNaN(value)) return;
        if (value < 0) {
            this.alpha = 0;
        } else if (value > 1) {
            this.alpha = 1;
        } else this.alpha = value;
    }
    
    //--------------------------------------------------------------------------------
    set hex(str) {
        var re = /[A-Fa-f\d]{6}/;
        if (typeof str != "string") return;
        else if (!re.test(str)) return;
        var h = str.match(re)[0]; var ca = [];
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
    
    //--------------------------------------------------------------------------------
    toHSL() {
        var H = 0; var S = 0; var L = 0;
        var ratR = this.r / 255;
        var ratG = this.g / 255;
        var ratB = this.b / 255;
        var rMin = Math.min(ratR, ratG, ratB);
        var rMax = Math.max(ratR, ratG, ratB);
        L = (rMin + rMax) / 2;
        if ((rMax - rMin) == 0) return new ColorHSL(0,0,L);
        S = (rMax - rMin) / (L < 0.5 ? (rMax + rMin) : (2 - rMax - rMin));//(1 - Math.abs(2 * L - 1));
        if (ratR == rMax) {
            H = (ratG - ratB) / (rMax - rMin);
        } else if (ratG == rMax) {
            H = ((ratB - ratR) / (rMax - rMin)) + 2;
        } else {
            H = ((ratR - ratG) / (rMax - rMin)) + 4;
        }; H *= 60;
        return new ColorHSL(H, S, L);
    }
    
    //--------------------------------------------------------------------------------
    get formatRGB() {
        if (this.a == 1) return "rgb("+this.r+","+this.g+","+this.b+")";
        else return "rgba("+this.r+","+this.g+","+this.b+","+this.a+")";
    }

    //--------------------------------------------------------------------------------
    static mix(color1, color2, bias=0.5, formatColor=true) {
        let c1 = new ColorRGB(0,0,0);
        let c2 = new ColorRGB(0,0,0);
        let mix = new ColorRGB(0,0,0);
        if (color1 instanceof ColorRGB && color1 instanceof ColorRGB) {
            c1 = color1; c2 = color2;
        } else if (!Color.isHex(color1) || !Color.isHex(color2)) {
            return formatColor ? mix.formatRGB : mix;
        } else {
            c1.hex = color1;
            c2.hex = color2;
        }
        mix.r = c1.r + Math.round((c2.r - c1.r) * bias);
        mix.g = c1.g + Math.round((c2.g - c1.g) * bias);
        mix.b = c1.b + Math.round((c2.b - c1.b) * bias);
        return formatColor ? mix.formatRGB : mix;
    }
}

//--------------------------------------------------------------------------------

window.ColorHSL = class extends Color {
    constructor(pH, pS, pL, pA=1) { super(pH, pS, pL); this.a = pA; }

    //--------------------------------------------------------------------------------
    get h() { return this.values[0]; }

    set h(value) {
        if (isNaN(value)) return;
        value = Math.round(value);
        if (value < 0) {
            this.values[0] = 0;
        } else if (value > 360) {
            this.values[0] = 360;
        } else this.values[0] = value;
    }

    //--------------------------------------------------------------------------------
    get s() { return this.values[1]; }

    set s(value) {
        if (isNaN(value)) return;
        value = Math.round(value * 100);
        if (value < 0) {
            this.values[1] = 0;
        } else if (value > 100) {
            this.values[1] = 1;
        } else this.values[1] = value / 100;
    }

    //--------------------------------------------------------------------------------
    get l() { return this.values[2]; }

    set l(value) {
        if (isNaN(value)) return;
        value = Math.round(value * 100);
        if (value < 0) {
            this.values[2] = 0;
        } else if (value > 100) {
            this.values[2] = 1;
        } else this.values[2] = value / 100;
    }

    //--------------------------------------------------------------------------------
    get formatHSL() {
        var H = this.h;
        var S = Math.round(this.s * 100);
        var L = Math.round(this.l * 100);
        if (this.a == 1) {
            return "hsl("+H+","+S+"%,"+L+"%)";
        } else {
            return "hsla("+H+","+S+"%,"+L+"%,"+this.a+")";
        }
    }

    //--------------------------------------------------------------------------------
    static mix(color1, color2, bias=0.5, formatColor=true) {
        let c1 = new ColorRGB(0,0,0);
        let c2 = new ColorRGB(0,0,0);
        let mixc = new ColorRGB(0,0,0);
        if (color1 instanceof ColorRGB && color1 instanceof ColorRGB) {
            c1 = color1; c2 = color2;
        } else if (!Color.isHex(color1) || !Color.isHex(color2)) {
            return formatColor ? mixc.formatRGB : mixc;
        } else {
            c1.hex = color1;
            c2.hex = color2;
        }
        let x = c1.toHSL(); let y = c2.toHSL();
        var H; var S; var L;
        H = x.h + Math.round((y.h - x.h) * bias);
        S = x.s + ((y.s - x.s) * bias);
        L = x.l + ((y.l - x.l) * bias);
        mixc = new ColorHSL(H, S, L);
        return formatColor ? mixc.formatHSL : mixc;//"hsl("+H+","+S+"%,"+L+"%)";
    }
}

//--------------------------------------------------------------------------------
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

    //--------------------------------------------------------------------------------
    get r() { return Math.round((this.ElementR.value / 100)*255); }

    set r(value) { this.ElementR.value = Math.round((value/255)*100); }

    //--------------------------------------------------------------------------------
    get g() { return Math.round((this.ElementG.value / 100)*255); }

    set g(value) { this.ElementG.value = Math.round((value/255)*100); }

    //--------------------------------------------------------------------------------
    get b() { return Math.round((this.ElementB.value / 100)*255); }

    set b(value) { this.ElementB.value = Math.round((value/255)*100); }

    //--------------------------------------------------------------------------------
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
    
    //--------------------------------------------------------------------------------
    static UpdateColor(e) {
        e.setDisplayColor(e.getColor(false));
    }

    //--------------------------------------------------------------------------------
    getColor(format=false) {
        var c = new ColorRGB(this.r,this.g,this.b, this.alpha);
        return format ? c.formatRGB : c;
    }

    //--------------------------------------------------------------------------------
    Listen(el) {
        $(this.ElementR).on("input", function() { LinkedColorElement.UpdateColor(el); });
        $(this.ElementG).on("input", function() { LinkedColorElement.UpdateColor(el); });
        $(this.ElementB).on("input", function() { LinkedColorElement.UpdateColor(el); });
    }
}


})();
