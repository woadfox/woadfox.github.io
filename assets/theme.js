/* Theme switcher: stamps data-mode / data-scheme / data-grain on <html>
   before first paint (this file is loaded synchronously in <head>),
   persists choices, and wires the three header buttons. External file
   because the site CSP only allows script-src 'self'. */
(function () {
  var MODES = ["dark", "light"];
  var SCHEMES = ["basic", "woad", "pride"];
  var GRAINS = ["off", "on"];
  var root = document.documentElement;

  function stored(key, fallback, allowed) {
    var v = null;
    try { v = localStorage.getItem(key); } catch (e) {}
    return allowed.indexOf(v) >= 0 ? v : fallback;
  }
  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  var mode = stored("wf-mode", "dark", MODES);
  var scheme = stored("wf-scheme", "basic", SCHEMES);
  var grain = stored("wf-grain", "off", GRAINS);
  root.setAttribute("data-mode", mode);
  root.setAttribute("data-scheme", scheme);
  root.setAttribute("data-grain", grain);

  /* Random blob fields for the woad scheme — layered radial gradients with
     random position/size/color, following
     justinjay.wang/methods-for-random-gradients. Regenerated each page
     load and each time the scheme cycles back to woad. Dark mode's art
     reuses the same generator/palette as the light-mode page background.
     Palette: a denim fade — raw indigo through stonewash, no white. */
  var WOAD_DENIM = ["#7B99B0", "#6C9898", "#56ADCF", "#7EC3D2"];
  var WOAD_ACCENT = "#8C9A91";   // the green from colors.txt
  var WOAD_BASE = "#7B99B0";     // solid denim base

  function rand(min, max) { return min + Math.random() * (max - min); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function blob(color) {
    return "radial-gradient(ellipse " + rand(28, 70).toFixed(1) + "% " +
      rand(24, 60).toFixed(1) + "% at " + rand(-10, 110).toFixed(1) + "% " +
      rand(-10, 110).toFixed(1) + "%, " + color + " 0%, transparent 70%)";
  }

  function blobField(blobColors, accent, baseA, baseB) {
    var layers = [];
    var count = Math.round(rand(5, 8));
    for (var i = 0; i < count; i++) { layers.push(blob(pick(blobColors))); }
    /* one guaranteed accent blob, dropped in at a random depth so the green
       always shows up somewhere without swamping the denim */
    layers.splice(Math.floor(Math.random() * (layers.length + 1)), 0, blob(accent));
    layers.push("linear-gradient(" + rand(0, 360).toFixed(0) + "deg, " + baseA + ", " + baseB + ")");
    return layers.join(", ");
  }

  function regenWoad() {
    root.style.setProperty("--woad-blobs-dark",
      blobField(WOAD_DENIM, WOAD_ACCENT, WOAD_BASE, pick(WOAD_DENIM)));
    root.style.setProperty("--woad-blobs-light",
      blobField(WOAD_DENIM, WOAD_ACCENT, WOAD_BASE, pick(WOAD_DENIM)));
  }
  regenWoad();

  function grainLabel() { return grain === "on" ? "grain" : "no grain"; }

  document.addEventListener("DOMContentLoaded", function () {
    var modeBtn = document.getElementById("mode-btn");
    var schemeBtn = document.getElementById("scheme-btn");
    var grainBtn = document.getElementById("grain-btn");

    if (modeBtn) {
      modeBtn.textContent = mode;
      modeBtn.addEventListener("click", function () {
        mode = mode === "dark" ? "light" : "dark";
        root.setAttribute("data-mode", mode);
        store("wf-mode", mode);
        modeBtn.textContent = mode;
      });
    }
    if (schemeBtn) {
      schemeBtn.textContent = scheme;
      schemeBtn.addEventListener("click", function () {
        scheme = SCHEMES[(SCHEMES.indexOf(scheme) + 1) % SCHEMES.length];
        if (scheme === "woad") { regenWoad(); }
        root.setAttribute("data-scheme", scheme);
        store("wf-scheme", scheme);
        schemeBtn.textContent = scheme;
      });
    }
    if (grainBtn) {
      grainBtn.textContent = grainLabel();
      grainBtn.addEventListener("click", function () {
        grain = grain === "on" ? "off" : "on";
        root.setAttribute("data-grain", grain);
        store("wf-grain", grain);
        grainBtn.textContent = grainLabel();
      });
    }
  });
})();
