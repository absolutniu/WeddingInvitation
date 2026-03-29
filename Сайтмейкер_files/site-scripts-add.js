let isThrottled = false;
function checkVisibilityEr(element, callback, offset = 0) {
  const rect = element.getBoundingClientRect();
  const isVisible =
    rect.top <= window.innerHeight + offset && rect.bottom >= 0 - offset;
  if (isVisible) callback();
}

$(function () {
  handleScroller();
  // Run again after layout settles (images/fonts/paint) to avoid
  // first-pass wrong intersections on mobile Safari/Firefox.
  requestAnimationFrame(function () {
    handleScroller();
  });
  window.setTimeout(function () {
    handleScroller();
  }, 250);
  window.setTimeout(function () {
    handleScroller();
  }, 900);

  if (document.fonts && typeof document.fonts.ready !== "undefined") {
    document.fonts.ready.then(function () {
      handleScroller();
    });
  }

  window.addEventListener(
    "load",
    function () {
      handleScroller();
      window.setTimeout(function () {
        handleScroller();
      }, 250);
    },
    { once: true },
  );

  setTimeout(function () {
    var checkIntro = setInterval(function () {
      if (!$("body").hasClass("opener-active")) {
        handleScroller();
        clearInterval(checkIntro);
      }
    }, 500);
  }, 1000);

  // Fallback timer (if StartCountDown from templates doesn't tick for any reason)
  // Shows correct countdown values in #days/#hours/#minutes/#seconds.
  if (!window.__smCountdownFallbackStarted) {
    const $days = $("#days");
    const $hours = $("#hours");
    const $minutes = $("#minutes");
    const $seconds = $("#seconds");
    if ($days.length && $hours.length && $minutes.length && $seconds.length) {
      window.__smCountdownFallbackStarted = true;

      function parseDDate(d) {
        if (!d || typeof d !== "string") return null;
        const parts = d.split(".");
        if (parts.length < 3) return null;
        const day = Number(parts[0]);
        const month = Number(parts[1]);
        const year = Number(parts[2]);
        if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) return null;
        return { year, month, day };
      }

      const srcDDate =
        window.d_mdate ||
        (typeof parent !== "undefined" && parent && parent.d_mdate ? parent.d_mdate : "");
      const parsed = parseDDate(srcDDate);
      if (parsed) {
        const targetMs = new Date(parsed.year, parsed.month - 1, parsed.day, 16, 30, 0).getTime();

        function calcage(secs, num1, num2) {
          let s = (Math.floor(secs / num1) % num2).toString();
          if (s.length < 2) s = "0" + s;
          return s;
        }

        function updateOnce() {
          const secs = Math.max(0, Math.floor((targetMs - Date.now()) / 1000));

          const timeArr = {
            days: calcage(secs, 86400, 100000).split(""),
            hours: calcage(secs, 3600, 24).split(""),
            minutes: calcage(secs, 60, 60).split(""),
            seconds: calcage(secs, 1, 60).split(""),
          };

          ["days", "hours", "minutes", "seconds"].forEach(function (key) {
            const holder = $("#" + key);
            if (!holder.length) return;

            const chars = timeArr[key];
            const boxes = holder.find("> .sm-timer-time_number");
            if (!boxes.length) {
              holder.text(chars.join(""));
              return;
            }

            boxes.each(function (index) {
              const $box = $(this);
              const $span = $box.find(".sm-timer-time_number-span").first();
              if (index < chars.length) {
                $span.text(chars[index]);
                $box.show();
              } else {
                $span.text("");
                $box.hide();
              }
            });
          });

          return secs > 0;
        }

        // Tick aligned close enough for UI purposes.
        (function tick() {
          const shouldContinue = updateOnce();
          if (shouldContinue) {
            window.setTimeout(tick, 1000);
          }
        })();
      }
    }
  }
});
window.addEventListener("scroll", () => {
  if (!isThrottled) {
    handleScroller();
    isThrottled = true;
    setTimeout(() => {
      isThrottled = false;
    }, 100);
  }
});

window.addEventListener("scroll", () => {
  document.querySelectorAll(".sm-email-back.back-2").forEach((item) => {
    if (
      document.documentElement.clientHeight / 2 -
        document.documentElement.clientHeight / 4 <
        item.getBoundingClientRect().top &&
      document.documentElement.clientHeight / 2 >
        item.getBoundingClientRect().top
    ) {
      item.style.top =
        (item.getBoundingClientRect().top -
          (document.documentElement.clientHeight / 2 -
            document.documentElement.clientHeight / 4)) *
          (80 / (document.documentElement.clientHeight / 4)) +
        "px";
    } else {
      $(".item-animation_new:not(.item-active)").toggleClass(
        "item-active",
        true,
      );
    }
  });
});
window.addEventListener("resize", () => {
  if (!isThrottled) {
    handleScroller();

    isThrottled = true;
    setTimeout(() => {
      isThrottled = false;
    }, 100);
  }
});

function handleScroller() {
  if (!$("body").hasClass("opener-active")) {
    document.querySelectorAll(".item-animation").forEach((el) => {
      checkVisibilityEr(el, () => {
        el.classList.add("item-active");
      });
    });
  }
}

$(".sm-form_checkbox_box").on("click", function () {
  const $radio = $(this).prev(".sm-form_checkbox_input");
  if ($radio.attr("type") === "radio") {
    $radio.prop("checked", true);
  } else if ($radio.attr("type") === "checkbox") {
    $radio.prop("checked", !$radio.prop("checked"));
  }
});

(function initCalendarHeartReveal() {
  var table = document.querySelector(".sm-datetime .sm-date-table");
  if (!table) {
    return;
  }

  function revealHeart() {
    table.classList.add("sm-heart-in-view");
  }

  function replayHeartOnHover() {
    var finePointer = window.matchMedia("(hover: hover)").matches;
    var desktop = window.matchMedia("(min-width: 501px)").matches;
    if (!finePointer || !desktop) {
      return;
    }
    if (!table.classList.contains("sm-heart-in-view")) {
      revealHeart();
      return;
    }
    table.classList.remove("sm-heart-in-view");
    void table.offsetWidth;
    table.classList.add("sm-heart-in-view");
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealHeart();
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }
        revealHeart();
        io.unobserve(table);
      });
    },
    { threshold: 0.22, rootMargin: "0px 0px -6% 0px" },
  );
  io.observe(table);
  table.addEventListener("mouseenter", replayHeartOnHover);
})();
