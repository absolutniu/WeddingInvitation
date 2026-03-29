// Модальное окно
$(".open-modal").click(function () {
  $(".sm-questionnaire").addClass("sm-open");
  $("body").addClass("lock");
  $("html.animating [data-jsscroll]:not([data-jsscroll_nomob])").css(
    "opacity",
    "1",
  );
});

$(".sm-quest-modal-close").click(function () {
  $(".sm-quest-modal").removeClass("sm-open");
  $("body").removeClass("lock");
});

const wishSliderParams = {
  slidesToShow: 1,
  infinite: true,
  adaptiveHeight: false,
  nextArrow: $("#wishes-navigation .sm-arrow-next"),
  prevArrow: $("#wishes-navigation .sm-arrow-prev"),
};

function onResize() {
  var $s1 = $(".sm-dress-code__slider1");
  if ($s1.length) {
    $s1.slick({
      slidesToShow: 1,
      infinite: true,
      adaptiveHeight: true,
      nextArrow: $s1.parents(".sm-dress-code__box-gallery__item").find(".sm-arrow-next"),
      prevArrow: $s1.parents(".sm-dress-code__box-gallery__item").find(".sm-arrow-prev"),
    });
  }

  var $s2 = $(".sm-dress-code__slider2");
  if ($s2.length) {
    $s2.slick({
      slidesToShow: 1,
      infinite: true,
      adaptiveHeight: true,
      nextArrow: $s2.parents(".sm-dress-code__box-gallery__item").find(".sm-arrow-next"),
      prevArrow: $s2.parents(".sm-dress-code__box-gallery__item").find(".sm-arrow-prev"),
    });
  }
}
//
// $(window).on('resize', function() {
//     onResize();
// });
function startAll() {
  startAllScripts();
  onResize();
}
const forms = document.querySelectorAll(".contact-form");
const thankYouMessage = document.getElementById("thankYouMessage");
const body = document.body;

// Обрабатываем каждую форму
forms.forEach((form) => {
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // предотвращаем отправку формы по умолчанию
    thankYouMessage.classList.add("sm-open"); // показываем сообщение
    body.classList.add("sm-hidde"); // добавляем класс sm-hidde к body
    form.reset(); // очищаем форму
  });
});

// Netlify RSVP (wedding-rsvp): отправляем форму штатно в Netlify,
// а после reload показываем модальное "Спасибо".
const rsvpStorageKey = "sm_rsvp_submitted";
const rsvpForm = document.querySelector('form[name="wedding-rsvp"]');
if (rsvpForm) {
  // Показываем окно, если в предыдущей загрузке форма успешно отправлялась.
  try {
    if (sessionStorage.getItem(rsvpStorageKey) === "1") {
      sessionStorage.removeItem(rsvpStorageKey);
      thankYouMessage && thankYouMessage.classList.add("sm-open");
      body.classList.add("sm-hidde");
    }
  } catch (e) {}

  // Ставим флаг перед реальной отправкой на Netlify.
  rsvpForm.addEventListener("submit", function () {
    try {
      sessionStorage.setItem(rsvpStorageKey, "1");
    } catch (e) {}

    // Открываем модалку сразу, чтобы пользователь увидел результат.
    thankYouMessage && thankYouMessage.classList.add("sm-open");
    body && body.classList.add("sm-hidde");
  });
}

// Закрываем модальное сообщение
$(".sm-modal-close").on("click", function () {
  $(this).closest(".sm-modal.sm-open").removeClass("sm-open");
  $("body").removeClass("lock");
  $(".f-button.is-close-btn").css("display", "none");
});

$(window).on("load", function () {
  setTimeout(function () {
    $(".sm_colors div").each(function (color) {
      if ($(this).css("background") == $(".sm-dress-code").css("background")) {
        $(this).css("border", "solid 1px #262222");
      }
    });
  }, 700);
});
