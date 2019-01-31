;(() => {
"use strict";

var calcLColor = clr => {
    let u = 1;
    if (clr instanceof ColorRGB) {
        let rr = clr.r / 255, rg = clr.g / 255, rb = clr.b / 255;
        u = (Math.max(rr, rg, rb) + Math.min(rr, rg, rb)) / 2;
    } else if (clr instanceof ColorHSL) {
        u = clr.l;
    }
    return u < 0.47 ? "#fff" : "#000";
}

var initMixColor = (i, rmc, ic, clr) => {
    rmc.rgb = clr;
    ic.value = rmc.getColor().hex;
    $(".color-hex-display.hex-mixer").get(i).innerText = rmc.getColor().hex;
    rmc.updateColor();
}

$("input.R2G").on("input", function() {
    var clr = jsrc.color.redToGreenRatio($(this).val() / 100, false);
    let fc = `rgba(${clr[0]},${clr[1]},${clr[2]},${0.75})`;
    $("div.R2G").css("background-color", fc);
}); var UseHSL = false;

let lst = $("input.rgbMixer.color-1").get();

var mixEl = $("div.rgbMixer.mixerDisplayCenter").get(0);

var rgbMixColor1 = new LinkedColorElement(
    lst[0], lst[1], lst[2],
    $("div.rgbMixer.mixerDisplayLeft").get(0)
); rgbMixColor1.alpha = 0.75;

var rgbMixColor2 = new LinkedColorElement(
    lst[3], lst[4], lst[5],
    $("div.rgbMixer.mixerDisplayRight").get(0)
); rgbMixColor2.alpha = 0.75;

$("input.rgbMixer").on("input", function() {
    let bias = 0, cc = new ColorRGB(0, 0, 0);
    let c1 = new ColorRGB(0,0,0), c2 = new ColorRGB(0,0,0);
    if ($(this).attr("type") == "number") {
        bias = $(this).val();
        if (isNaN(bias)) return;
        else if (bias > 100 || bias < 0) return;
        bias = bias > 100 ? 100 : bias < 0 ? 0 : bias;
        $("input.bias-slider.rgbMixer").val(bias);
    } else if ($(this).attr("class") == "bias-slider rgbMixer") {
        bias = $(this).val();
        $("input.bias-num").val(bias);
    } else bias = $("input.bias-slider.rgbMixer").val();
    if ($(this).attr("type") == "color") {
        cc.hex = $(this).val();
        if ($(this).attr("data-color-id") == "1") {
            rgbMixColor1.rgb = [cc.r, cc.g, cc.b];
            rgbMixColor1.updateColor();
            [c1.hex, c2] = [$(this).val(), rgbMixColor2.getColor()];
        } else {
            rgbMixColor2.rgb = [cc.r, cc.g, cc.b];
            rgbMixColor2.updateColor();
            [c1, c2.hex] = [rgbMixColor1.getColor(), $(this).val()];
        }
    } else [c1, c2] = [rgbMixColor1.getColor(), rgbMixColor2.getColor()];
    
    if (UseHSL) {
        let mixc = ColorHSL.mix(c1, c2, bias/100, false, 0.75);
        
        $(".hslMixer").css({
            "background-color": mixc.formatHSL,
            "color": calcLColor(mixc)
        });//.find("h6");.text();
    }

    for (var [d, i, c] of zip($(".hex-mixer").get(), $("input[type='color']").get(), [c1, c2])) {
        d.style.color = calcLColor(c);
        d.innerText = c.hex;
        i.value = c.hex;
    }
    let mxc =  ColorRGB.mix(c1, c2, bias/100, false, 0.75);
    $("div.mixerDisplayCenter").find("h6").text(mxc.hex).css("color", calcLColor(mxc));
    mixEl.style.backgroundColor = mxc.formatRGB;
});
let [ix, iy] = $("input[type='color']").get();
initMixColor(0, rgbMixColor1, ix, [255, 128, 192]);
initMixColor(1, rgbMixColor2, iy, [255, 128, 0]);

$(".bias-slider").css("width", "300px");
let initmix = ColorRGB.mix(rgbMixColor1.getColor(), rgbMixColor2.getColor(), 0.5, false, 0.75);
$(".mixerDisplayCenter").css({
    "background-color": initmix.formatRGB,
    "height": "87px"
});
$(".rgbMixer.mixerDisplayCenter").find("h6").text(initmix.hex);
$(".hslMixer").css({
    "border-top": "none",
    "border-bottom": "1px solid #444",
    "border-top-left-radius": "1%",
    "border-top-right-radius": "1%",
    "border-bottom-left-radius": "15%",
    "border-bottom-right-radius": "15%",
    "height": "87px"
}).hide();

$(".rgbMixer.mixerDisplayCenter").css("height", "175px");

$("button.rgbMixer").click(function() {
    UseHSL = !UseHSL;
    if (UseHSL) {
        $(this).text("Hide HSL Mix");
        $(".rgbMixer.mixerDisplayCenter").css({
            "height": "87px",
            "border-bottom": "none",
            "border-bottom-left-radius": "1%",
            "border-bottom-right-radius": "1%"
        });
        
        let rgbmix = ColorRGB.mix(
            rgbMixColor1.getColor(), rgbMixColor2.getColor(),
            $(".bias-slider").val() / 100, false, 0.75
        );
        let hslmix = rgbmix.toHSL();
        //$(".hslMixer>h6").text(rgbmix.hex);
        $(".hslMixer").css({
            "background-color": hslmix.formatHSL,
            "color": calcLColor(hslmix)
        }).show().find("h6").text(rgbmix.hex);
    } else {
        $(this).text("Show HSL Mix");
        $(".rgbMixer.mixerDisplayCenter").css({
            "height": "175px",
            "border-bottom": "1px solid #000",
            "border-bottom-left-radius": "15%",
            "border-bottom-right-radius": "15%"
        });
        $("div.hslMixer").hide();
    }
});

})();
