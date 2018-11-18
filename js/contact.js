//$("input, textarea").addClass("contactField");
//var inputFields = $("input");
/*(function() { "use strict";

function getFormElements() {
    var formEls = [];
    for (const f of document.querySelectorAll("input.contact")) {
        formEls.push(f);
    }
    formEls.push(document.getElementsByName("contactMessage")[0]);
    return formEls;
}

let newBtn = document.createElement("button");
let subbtn = document.querySelectorAll("input.button-style1")[0];
newBtn.appendChild(document.createTextNode("Send"));
newBtn.className = "button-style1";
newBtn.setAttribute("onclick", "submitForm()");
document.getElementsByTagName("form")[0].removeChild(subbtn);
document.querySelectorAll("div.contact")[0].appendChild(newBtn);

window.submitForm = function() {
    var canSend = true;
    var emailChecked = false;
    for (const elem of getFormElements()) {
        if (elem.value == "") {
            elem.style.backgroundColor = "var(--error-color)";
            elem.title = "Cannot leave field blank";
            if (canSend) {
                setTimeout(function() {
                    for (const j of getFormElements()) {
                        setTimeout(function() {
                            j.style.backgroundColor = "white";
                            j.title = "";
                        }, 100);
                    }
                }, 45000);  // 45 second delay
                canSend = false;
            }
        } else if (elem.type == "email") {
            for (const c of charArray(elem.value)) {
                if (c == "@") {
                    emailChecked = true;
                    break;
                }
            }
        }
    }
    if (canSend) {
        if (emailChecked) {
            for (const elem of getFormElements()) {
                elem.value = sanitize(elem.value);
            }
            document.querySelectorAll("form.contact")[0].submit();
        } else {
            for (const elem of getFormElements()) {
                if (elem.type == "email") {
                    elem.style.backgroundColor = "var(--error-color)";
                    break;
                }
            }
        }
    }
    setTimeout(function() { newBtn.blur(); }, 500);  // half second delay
}

for (const inputElement of getFormElements()) {
    inputElement.addEventListener("input", function() {
        if (inputElement.style.backgroundColor != "white") {
            setTimeout(function() {
                inputElement.style.backgroundColor = "white";
                inputElement.title = "";
            }, 100);  // 0.1 second delay
        }
    });
}

})();
*/