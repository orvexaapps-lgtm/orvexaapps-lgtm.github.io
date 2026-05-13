(function () {
  document.documentElement.classList.add("js-enabled");

  var mobileQuery = window.matchMedia("(max-width: 900px)");
  var headers = document.querySelectorAll(".site-header[data-nav]");

  function findMatchingLink(node, container) {
    while (node && node !== container) {
      if (node.tagName && node.tagName.toLowerCase() === "a") {
        return node;
      }

      node = node.parentElement;
    }

    return null;
  }

  Array.prototype.forEach.call(headers, function (header, index) {
    var button = header.querySelector(".nav-toggle");
    var nav = header.querySelector(".site-nav");

    if (!button || !nav) {
      return;
    }

    var navId = nav.id || "site-nav-" + (index + 1);
    nav.id = navId;
    button.setAttribute("aria-controls", navId);

    function setExpanded(isOpen) {
      var hiddenOnMobile = mobileQuery.matches ? !isOpen : false;

      header.classList.toggle("is-open", isOpen);
      button.setAttribute("aria-expanded", String(isOpen));
      button.setAttribute("aria-haspopup", "menu");
      button.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
      nav.setAttribute("aria-hidden", String(hiddenOnMobile));
    }

    function closeMenu(restoreFocus) {
      if (!header.classList.contains("is-open")) {
        return;
      }

      setExpanded(false);

      if (restoreFocus) {
        button.focus();
      }
    }

    function openMenu() {
      setExpanded(true);
    }

    button.addEventListener("click", function () {
      setExpanded(!header.classList.contains("is-open"));
    });

    button.addEventListener("keydown", function (event) {
      if (!mobileQuery.matches) {
        return;
      }

      if (event.key === "ArrowDown" || event.key === "Down") {
        event.preventDefault();

        if (!header.classList.contains("is-open")) {
          openMenu();
        }

        var firstLink = nav.querySelector("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])");
        if (firstLink) {
          firstLink.focus();
        }
      }
    });

    nav.addEventListener("click", function (event) {
      if (findMatchingLink(event.target, nav)) {
        closeMenu(false);
      }
    });

    document.addEventListener("click", function (event) {
      if (!header.contains(event.target)) {
        closeMenu(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu(true);
      }
    });

    window.addEventListener("scroll", function () {
      if (mobileQuery.matches) {
        closeMenu(false);
      }
    }, { passive: true });

    function syncMenuState() {
      if (!mobileQuery.matches) {
        closeMenu(false);
        nav.setAttribute("aria-hidden", "false");
      } else if (!header.classList.contains("is-open")) {
        nav.setAttribute("aria-hidden", "true");
      }
    }

    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", syncMenuState);
    } else if (typeof mobileQuery.addListener === "function") {
      mobileQuery.addListener(syncMenuState);
    }

    setExpanded(false);
  });
})();
