// BURGER MENU

const HOST = "https://app.getplace.io";

const mobileMenu = document.getElementById("mobileMenu");
const burger = document.getElementById("burgerMenu");
burger.addEventListener("click", function () {
  burger.classList.toggle("active");
  mobileMenu.classList.toggle("active");
});
mobileMenu.querySelectorAll("a, button").forEach((element) => {
  element.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    burger.classList.remove("active");
  });
});

//Mobile drop drowns

const mobileLis = document.getElementsByClassName("mobile-li");
Array.from(mobileLis).forEach((element) => {
  element.addEventListener("click", () => {
    element.childNodes[3].classList.toggle("active");
    Array.from(mobileLis).map((item) => {
      if (item !== element) {
        item.childNodes[3].classList.remove("active");
        item.childNodes[1].childNodes[1].style.transform = "rotate(0deg)";
        item.childNodes[1].classList.remove("bold");
      }
    });
    if (element.childNodes[3].classList.contains("active")) {
      element.childNodes[1].childNodes[1].style.transform = "rotate(-180deg)";
      element.childNodes[1].classList.add("bold");
    } else {
      element.childNodes[1].childNodes[1].style.transform = "rotate(0deg)";
      element.childNodes[1].classList.remove("bold");
    }
  });
});
