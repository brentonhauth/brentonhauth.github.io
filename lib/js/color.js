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

window.ColorRGB = class extends Color {
    constructor(R, G, B, a=1) {
        super(R, G, B);
        this.alpha = a;
    }

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
    get a() { return this.alpha; }
    set a(value) {
        if (isNaN(value)) return;
        if (value < 0) {
            this.alpha = 0;
        } else if (value > 1) {
            this.alpha = 1;
        } else this.alpha = value;
    }

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

    toHSL() {
        var H = 0; var S = 0; var L = 0;
        var ratR = this.r / 255;
        var ratG = this.g / 255;
        var ratB = this.b / 255;
        var rMin = Math.min(ratR, ratG, ratB);
        var rMax = Math.max(ratR, ratG, ratB);
        L = (rMin + rMax) / 2;
        if ((rMax - rMin) == 0) return new ColorHSL(0,0,L);
        S = (rMax - rMin) / (1 - Math.abs(2 * L - 1));
        if (ratR == rMax) {
            H = (ratG - ratB) / (rMax - rMin);
        } else if (ratG == rMax) {
            H = ((ratB - ratR) / (rMax - rMin)) + 2;
        } else {
            H = ((ratR - ratG) / (rMax - rMin)) + 4;
        }; H *= 60;
        return new ColorHSL(H, S, L);
    }

    get formatRGB() {
        if (this.a == 1) return "rgb("+this.r+","+this.g+","+this.b+")";
        else return "rgba("+this.r+","+this.g+","+this.b+","+this.a+")";
    }

    static mix(color1, color2, bias=0.5, formatColor=true) {
        if (!Color.isHex(color1) || !Color.isHex(color2)) return "hsl(0,0%,0%)";
        var c1 = new ColorRGB(0,0,0); c1.hex = color1;
        var c2 = new ColorRGB(0,0,0); c2.hex = color2;
        var mix = new ColorRGB(0,0,0);  
        mix.r = c1.r + Math.round((c2.r - c1.r) * bias);
        mix.g = c1.g + Math.round((c2.g - c1.g) * bias);
        mix.b = c1.b + Math.round((c2.b - c1.b) * bias);
        return formatColor ? mix.formatRGB : mix;
    }
};

window.ColorHSL = class extends Color {
    constructor(pH, pS, pL) { super(pH, pS, pL); }
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
    get s() { return this.values[1]; }
    set s(value) {
        if (isNaN(value)) return;
        //value = Math.round(value);
        if (value < 0) {
            this.values[1] = 0;
        } else if (value > 1) {
            this.values[1] = 1;
        } else this.values[1] = value;
    }
    get l() { return this.values[2]; }
    set l(value) {
        if (isNaN(value)) return;
        //value = Math.round(value);
        if (value < 0) {
            this.values[2] = 0;
        } else if (value > 1) {
            this.values[2] = 1;
        } else this.values[2] = value;
    }

    get formatHSL() {
        var H = this.h;
        var S = Math.round(this.s * 100);
        var L = Math.round(this.l * 100);
        return "hsl("+H+","+S+"%,"+L+"%)";
    }

    static mix(color1, color2, bias=0.5) {
        if (!Color.isHex(color1) || !Color.isHex(color2)) return "hsl(0,0%,0%)";
        var c1 = new ColorRGB(0,0,0); c1.hex = color1;
        var c2 = new ColorRGB(0,0,0); c2.hex = color2;
        c1 = c1.toHSL();
        c2 = c2.toHSL();
        var H = c1.h; var S = c1.s; var L = c1.l;
        H = c1.h + Math.round((c2.h - c1.h) * bias);
        S = Math.round((c1.s + ((c2.s - c1.s) * bias))*100);
        L = Math.round((c1.l + ((c2.l - c1.l) * bias))*100);
        var mix = new ColorHSL(H, S, L);
        return "hsl("+H+","+S+"%,"+L+"%)";
    }
}

window.Color1 = class {
    get r() { return this._r; }
    set r(value) {
        if (isNaN(value)) return;
        value = Math.round(value);
        this._r = value < 0 ? 0 : (value > 255 ? 255 : value);
    }
    get g() { return this._g; }

    set g(value) {
        if (isNaN(value)) return;
        value = Math.round(value);
        this._g = value < 0 ? 0 : (value > 255 ? 255 : value);
    }
    get b() { return this._b; }

    set b(value) {
        if (isNaN(value)) return;
        value = Math.round(value);
        this._b = value < 0 ? 0 : (value > 255 ? 255 : value);
    }
    get a() { return this._a; }

    set a(value) {
        if (isNaN(value)) return;
        this._a = value < 0 ? 0 : (value > 1 ? 1 : value);
    }

    get h() {
        var r_ = this.r / 255; var g_ = this.g / 255;
        var b_ = this.b / 255; var f = 0;
        if (r_ > g_ && r_ > b_) {
            if (r_ == 0) return 0;
            f = (g_ - b_) / (r_ - Math.min(g_, b_));
        } else if (g_ > b_) {
            if (g_ == 0) return 0;
            f = 2 + ((b_ - r_) / (g_ - Math.min(b_, r_)));
        } else {
            if (b_ == 0) return 0;
            f = 4 + ((r_ - g_) / (b_ - Math.min(r_, g_)));
        }
        return Math.round(f * 60);
    }
    get s() {
        var min = Math.min(this.r, Math.min(this.g, this.b)) / 255;
        var max = Math.max(this.r, Math.max(this.g, this.b)) / 255;
        if (min == 0 && max == 0) return 0;
        return Math.round(100*(this.l < 50 ? (max-min)/(max+min) : (max-min)/(2.0-max-min)));
    }

    get l() {
        var min = Math.min(this.r, Math.min(this.g, this.b)) / 255;
        var max = Math.max(this.r, Math.max(this.g, this.b)) / 255;
        return Math.round((max + min) * 50);
    }

    constructor(hex) {
        if (!Color.isHex(hex)) return;
        var h = hex.match(/[A-Fa-f\d]{6}/)[0], ca = [];
        for (var i = 0; i < 3; i++) { ca.push(h.substr(i*2, 2)); }
        this.r = parseInt(ca[0], 16);
        this.g = parseInt(ca[1], 16);
        this.b = parseInt(ca[2], 16);
        this.a = 0.5;
    }

    static isHex(str) {
        if (typeof str != "string") return false;
        var re = /[A-Fa-f0-9]{6}/;
        return re.test(str);
    }

    static mix(color1, color2, bias=0.5) {
        if (!Color1.isHex(color1) || !Color1.isHex(color2)) return "hsl(0,0%,0%)";
        var c1 = new ColorRGB(0,0,0); c1.hex = color1;
        var c2 = new ColorRGB(0,0,0); c2.hex = color2;
        c1 = c1.toHSL();
        c2 = c2.toHSL();
        var H = c1.h; var S = c1.s; var L = c1.l;


        H = c1.h + Math.round((c2.h - c1.h) * bias);
        S = Math.round((c1.s + ((c2.s - c1.s) * bias))*100);
        L = Math.round((c1.l + ((c2.l - c1.l) * bias))*100);
        return "hsl("+H+","+S+"%,"+L+"%)";
    }

    get formatted() {
        return this._a != 1 ? "rgba("+this.r+","+this.g+","+this.b+","+this.a+")" :
        "rgb("+this._r+","+this.g+","+this.b+")";
    }

    get rgb() {
        return "rgb("+this.r+", "+this.g+", "+this.b+")";
    }

    get rgba() {
        return "rgba("+this.r+", "+this.g+", "+this.b+", "+this.a+")";
    }

    get hsl() {
        return "hsl("+this.h+", "+this.s+"%, "+this.l+"%)";
    }
}

function mixColor(color1, color2, bias=0.5) {
    var hexRe = /[A-Fa-f0-9]{6}/;
    if (hexRe.test(color1) && hexRe.test(color2)) {
        H3.innerHTML = "1: "+color1.match(hexRe) +", 2: "+color2.match(hexRe);
        var c1 = { "r": 0, "g": 0, "b": 0 };
        var c2 = { "r": 0, "g": 0, "b": 0 };
        color1 = color1.match(/[A-Fa-f\d]{6}/)[0];
        color2 = color2.match(/[A-Fa-f\d]{6}/)[0];
        //if (color1.charAt(0) == "#") color1.substr(1);
        //if (color2.charAt(0) == "#") color2.substr(1);
        var cc1 = [], cc2 = [];
        for (var i = 0; i < 3; i++) {
            cc1.push(color1.substr(i*2, 2));
            cc2.push(color2.substr(i*2, 2));
        }
        c1.r = parseInt(cc1[0], 16); c2.r = parseInt(cc2[0], 16);
        c1.g = parseInt(cc1[1], 16); c2.g = parseInt(cc2[1], 16);
        c1.b = parseInt(cc1[2], 16); c2.b = parseInt(cc2[2], 16);
        //alert(c1.r+", "+c1.g+", "+c1.b);
        //alert(c2.r+", "+c2.g+", "+c2.b);
        var mix = { "r": 0, "g": 0, "b": 0 };
        // c1r = 50, c2r = 255 ::   205
        mix.r = c1.r + Math.round((c2.r - c1.r) * bias);
        mix.g = c1.g + Math.round((c2.g - c1.g) * bias);
        mix.b = c1.b + Math.round((c2.b - c1.b) * bias);
        return "rgb("+mix.r+", "+mix.g+", "+mix.b+")";
    }
}
