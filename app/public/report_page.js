const HOST = "https://app.getplace.io";
// const HOST = "http://localhost:4600";

mapboxgl.accessToken = 'pk.eyJ1IjoieG9wb2xvbCIsImEiOiJjbDkxbjNxcmEwMW5sM3ByeWtkaWRpdmh6In0.uOJmlxO-K7BoFV5tfbFNxw';

function FormatColumnChartData(reportData, formatterX, formatterY) {

  let xData = [];
  let yData = [];

  if (!!reportData.data) {
    for (let item of reportData.data) {
      xData.push(item.index);
      yData.push(item.value);
    }
  }

  return {
    series: [{
      name: reportData.fields[1],
      data: yData
    }],
      chart: {
        height: 300,
        width: '100%',
        type: 'bar',
      },
      colors: ['#3935D8'],
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        }
      },
      stroke: {
        width: 1.5,
        dashArray: 0,
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      xaxis: {
        categories: xData,
        labels: {
          style: {
            fontSize: '10px'
          },
          formatter: !!!formatterX ? (value) => {
            return value;
          } : formatterX,
        },
      },
      yaxis: {
        title: {
          text: reportData.fields[1]
        },
        labels: {
          formatter: !!!formatterY ? (value) => {
            return value;
          } : formatterY,
        }
      },
  };
}

function ProcessAgeData(ageData) {

  if (!ageData.hasOwnProperty('data') || !!!ageData.data) {
    return;
  }

  let ageTotal = 0;
  for (let item of ageData.data) {
    ageTotal += item.value
  }
  if (ageTotal > 0) {
    for (let i = 0; i < ageData.data.length; i++) {
      ageData.data[i].value = Math.round(ageData.data[i].value * 100 / ageTotal)
    }
    return FormatColumnChartData(ageData, null, function (value) {
      return value + "%";
    });
  } else {
    return FormatColumnChartData(ageData);
  }
}

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

// BURGER MENU

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


const heatMapAndReports = document.getElementById("heatMapAndReports");
const reportsOnly = document.getElementById("reportsOnly");
const popUpText = document.getElementById("popUpText");
const popUpSubmit = document.getElementById("popUpSubmit");
const popUpBg = document.getElementById("popUpBg");
const popUpClose = document.getElementById("popUpClose");
let selectedPlan = 0;

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

let freeAccessEmail3 = new Errors(["getFreeAccessEmail3"]);

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


