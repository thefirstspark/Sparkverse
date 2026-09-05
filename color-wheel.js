/* The real Color Codex wheel — SPARK-CANON v1.3 DL-005.
   Eleven slices. Radiant Number. Spectral names. Amber is not a slice. */
(function () {
  var TIERS = [
    { radiant: "1", name: "Ember", light: "deep red", hex: "#E8593C", dark: false },
    { radiant: "2", name: "Dawn", light: "orange", hex: "#D85A30", dark: false },
    { radiant: "3", name: "Gold Vein", light: "gold", hex: "#F2A623", dark: true },
    { radiant: "4", name: "Verdant Gate", light: "green", hex: "#5DCAA5", dark: true },
    { radiant: "5", name: "Tide Glass", light: "teal", hex: "#1D9E75", dark: false },
    { radiant: "6", name: "Still Water", light: "blue", hex: "#378ADD", dark: false },
    { radiant: "7", name: "Violet Hour", light: "violet", hex: "#7F77DD", dark: false },
    { radiant: "8", name: "Rose Ash", light: "rose", hex: "#D4537E", dark: false },
    { radiant: "9", name: "Pearl Gate", light: "white gold", hex: "#F1EFE8", dark: true },
    { radiant: "11", name: "Moonsilver", light: "silver", hex: "#C4C8D4", dark: true },
    { radiant: "22 · 33", name: "First Light", light: "source", hex: "#FCDE5A", dark: true }
  ];
  window.CANON_COLOR_WHEEL = TIERS;

  window.renderCanonColorWheel = function (mount, opts) {
    opts = opts || {};
    var compact = !!opts.compact;
    var CX = 400, CY = 400, R0 = opts.inner || (compact ? 132 : 118), R1 = opts.outer || (compact ? 292 : 300);
    var N = TIERS.length, step = (2 * Math.PI) / N;
    function P(r, a) {
      a -= Math.PI / 2;
      return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
    }
    function f(n) { return n.toFixed(1); }
    var href = opts.href || "color-wheel.html";
    var s = '<svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Color Codex: eleven lights of the first spark">';
    s += '<circle cx="' + CX + '" cy="' + CY + '" r="' + (R1 + 8) + '" fill="none" stroke="rgba(212,175,55,.28)" stroke-width="1"/>';
    TIERS.forEach(function (t, i) {
      var a0 = i * step, a1 = (i + 1) * step, am = (a0 + a1) / 2;
      var o0 = P(R1, a0), o1 = P(R1, a1), i0 = P(R0, a0), i1 = P(R0, a1);
      var d = "M" + f(i0[0]) + " " + f(i0[1]) + " L" + f(o0[0]) + " " + f(o0[1]) + " A" + R1 + " " + R1 + " 0 0 1 " + f(o1[0]) + " " + f(o1[1]) + " L" + f(i1[0]) + " " + f(i1[1]) + " A" + R0 + " " + R0 + " 0 0 0 " + f(i0[0]) + " " + f(i0[1]) + "Z";
      var ink = t.dark ? "#1a1208" : "#fffaf3";
      var lbl = P((R0 + R1) / 2, am);
      var num = P(R1 + (compact ? 28 : 36), am);
      var short = t.name.split(" ")[0];
      s += '<a href="' + href + '" class="cw-slice"><title>' + t.name + " · Radiant " + t.radiant + " · " + t.light + "</title>";
      s += '<path d="' + d + '" fill="' + t.hex + '" stroke="#050508" stroke-width="3"/>';
      if (!compact) {
        s += '<text x="' + f(lbl[0]) + '" y="' + f(lbl[1] - 6) + '" text-anchor="middle" font-family="Orbitron,sans-serif" font-size="13" font-weight="700" fill="' + ink + '">' + t.name + "</text>";
        s += '<text x="' + f(lbl[0]) + '" y="' + f(lbl[1] + 12) + '" text-anchor="middle" font-family="Space Mono,monospace" font-size="10" fill="' + ink + '" opacity=".75">' + t.light + "</text>";
      } else {
        s += '<text x="' + f(lbl[0]) + '" y="' + f(lbl[1] + 4) + '" text-anchor="middle" font-family="Orbitron,sans-serif" font-size="12" font-weight="700" fill="' + ink + '">' + short + "</text>";
      }
      s += "</a>";
      s += '<text x="' + f(num[0]) + '" y="' + f(num[1] + 4) + '" text-anchor="middle" font-family="Space Mono,monospace" font-size="' + (compact ? "11" : "14") + '" fill="#d4af37">' + t.radiant + "</text>";
    });
    s += '<circle cx="' + CX + '" cy="' + CY + '" r="' + (R0 - 12) + '" fill="#050508" stroke="rgba(212,175,55,.4)"/>';
    s += '<text x="' + CX + '" y="' + (CY - 8) + '" text-anchor="middle" font-family="Orbitron,sans-serif" font-size="13" letter-spacing="4" fill="#d4af37">RADIANT</text>';
    s += '<text x="' + CX + '" y="' + (CY + 14) + '" text-anchor="middle" font-family="Space Mono,monospace" font-size="11" fill="rgba(255,255,255,.5)">Road + Vessel</text>';
    s += "</svg>";
    var el = typeof mount === "string" ? document.querySelector(mount) : mount;
    if (el) el.innerHTML = s;
  };
})();
