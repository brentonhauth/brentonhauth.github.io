window.Color = class {
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
        var r_ = this.r / 255, g_ = this.g / 255, b_ = this.b / 255, f = 0;
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
        if (!Color.isHex(color1) || !Color.isHex(color2)) return "hsl(0,0%,0%)";
        color1 = new Color(color1);
        color2 = new Color(color2);
        var mixed = new Color();
        mixed.r = color1.r + Math.round((color2.r - color1.r) * bias);
        mixed.g = color1.g + Math.round((color2.g - color1.g) * bias);
        mixed.b = color1.b + Math.round((color2.b - color1.b) * bias);
        mixed.a = 1;
        var H = color1.h, S = color1.s, L = color1.l;
        H += Math.round((color2.h - H) * bias);
        S += Math.round((color2.s - S) * bias);
        L += Math.round((color2.l - L) * bias);
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
