(function() {
    "use strick";

    $("input.R2G").on("input", function() {
        var clr = jsrc.color.redToGreenRatio($(this).val() / 100, false);
        let fc = "rgba("+clr[0]+","+clr[1]+","+clr[2]+","+0.75+")";
        $("div.R2G").css("background-color", fc);
    }); var UseHSL = false;

    function checkBrightness(R, G, B) {
        R /= 255; G /= 255; B /= 255;
        var x = Math.max(R,G,B) + Math.min(R,G,B);
        return x / 2;
    }

    let lst = $("input.rgbMixer.color-1").get();

    var rgbMixColor1 = new LinkedColorElement(
        lst[0], lst[1], lst[2],
        $("div.rgbMixer.mixerDisplayLeft").get(0)
    ); rgbMixColor1.alpha = 0.75;

    var rgbMixColor2 = new LinkedColorElement(
        lst[3], lst[4], lst[5],
        $("div.rgbMixer.mixerDisplayRight").get(0)
    ); rgbMixColor2.alpha = 0.75;

    $("input.rgbMixer").on("input", function() {
        var mixEl = $("div.rgbMixer.mixerDisplayCenter").get(0);
        var bias = 0; var c1, c2;
        if ($(this).attr("type") == "number") {
            bias = $(this).val();
            bias = bias > 100 ? 100 : bias < 0 ? 0 : bias;
            $("input.bias-slider.rgbMixer").val(bias);
        } else if ($(this).attr("class") == "bias-slider rgbMixer") {
            bias = $(this).val();
            $("input.bias-num.rgbMixer").val(bias);
        } else bias = $("input.bias-slider.rgbMixer").val();
        if ($(this).attr("type") == "color") {
            if ($(this).attr("data-color-id") == "1") {
                var cc = new ColorRGB(0,0,0, rgbMixColor1.alpha);
                cc.hex = $(this).val();
                rgbMixColor1.r = cc.r;
                rgbMixColor1.g = cc.g;
                rgbMixColor1.b = cc.b;
                rgbMixColor1.alpha = cc.a;
                LinkedColorElement.UpdateColor(rgbMixColor1);
                c1 = $(this).val();
                c2 = rgbMixColor2.getColor().hex;
            } else {
                var cc = new ColorRGB(0,0,0, rgbMixColor2.alpha);
                cc.hex = $(this).val();
                rgbMixColor2.r = cc.r;
                rgbMixColor2.g = cc.g;
                rgbMixColor2.b = cc.b;
                rgbMixColor2.alpha = cc.a;
                LinkedColorElement.UpdateColor(rgbMixColor2);
                c1 = rgbMixColor1.getColor().hex;
                c2 = $(this).val();
            }
        } else {
            c1 = rgbMixColor1.getColor();
            c2 = rgbMixColor2.getColor();
        }
        if (UseHSL) {
            var mixc = ColorHSL.mix(c1, c2, bias/100, false); mixc.a = 0.75;
            $(".hslMixer").get(0).style.backgroundColor = mixc.formatHSL;
        }

        mix = ColorRGB.mix(c1, c2, bias/100, false); mix.a = 0.75;
        mixEl.style.backgroundColor = mix.formatRGB;
    });

    rgbMixColor1.r = 255;
    rgbMixColor1.g = 128;
    rgbMixColor1.b = 192;
    LinkedColorElement.UpdateColor(rgbMixColor1);
    rgbMixColor2.r = 255;
    rgbMixColor2.g = 128;
    rgbMixColor2.b = 0;
    LinkedColorElement.UpdateColor(rgbMixColor2);

    $(".mixerDisplayCenter1, .bias-slider").css("width","300px");
    var c = ColorRGB.mix(rgbMixColor1.getColor(), rgbMixColor2.getColor(), 0.5, false); c.alpha = 0.75;
    a3 = $(".rgbMixer.mixerDisplayCenter");
    a3.get(0).style.backgroundColor = c.formatRGB;
    $(".mixerDisplayCenter").css("height", "87px");
    $("div.hslMixer").css({
        "border-top": "none",
        "border-bottom": "1px solid #444",
        "border-top-left-radius": "1%",
        "border-top-right-radius": "1%",
        "border-bottom-left-radius": "15%",
        "border-bottom-right-radius": "15%"

    });

    $("div.hslMixer").hide();
    $(".rgbMixer.mixerDisplayCenter").css("height", "175px");

    $("button.rgbMixer").on("click", function() {
        UseHSL = !UseHSL;
        if (UseHSL) {
            $(this).text("Hide HSL Mix");
            $(".rgbMixer.mixerDisplayCenter").css({
                "height": "87px",
                "border-bottom": "none",
                "border-bottom-left-radius": "1%",
                "border-bottom-right-radius": "1%"
            });
            $("div.hslMixer").show();
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
