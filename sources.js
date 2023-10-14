// DEMO POP UP
var loading = false;

const mobileMenu = document.getElementById("mobileMenu");
const burger = document.getElementById("burgerMenu");
burger.addEventListener("click", function () {
  burger.classList.toggle("active");
  mobileMenu.classList.toggle("active");
});
mobileMenu.addEventListener("click", function () {
  mobileMenu.classList.remove("active");
  burger.classList.remove("active");
});

const HOST = "https://app.getplace.io";

// const requestDemoBtn = document.getElementsByClassName("requestDemoButton");
const demoPopUpBg = document.getElementById("getInTouchWrapper");
const demoPopUpClose = document.getElementById("gitClose");
const bg = document.getElementById("gitBg");

/*
Array.from(requestDemoBtn).forEach((element) => {
  element.addEventListener("click", () => {
    demoPopUpBg.classList.toggle("active");
    bg.classList.toggle("active");
  });
});*/

demoPopUpClose.addEventListener("click", () => {
  demoPopUpBg.classList.remove("active");
  bg.classList.remove("active");
});
const demoPopUp = document.getElementById("demoPopUp");

bg.addEventListener("click", (event) => {
  let isClickInside = demoPopUpBg.contains(event.target);

  if (!isClickInside) {
    demoPopUpBg.classList.remove("active");
    bg.classList.remove("active");
  }
});

function ValidateEmail(value) {
  const email_filter = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return email_filter.test(value);
}

let sendContactErrs = new Errors(["first_name", "last_name", "email", "company"], "sendcontact-errs");

function sendContact() {
  let first_name = document.getElementById('first_name');
  let last_name = document.getElementById('last_name');
  let email = document.getElementById('email');
  let company = document.getElementById('company');

  let dta = {};

  sendContactErrs.Clear();
  sendContactErrs.HideError();

  dta.first_name = first_name?.value;
  dta.last_name = last_name?.value;
  dta.email = email?.value;
  dta.company = company?.value;

  let errors = [];
  if (dta.first_name === undefined || dta.first_name.length < 2) {
    errors.push(first_name.getAttribute("id"));
  }
  if (dta.last_name === undefined || dta.last_name.length < 2) {
    errors.push(last_name.getAttribute("id"));
  }
  if (dta.email === undefined || !ValidateEmail(dta.email)) {
    errors.push(email.getAttribute("id"));
  }
  if (dta.company === undefined || dta.company.length < 2) {
    errors.push(company.getAttribute("id"));
  }

  if (errors.length === 0) {
    if (loading) {
      return;
    }
    loading = true;
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4) {
        loading = false;
        if (xhttp.status === 200) {
          try {
            let resp = JSON.parse(xhttp.response);
            if (resp?.status === 'ok') {
              console.log(resp);
              document.getElementById('gitFormTitle').style.display = "none";
              document.getElementById('gitForm').style.display = "none";
              document.getElementById('contact-form-sent').style.display = "block";
            } else {
              sendContactErrs.ShowError("Unexpected error")
            }
          } catch (e) {

          }
        } else {
          sendContactErrs.ShowError("Unexpected error")
        }

      }
    }

    xhttp.open("POST", HOST + "/auth/contact-form", true);
    xhttp.send(JSON.stringify(dta));
  } else {
    sendContactErrs.Highlight(errors);
  }
}
