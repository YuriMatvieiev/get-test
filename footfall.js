//POPUP
const heatMapOnly = document.getElementById("heatMapOnly");
const heatMapAndReports = document.getElementById("heatMapAndReports");
const reportsOnly = document.getElementById("reportsOnly");
const locationButton = document.getElementById("locationButton");
const popUpText = document.getElementById("popUpText");
const popUpSubmit = document.getElementById("popUpSubmit");
const popUpBg = document.getElementById("popUpBg");
const popUpClose = document.getElementById("popUpClose");
let selectedPlan = 0;

if (heatMapOnly) {
  heatMapOnly.addEventListener("click", function () {
    selectedPlan = 0;
    popUpText.innerHTML = "However each location report will require payment";
    popUpSubmit.value = "Subscribe for £200";
    popUpBg.classList.toggle("active");
  });
}

if (heatMapAndReports) {
  heatMapAndReports.addEventListener("click", function () {
    selectedPlan = 1;
    popUpText.innerHTML = "and unlimited Location Reports";
    popUpSubmit.value = "Subscribe for £250";
    popUpBg.classList.toggle("active");
  });
}

if (!!reportsOnly) {
  reportsOnly.addEventListener("click", function () {
    selectedPlan = 2;
    popUpText.innerHTML =
      "Few clicks away from accessing unlimited Location Reports";
    popUpSubmit.value = "Subscribe for £100";
    popUpBg.classList.toggle("active");
  });
}

locationButton.addEventListener("click", function () {
  selectedPlan = 2;
  popUpText.innerHTML =
    "Few clicks away from accessing unlimited Location Reports";
  popUpSubmit.value = "Subscribe for £100";
  popUpBg.classList.toggle("active");
});

popUpClose.addEventListener("click", function () {
  popUpBg.classList.remove("active");
});

// DEMO POP UP
var loading = false;

// const requestDemoBtn = document.getElementsByClassName("requestDemoButton");
// const demoPopUpBg = document.getElementById("demoPopUpBg");
// const demoPopUpClose = document.getElementById("demoPopUpClose");

// Array.from(requestDemoBtn).forEach((element) => {
//   element.addEventListener("click", () => {
//     demoPopUpBg.classList.toggle("active");
//   });
// });

// demoPopUpClose.addEventListener("click", () => {
//   demoPopUpBg.classList.remove("active");
// });

// const demoPopUp = document.getElementById("demoPopUp");
// demoPopUpBg.addEventListener("click", (event) => {
//   let isClickInside = demoPopUp.contains(event.target);

//   if (!isClickInside) {
//     demoPopUpBg.classList.remove("active");
//   }
// });

function ValidateEmail(value) {
  const email_filter =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return email_filter.test(value);
}

popUpSubmit.addEventListener("click", (e) => {
  e.preventDefault();

  sendForm();
});

let sendFormErrs = new Errors(
  ["_fName", "_cName", "_password", "_bEmail"],
  "sendform-err"
);

function sendForm() {
  let full_name = document.getElementById("_fName");
  let company = document.getElementById("_cName");
  let password = document.getElementById("_password");
  let email = document.getElementById("_bEmail");

  sendFormErrs.Clear();
  sendFormErrs.HideError();

  let errors = [];
  if (!full_name || full_name.value.length < 2) {
    errors.push(full_name.getAttribute("id"));
  }
  if (!company || company.value.length < 2) {
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
        if (xhttp.status === 200) {
          try {
            resp = JSON.parse(xhttp.response);
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
                sendFormErrs.Highlight([email.getAttribute("id")]);
              }

              sendFormErrs.ShowError(msg);
            }
          } catch (e) {}
        } else {
          sendFormErrs.ShowError("Unexpected error");
        }
      }
    };

    xhttp.open("POST", HOST + "/auth/register", true);
    xhttp.send(JSON.stringify(data));
  } else {
    sendFormErrs.Highlight(errors);
  }
}

let sendContactErrs = new Errors(
  ["fName", "bEmail", "cName"],
  "sendcontact-err"
);

function sendContact() {
  let first_name = document.getElementById("fName");
  let email = document.getElementById("bEmail");
  let company = document.getElementById("cName");

  let dta = {};

  sendContactErrs.Clear();
  sendContactErrs.HideError();

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
            resp = JSON.parse(xhttp.response);
            if (resp?.status === "ok") {
              console.log(resp);
              document.getElementById("demoPopUpForm").style.display = "none";
              document.getElementById("demoPopUpText").style.display = "none";
              document.getElementById("demoPopUpSent").style.display = "block";
            } else {
              let msg = "Unexpected error";

              sendContactErrs.ShowError(msg);
            }
          } catch (e) {}
        } else {
          sendContactErrs.ShowError("Unexpected error");
        }
      }
    };

    xhttp.open("POST", HOST + "/auth/contact-form", true);
    xhttp.send(JSON.stringify(dta));
  } else {
    sendContactErrs.Highlight(errors);
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
