// BURGER MENU
if (typeof mixpanel !== "undefined") {
  mixpanel.init("766d37d18463a3612075455bb0ff9a09", { debug: false });
  mixpanel.identify("noname");
}

const HOST = "https://app.getplace.io";

// const mobileMenu = document.getElementById("mobileMenu");
// const burger = document.getElementById("burgerMenu");
// burger.addEventListener("click", function () {
//   burger.classList.toggle("active");
//   mobileMenu.classList.toggle("active");
// });
// mobileMenu.addEventListener("click", function () {
//   mobileMenu.classList.remove("active");
//   burger.classList.remove("active");
// });

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

heatMapOnly.addEventListener("click", function () {
  selectedPlan = 0;
  popUpText.innerHTML =
    "Few clicks away from accessing the Footfall Heat Map<br/><span>However each location report will require payment</span>";
  popUpSubmit.value = "Subscribe for £200";
  popUpBg.classList.toggle("active");
});

heatMapAndReports.addEventListener("click", function () {
  selectedPlan = 1;
  popUpText.innerHTML =
    "Few clicks away from accessing the Footfall Heat Map and unlimited Location Reports";
  popUpSubmit.value = "Subscribe for £250";
  popUpBg.classList.toggle("active");
});

reportsOnly.addEventListener("click", function () {
  selectedPlan = 2;
  popUpText.innerHTML =
    "Few clicks away from accessing unlimited Location Reports";
  popUpSubmit.value = "Subscribe for £100";
  popUpBg.classList.toggle("active");
});

locationButton.addEventListener("click", function () {
  selectedPlan = 0;
  popUpText.innerHTML =
    "Few clicks away from accessing the Footfall Heat Map<br/><span>However each location report will require payment</span>";
  popUpSubmit.value = "Subscribe for £200";
  popUpBg.classList.toggle("active");
});

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

// DEMO POP UP
var loading = false;

//const requestDemoBtn = document.getElementsByClassName("requestDemo");
const demoPopUpBg = document.getElementById("demoPopUpBg");
const demoPopUpClose = document.getElementById("demoPopUpClose");

/*
Array.from(requestDemoBtn).forEach((element) => {
  element.addEventListener("click", () => {
    demoPopUpBg.classList.toggle("active");
  });
});*/

demoPopUpClose.addEventListener("click", () => {
  demoPopUpBg.classList.remove("active");
});
const demoPopUp = document.getElementById("demoPopUp");

demoPopUpBg.addEventListener("click", (event) => {
  let isClickInside = demoPopUp.contains(event.target);

  if (!isClickInside) {
    demoPopUpBg.classList.remove("active");
  }
});

// HERO ANIMATION

const animated = document.getElementById("animated");
const textLoad = () => {
  if (animated) {
    setTimeout(() => {
      animated.innerHTML = "restaurant";
    }, 0);
    setTimeout(() => {
      animated.innerHTML = "cafe";
    }, 4000);
    setTimeout(() => {
      animated.innerHTML = "bar";
    }, 8000);
  }
};
textLoad();
setInterval(textLoad, 12000);

mapboxgl.accessToken =
  "pk.eyJ1Ijoic3Nlcmd5IiwiYSI6ImNsOHU5enNjbTAyMGQzcHJ4ODlsanNpNHgifQ.NXh_OvvnBFO_uArBg676IA";

function InitGeocoder(ID) {
  let geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    bbox: [
      -8.585350424507451, 49.89060631678373, 1.762474098318385,
      60.85571099962073,
    ],
    language: "en-GB",
    placeholder: "Start typing United Kingdom address or postcode",
  });

  geocoder.addTo("#" + ID);

  geocoder.on("result", (e) => {
    data[ID].postcode = "";
    for (let item of e.result.context) {
      if (item.id.includes("postcode")) {
        data[ID].postcode = item.text;
        break;
      }
    }

    if (data[ID].postcode === "" && e.result.id.includes("postcode")) {
      data[ID].postcode = e.result.text;
    }

    data[ID].latitude = e.result.center[1];
    data[ID].longitude = e.result.center[0];

    data[ID].hex = h3.latLngToCell(data[ID].latitude, data[ID].longitude, 10);

    data[ID].address = e.result.place_name;
  });

  let full_name = document.getElementById(ID + "_name");
  let company_name = document.getElementById(ID + "_company");
  let email = document.getElementById(ID + "_email");
  let container = document.getElementById(ID);
  // let email_contact = document.getElementById('email_contact');
  // let full_name_contact = document.getElementById('full_name_contact');

  full_name.addEventListener("focus", function (e) {
    e.target.classList.remove("error");
  });

  company_name.addEventListener("focus", function (e) {
    e.target.classList.remove("error");
  });

  email.addEventListener("focus", function (e) {
    e.target.classList.remove("error");
  });

  // email_contact.addEventListener('focus', function (e) {
  //   e.target.classList.remove("error");
  // })

  // full_name_contact.addEventListener('focus', function (e) {
  //   e.target.classList.remove("error");
  // })

  let nodes = document.getElementById(ID).childNodes[0].childNodes;
  for (let node of nodes) {
    if (node.nodeName.toLowerCase() === "input") {
      node.addEventListener("focus", function () {
        container.classList.remove("error");
      });
      break;
    }
  }
}

let data = {
  geocoder1: {
    address: "",
    full_name: "",
    company_name: "",
    email: "",
    latitude: 0,
    longitude: 0,
    postcode: "",
    hex: "",
  },
  geocoder2: {
    address: "",
    full_name: "",
    company_name: "",
    email: "",
    latitude: 0,
    longitude: 0,
    postcode: "",
    hex: "",
  },
};

function ValidateEmail(value) {
  const email_filter =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return email_filter.test(value);
}

function sendForm(ID) {
  let full_name = document.getElementById(ID + "_name");
  let company_name = document.getElementById(ID + "_company");
  let email = document.getElementById(ID + "_email");
  let container = document.getElementById(ID);

  full_name.classList.remove("error");
  company_name.classList.remove("error");
  email.classList.remove("error");
  container.classList.remove("error");

  data[ID].full_name = full_name?.value;
  data[ID].company_name = company_name?.value;
  data[ID].email = email?.value;

  let errors = false;
  if (data[ID].full_name === undefined || data[ID].full_name.length < 2) {
    full_name.classList.add("error");
    errors = true;
  }
  if (data[ID].company_name === undefined || data[ID].company_name.length < 2) {
    company_name.classList.add("error");
    errors = true;
  }
  if (data[ID].email === undefined || !ValidateEmail(data[ID].email)) {
    email.classList.add("error");
    errors = true;
  }

  if (
    data[ID].latitude === 0 ||
    data[ID].longitude === 0 ||
    data[ID].hex === "" ||
    data[ID].address === "" ||
    data[ID].postcode === ""
  ) {
    container.classList.add("error");
    errors = true;
  }

  if (!errors) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4) {
        try {
          let resp = JSON.parse(xhttp.response);
          if (resp?.status === "ok") {
            window.location.href =
              "https://buy.stripe.com/6oE4i99kd97x7ok3cj?client_reference_id=" +
              resp.id;
          }
        } catch (e) {}
      }
    };

    xhttp.open("POST", HOST + "/report-order", true);
    xhttp.send(JSON.stringify(data[ID]));
  }
}

let initSendFormErrs = new Errors(
  ["_fName", "_cName", "_password", "_bEmail"],
  "sendform-errs"
);

popUpSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  sendFormBuy();
});

function sendFormBuy() {
  let full_name = document.getElementById("_fName");
  let company = document.getElementById("_cName");
  let password = document.getElementById("_password");
  let email = document.getElementById("_bEmail");

  initSendFormErrs.Clear();
  initSendFormErrs.HideError();

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
              msg = "Unexpected error";
              if (resp?.errors.indexOf("used:email") >= 0) {
                msg = "Email already in use";
                initSendFormErrs.Highlight([email.getAttribute("id")]);
              }

              initSendFormErrs.ShowError(msg);
            }
          } catch (e) {}
        } else {
          initSendFormErrs.ShowError("Unexpected error");
        }
      }
    };

    xhttp.open("POST", HOST + "/auth/register", true);
    xhttp.send(JSON.stringify(data));
  } else {
    initSendFormErrs.Highlight(errors);
  }
}

// InitGeocoder("geocoder1");
InitGeocoder("geocoder2");

var loading = false;

function sendContact() {
  let first_name = document.getElementById("fName");
  let email = document.getElementById("bEmail");
  let company = document.getElementById("cName");

  let dta = {};

  first_name.classList.remove("error");
  email.classList.remove("error");
  company.classList.remove("error");

  dta.first_name = first_name?.value;
  dta.last_name = "N/A";
  dta.email = email?.value;
  dta.company = company?.value;

  let errors = false;
  if (dta.first_name === undefined || dta.first_name.length < 2) {
    first_name.classList.add("error");
    errors = true;
  }
  if (dta.email === undefined || !ValidateEmail(dta.email)) {
    email.classList.add("error");
    errors = true;
  }
  if (dta.company === undefined || dta.company.length < 2) {
    company.classList.add("error");
    errors = true;
  }

  if (!errors) {
    if (loading) {
      return;
    }
    loading = true;
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4) {
        loading = false;
        try {
          let resp = JSON.parse(xhttp.response);
          if (resp?.status === "ok") {
            console.log(resp);
            document.getElementById("demoPopUpForm").style.display = "none";
            document.getElementById("demoPopUpText").style.display = "none";
            document.getElementById("demoPopUpSent").style.display = "block";
          }
        } catch (e) {}
      }
    };

    xhttp.open("POST", HOST + "/auth/contact-form", true);
    xhttp.send(JSON.stringify(dta));
  }
}

function sendReport() {
  let full_name = document.getElementById("full_name_contact");
  let email = document.getElementById("email_contact");

  let dta = {};

  full_name.classList.remove("error");
  email.classList.remove("error");

  dta.full_name = full_name?.value;
  dta.email = email?.value;

  let errors = false;
  if (dta.full_name === undefined || dta.full_name.length < 2) {
    full_name.classList.add("error");
    errors = true;
  }
  if (dta.email === undefined || !ValidateEmail(dta.email)) {
    email.classList.add("error");
    errors = true;
  }

  if (!errors) {
    if (loading) {
      return;
    }
    loading = true;
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4) {
        loading = false;
        try {
          let resp = JSON.parse(xhttp.response);
          if (resp?.status === "ok") {
            // console.log(resp);
            document.location.href = HOST + "/location-report/cWX9Ln";
            document.getElementById("gitFormRep").style.display = "none";
            document.getElementById("gitFormTitleRep").style.display = "none";
            return;
          }
        } catch (e) {}
      }
    };

    xhttp.open("POST", HOST + "/auth/report-form", true);
    xhttp.send(JSON.stringify(dta));
  }
}

function InitSendForm() {
  let first_name = document.getElementById("first_name");
  let last_name = document.getElementById("last_name");
  let email = document.getElementById("email");
  let company = document.getElementById("company");

  first_name.addEventListener("focus", function (e) {
    e.target.classList.remove("error");
  });

  last_name.addEventListener("focus", function (e) {
    e.target.classList.remove("error");
  });

  email.addEventListener("focus", function (e) {
    e.target.classList.remove("error");
  });

  company.addEventListener("focus", function (e) {
    e.target.classList.remove("error");
  });
}

InitSendForm();

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

let trackHref = (e, link, entryPoint, newWindow = false) => {
  e.preventDefault();

  if (typeof mixpanel !== "undefined") {
    mixpanel.track("View example report", {
      "Entry point": entryPoint,
    });
  }

  if (newWindow) {
    window.open(link, "_blank");
  } else {
    document.location.href = e.target.href;
  }
};
