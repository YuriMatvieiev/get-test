//POPUP
const HOST = "https://app.getplace.io";

const unlimited = document.getElementById("unlimited");
const popUpText = document.getElementById("popUpText");
const popUpSubmit = document.getElementById("popUpSubmit");
const popUpBg = document.getElementById("popUpBg");
const popUpClose = document.getElementById("popUpClose");
const contactSubmit = document.getElementById("contactSubmit");
const getFreeAccess1 = document.getElementById("getFreeAccess1");
const getFreeAccess2 = document.getElementById("getFreeAccess2");
const getFreeAccess3 = document.getElementById("getFreeAccess3");

let selectedPlan = 0;

const planFullSub = 1;
const planUnlimitedReports = 2;

popUpClose.addEventListener("click", function () {
  popUpBg.classList.remove("active");
});

const popUp = document.getElementById("popUp");

popUpBg.addEventListener("click", (event) => {
  let isClickInside = popUp.contains(event.target);

  if (!isClickInside) {
    popUpBg.classList.remove("active");
  }
});

//ACCESS POP UP

const getAccessBtn = document.getElementsByClassName("requestAccess");
const accessBg = document.getElementById("access-bg");
const accessClose = document.getElementById("access-close");

Array.from(getAccessBtn).forEach((element) => {
  element.addEventListener("click", () => {
    accessBg.classList.toggle("active");
  });
});
accessClose.addEventListener("click", function () {
  accessBg.classList.remove("active");
});

const accessPopUp = document.getElementById("access-pu");

accessBg.addEventListener("click", (event) => {
  let isClickInside = accessPopUp.contains(event.target);

  if (!isClickInside) {
    accessBg.classList.remove("active");
  }
});

// DEMO POP UP
var loading = false;

// const requestDemoBtn = document.getElementsByClassName("requestDemoButton");
// const demoPopUpBg = document.getElementById("demo-popup-bg");
// const demoPopUpClose = document.getElementById("demo-close");

// Array.from(requestDemoBtn).forEach((element) => {
//   element.addEventListener("click", () => {
//     demoPopUpBg.classList.toggle("active");
//   });
// });

// demoPopUpClose.addEventListener("click", () => {
//   demoPopUpBg.classList.remove("active");
// });
// const demoPopUp = document.getElementById("demo-popup");

// demoPopUpBg.addEventListener("click", (event) => {
//   let isClickInside = demoPopUp.contains(event.target);

//   if (!isClickInside) {
//     demoPopUpBg.classList.remove("active");
//   }
// });

// Send contact form
function ValidateEmail(value) {
  const email_filter =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return email_filter.test(value);
}

contactSubmit.addEventListener("click", (event) => {
  event.preventDefault();
  sendContact();
});

let SendContact = new Errors(["fName", "bEmail" /*, "cName"*/], "sform-err");
function sendContact() {
  let first_name = document.getElementById("fName");
  let email = document.getElementById("bEmail");
  // let company = document.getElementById("cName");
  let company = { value: "N/A" };

  let dta = {};

  SendContact.Clear();
  SendContact.HideError();

  dta.first_name = first_name?.value;
  dta.last_name = "N/A";
  dta.email = email?.value;
  dta.company = company?.value;

  let errors = [];
  if (dta.first_name === undefined || dta.first_name.length < 2) {
    errors.push(first_name.getAttribute("id"));
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
            if (resp?.status === "ok") {
              console.log(resp);
              document.getElementById("demoPopUpForm").style.display = "none";
              document.getElementById("demoPopUpText").style.display = "none";
              document.getElementById("demoPopUpSent").style.display = "block";
            }
          } catch (e) {}
        } else {
          SendContact.ShowError("Unexpected error");
        }
      }
    };

    xhttp.open("POST", HOST + "/auth/contact-form", true);
    xhttp.send(JSON.stringify(dta));
  } else {
    SendContact.Highlight(errors);
  }
}

// send Buy form
popUpSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  sendFormBuy();
});
let SendFormBuy = new Errors(
  ["_fName", "_cName", "_password", "_bEmail"],
  "sfb"
);

function sendFormBuy() {
  let full_name = document.getElementById("_fName");
  let company = document.getElementById("_cName");
  let password = document.getElementById("_password");
  let email = document.getElementById("_bEmail");

  SendFormBuy.Clear();
  SendFormBuy.HideError();

  let errors = [];
  if (!full_name || full_name.value.length < 2) {
    //full_name.classList.add("error");
    //errors = true;
    errors.push(full_name.getAttribute("id"));
  }
  if (!company || company.value.length < 2) {
    //company.classList.add("error");
    //errors = true;
    errors.push(company.getAttribute("id"));
  }
  if (!password || password.value.length < 6) {
    errors.push(password.getAttribute("id"));
  }
  if (!email || !ValidateEmail(email.value)) {
    errors.push(email.getAttribute("id"));
  }

  if (errors.length === 0) {
    data = {
      name: full_name.value,
      company: company.value,
      password: password.value,
      email: email.value,
      payment_opt: selectedPlan * 1,
    };

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4) {
        try {
          console.log(xhttp.status);
          if (xhttp.status === 200) {
            let resp = JSON.parse(xhttp.response);
            if (resp?.status === "ok") {
              console.log(JSON.stringify(resp));
              if (selectedPlan === 0) {
                // heatmap
                window.location.href =
                  "https://buy.stripe.com/6oE8yp7c53Nd0ZWbIR?client_reference_id=" +
                  resp.payment_ses;
              } else if (selectedPlan === 1) {
                // heatmap + reports
                window.location.href =
                  "https://buy.stripe.com/7sI9Ct3ZTcjJ6kg14e?client_reference_id=" +
                  resp.payment_ses;
              } else {
                window.location.href =
                  "https://buy.stripe.com/cN29Ctaoh83t7ok008?client_reference_id=" +
                  resp.payment_ses;
              }
              // https://app.getplace.io/login/stripe?sess={CHECKOUT_SESSION_ID}
            } else {
              let msg = "Unexpected error";
              if (resp?.errors.indexOf("used:email") >= 0) {
                msg = "Email already in use";
                SendFormBuy.Highlight([email.getAttribute("id")]);
              }
              SendFormBuy.ShowError(msg);
            }
          } else {
            SendFormBuy.ShowError("Unexpected error");
          }
        } catch (e) {}
      }
    };

    xhttp.open("POST", HOST + "/auth/register", true);
    xhttp.send(JSON.stringify(data));
  } else {
    SendFormBuy.Highlight(errors);
  }
}

/*
function InitSendFormBuy() {
  let full_name = document.getElementById('_fName');
  let company = document.getElementById('_cName');
  let password = document.getElementById('_password');
  let email = document.getElementById('_bEmail');

  full_name.addEventListener('focus', function (e) {
    e.target.classList.remove("error");
  })

  password.addEventListener('focus', function (e) {
    e.target.classList.remove("error");
  })

  email.addEventListener('focus', function (e) {
    e.target.classList.remove("error");
  })

  company.addEventListener('focus', function (e) {
    e.target.classList.remove("error");
  })
}*/

//InitSendFormBuy();

let freeAccessEmail1 = new Errors(["getFreeAccessEmail1"]);
let freeAccessEmail2 = new Errors(["getFreeAccessEmail2"]);
let freeAccessEmail3 = new Errors(["getFreeAccessEmail3"]);

// get free access with email
getFreeAccess1.addEventListener("click", (e) => {
  e.preventDefault();
  getFreeAccess("getFreeAccessEmail1", freeAccessEmail1);
});

getFreeAccess2.addEventListener("click", (e) => {
  e.preventDefault();
  getFreeAccess("getFreeAccessEmail2", freeAccessEmail2);
});

getFreeAccess3.addEventListener("click", (e) => {
  e.preventDefault();
  getFreeAccess("getFreeAccessEmail3", freeAccessEmail3);
});

function getFreeAccess(emailId, errHandler) {
  let email = document.getElementById(emailId);

  errHandler.Clear();

  let data = { payment_opt: -1 };
  data.email = email?.value;
  let errors = [];

  if (data.email === undefined || !ValidateEmail(data.email)) {
    errors.push(emailId);
  }

  if (errors.length === 0) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
          try {
            let resp = JSON.parse(xhttp.response);
            if (resp?.status === "ok") {
              console.log(JSON.stringify(resp));
              window.location.href =
                HOST + "/login/stripe?sess=" + resp.payment_ses + "&welcome=1";
            } else {
              let msg = "Unexpected error";
              if (resp?.errors.indexOf("used:email") >= 0) {
                msg = "Email already in use";
                errHandler.Highlight([email.getAttribute("id")]);
              }

              errHandler.Highlight([emailId]);
              errHandler.ShowSnack(msg);
            }
          } catch (e) {}
        } else {
          errHandler.ShowSnack("Unexpected error");
        }
      }
    };

    xhttp.open("POST", HOST + "/auth/register", true);
    xhttp.send(JSON.stringify(data));
  } else {
    errHandler.Highlight(errors);
  }
}

const cookieConsentBannerElement = document.querySelector(
  "cookie-consent-banner"
);

cookieConsentBannerElement.availableCategories = [
  {
    description:
      "Enable you to navigate and use the basic functions and to store preferences.",
    key: "technically_required",
    label: "Technically necessary cookies",
    isMandatory: true,
  },
  {
    description:
      "Enable us to determine how visitors interact with our service in order to improve the user experience.",
    key: "analytics",
    label: "Analysis cookies",
  },
];
let slidesCnt = document.getElementsByClassName("swiper-slide").length;
if (slidesCnt > 1) {
  Array.from(document.getElementsByClassName("swiper-button-next")).forEach(
    (element) => {
      element.style.visibility = "visible";
    }
  );
  Array.from(document.getElementsByClassName("swiper-button-prev")).forEach(
    (element) => {
      element.style.visibility = "visible";
    }
  );
}
var reviewsSwiper = new Swiper(".reviewsSwiper", {
  slidesPerView: 1,
  spaceBetween: 100,
  initialSlide: 1,
  centeredSlides: false,
  loop: false,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
    enabled: true,
  },
  pagination: {
    el: ".swiper-pagination",
  },
});

var clientsSwiper = new Swiper(".clientsSwiper", {
  slidesPerView: 1,
  slidesPerGroupSkip: 0,
  centeredSlides: false,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  keyboard: {
    enabled: true,
  },
  loop: true,
  breakpoints: {
    510: { slidesPerView: 3, slidesPerGroup: 3 },
    1280: { slidesPerView: 6, loop: false },
  },
});

const initSection = function (sectionId, buttonClass, plan) {
  let section = document.getElementById(sectionId);
  let body = document.getElementsByTagName("body")[0];
  let buttons = document.getElementsByClassName(buttonClass);

  if (!section || !buttons) {
    return;
  }

  let backButtons = section.getElementsByClassName("confirm__form-back-button");

  for (let b of backButtons) {
    b.addEventListener("click", (e) => {
      e.preventDefault();

      body.style.overflowY = "scroll";
      section.style.display = "none";
    });
  }

  for (let b of buttons) {
    b.addEventListener("click", (e) => {
      e.preventDefault();

      selectedPlan = plan;
      body.style.overflowY = "hidden";
      section.style.display = "block";
    });
  }

  let confirmButtons = section.getElementsByClassName("confirm__form-button");
  let sErrs = new Errors(
    [sectionId + "-name", sectionId + "-email", sectionId + "-password"],
    sectionId + "-errs"
  );

  for (let b of confirmButtons) {
    b.addEventListener("click", (e) => {
      e.preventDefault();

      sErrs.Clear();
      sErrs.HideError();

      let full_name = document.getElementById(sectionId + "-name");
      let company = "company";
      let password = document.getElementById(sectionId + "-password");
      let email = document.getElementById(sectionId + "-email");

      let errors = [];
      if (!full_name || full_name.value.length < 2) {
        errors.push(full_name.getAttribute("id"));
      }
      if (!password || password.value.length < 6) {
        errors.push(password.getAttribute("id"));
      }
      if (!email || !ValidateEmail(email.value)) {
        errors.push(email.getAttribute("id"));
      }

      if (errors.length === 0) {
        data = {
          name: full_name.value,
          company: company.value,
          password: password.value,
          email: email.value,
          payment_opt: selectedPlan * 1,
        };

        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = () => {
          if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
              try {
                let resp = JSON.parse(xhttp.response);
                if (resp?.status === "ok") {
                  console.log(JSON.stringify(resp));
                  if (selectedPlan === 0) {
                    // heatmap
                    window.location.href =
                      "https://buy.stripe.com/6oE8yp7c53Nd0ZWbIR?client_reference_id=" +
                      resp.payment_ses;
                  } else if (selectedPlan === planFullSub) {
                    // heatmap + reports
                    window.location.href =
                      "https://buy.stripe.com/aEU6qhaoh83tgYU6p2?client_reference_id=" +
                      resp.payment_ses;
                  } else if (selectedPlan === planUnlimitedReports) {
                    window.location.href =
                      "https://buy.stripe.com/fZeeWN9kddnNeQM7t5?client_reference_id=" +
                      resp.payment_ses;
                  }
                  // https://app.getplace.io/login/stripe?sess={CHECKOUT_SESSION_ID}
                } else {
                  let msg = "Unexpected error";
                  if (resp?.errors.indexOf("used:email") >= 0) {
                    msg = "Email already in use";
                    sErrs.Highlight([email.getAttribute("id")]);
                  }

                  sErrs.ShowError(msg);
                }
              } catch (e) {}
            } else {
              sErrs.ShowError("Unexpected error");
            }
          }
        };

        xhttp.open("POST", HOST + "/auth/register", true);
        xhttp.send(JSON.stringify(data));
      } else {
        sErrs.Highlight(errors);
      }
    });
  }
};

//sections
initSection("full-sub-section", "full-sub-b", planFullSub);
initSection(
  "unlimited-reports-section",
  "unlimited-reports-b",
  planUnlimitedReports
);
