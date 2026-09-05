(function () {
  var page = document.body.getAttribute("data-page") || "lobby";
  var items = [
    { id: "lobby", href: "index.html", icon: "◉", label: "Lobby" },
    { id: "studio", href: "studio.html", icon: "♫", label: "Studio" },
    { id: "workshop", href: "workshop.html", icon: "⚒", label: "Workshop" },
    { id: "commons", href: "commons.html", icon: "◎", label: "Commons" },
    { id: "treasury", href: "treasury.html", icon: "◈", label: "Treasury" }
  ];
  var nav = document.createElement("nav");
  nav.className = "lobby-nav";
  nav.setAttribute("aria-label", "Sparkverse rooms");
  nav.innerHTML = items
    .map(function (it) {
      var on = it.id === page ? " active" : "";
      var current = it.id === page ? ' aria-current="page"' : "";
      return (
        '<a class="nav-item' +
        on +
        '" href="' +
        it.href +
        '"' +
        current +
        '><span class="nav-icon" aria-hidden="true">' +
        it.icon +
        "</span><span>" +
        it.label +
        "</span></a>"
      );
    })
    .join("");
  document.body.appendChild(nav);
})();
