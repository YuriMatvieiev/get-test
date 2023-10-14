var windw = this;

$.fn.followTo = function (pos) {
  var $this = this,
    $window = $(windw);

  $window.scroll(function (e) {
    if ($window.scrollTop() > pos) {
      $this.css({
        position: "absolute",
        top: pos + 100,
      });
    } else {
      $this.css({
        position: "fixed",

        top: "100px",
      });
    }
  });
};

$("#blogImage").followTo(200);

// SCROLLBAR

$(document).scroll(function (e) {
  var scrollAmount = $(window).scrollTop();
  var documentHeight = $(document).height();
  var windowHeight = $(window).height();
  var scrollPercent = (scrollAmount / (documentHeight - windowHeight)) * 100;

  // For scrollbar
  $(".scrollball").css("width", "calc(" + scrollPercent + "%)");
  // $(".scrollball span").text(number);
});
