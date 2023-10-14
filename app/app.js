const express = require("express");
const axios = require("axios");
const swig = require("swig");
const csv = require("csv");
const fs = require("fs");
const pagination = require("pagination")

const app = express();
app.use(express.static("public"));
const PORT = 3000;
const GETPLACE_URL = "https://app.getplace.io";

const pages = function () {
  try {
    const csvData = fs.readFileSync('./pages.csv', 'utf8');
    let parser = csv.parse();

    parser.write(csvData);
    parser.end()
    parser.read();

    let pagesList = {};

    let line; while ((line = parser.read()) !== null) {
      if (line.length > 5) {
        pagesList[line[3]] = {
          city: line[1],
          link: line[4],
          address: line[5],
        };
      }
    }

    return pagesList;
  } catch (err) {
    console.error(err);
    return {};
  }
}()


const getData = async (url, postData) => {
  try {
    const response = !postData?await axios.get(url):await axios.post(url, postData);
    return Promise.resolve(response.data);
  } catch (error) {
    console.log("Url error: ", url);
    return Promise.reject({ error: error.message });
  }
};

app.get("/report/:page", function (req, res) {
  const page = req.params.page;

  if (!pages.hasOwnProperty(page)) {
    res.status(404);
    res.send("Page not found");
    return;
  }

  let pageData = pages[page];



  getData(GETPLACE_URL + "/report-page/" + pageData.link)
    .then((data) => {
      if (data && data.status === "ok") {

        for (let key in data.reports.total_in_radius_report) {
          data.reports.total_in_radius_report[key] = BeautyNumber(data.reports.total_in_radius_report[key]);
        }

        data.reports.location_report.gender_report = BeautyPercents(data.reports.location_report.gender_report);
        let gender = {"male": 50, "female": 50};

        if (data.reports.location_report.gender_report && data.reports.location_report.gender_report.data && data.reports.location_report.gender_report.data.length > 0) {
          gender["male"] = data.reports.location_report.gender_report.data[0].index === "Male"?data.reports.location_report.gender_report.data[0].value:data.reports.location_report.gender_report.data[1].value;
          gender["female"] = 100 - gender["male"];
        }

        let ageTotal = 0;
        let ageTmp = {}

        if (data.reports.location_report.age_report && data.reports.location_report.age_report.data && data.reports.location_report.age_report.data.length > 0) {
          ageTmp = JSON.parse(JSON.stringify(data.reports.location_report.age_report));

          ageTmp.data.sort(function(a,b){
            return b.value - a.value;
          });

          for (let itm of ageTmp.data) {
            ageTotal += itm.value;
          }
        }

        let tpl = swig.renderFile("./tpl/reportPage.html", {
          gender: gender,
          age_report: JSON.stringify(data.reports.location_report.age_report),
          amenities_report:JSON.stringify(data.reports.amenities_report),
          transport_report:JSON.stringify(data.reports.transport_report),

          in_radius: data.reports.total_in_radius_report,
          ethnic: BeautyPercents(data.reports.location_report.ethnic_group_report, true),
          religion: BeautyPercents(data.reports.location_report.religion_report, true),
          relationship: BeautyPercents(data.reports.location_report.relationship_status_report, true),
          crime: data.reports.city_report.crime_rate_rating,
          footfall: data.reports.footfall_month_report,
          vehicles: data.reports.footfall_month_report_n,
          age_total: ageTotal,
          age_sorted: BeautyPercents(ageTmp, true),

          retail_spots: data.reports.amenities_report.supermarkets.count+data.reports.amenities_report.malls.count+data.reports.amenities_report.grocery.count,
          banks: data.reports.amenities_report.banks.count,
          post_offices: data.reports.amenities_report.post_offices.count,
          education: data.reports.amenities_report.schools.count+data.reports.amenities_report.colleges.count,

          parkings: data.reports.transport_report.parking.count,
          stops: data.reports.transport_report.subway.count+data.reports.transport_report.train_station.count,

          lat: data.reports.latitude,
          lng: data.reports.longitude,

          subway_list: data.reports.transport_report.subway,
          train_station_list: data.reports.transport_report.train_station,

          supermarkets_cnt: data.reports.amenities_report.supermarkets.count,
          grocery_cnt: data.reports.amenities_report.grocery.count,
          post_offices_cnt: data.reports.amenities_report.post_offices.count,
          banks_cnt: data.reports.amenities_report.banks.count,
          colleges_cnt: data.reports.amenities_report.colleges.count,
          schools_cnt: data.reports.amenities_report.schools.count,

          reviews_max: data.reports.reviews_max,
          reviews_min: data.reports.reviews_min,

          reviews_rating_min: data.reports.reviews_rating_min,
          reviews_rating_max: data.reports.reviews_rating_max,

          city: pageData.city,
          address: pageData.address,
          page: page,

          ethnic_more_than_avg: data.reports.ethnic_more_than_avg,
          religion_more_than_avg: data.reports.religion_more_than_avg,
        });

        res.status(200);
        res.send(tpl);
      } else {
        console.log(error);
        res.status(404);
        res.send("Page not found");
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(404);
      res.send("Page not found");
    });
});

app.get("/blog/:id", function (req, res) {
  const id = req.params.id;
  getData(GETPLACE_URL + "/page-out/" + id)
    .then((data) => {
      if (data && data.status === "ok") {
        let tpl = swig.renderFile("./tpl/blogPage.html", {
          item: data.item,
          page: id,
        });
        res.status(200);
        res.send(tpl);
      } else {
        console.log(error);
        res.status(404);
        res.send("Page not found");
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(404);
      res.send("Page not found");
    });
});

app.get("/blog", (req, res) => {
  let page = req.query.hasOwnProperty("page")?parseInt(req.query.page):1;
  getData(GETPLACE_URL + "/pages-out", {page: !!page?page:1})
    .then((data) => {
      if (data && data.status === "ok") {

        var paginator = pagination.create('search', {prelink:'/blog', current: page, rowsPerPage: 10, totalResult: data.total});

        let tpl = swig.renderFile("./tpl/blogMenu.html", {
          items: data.items,
          paging: paginator.render(),
          page: (page===1?"":"?page="+page),
        });
        res.status(200);
        res.send(tpl);
      } else {
        console.log(error);
        res.status(404);
        res.send("Page not found");
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(404);
      res.send("Page not found");
    });
});

//list of locations reports
app.get("/locations_and_reports", (req, res) => {
  let keys = Object.keys(pages);

  keys.sort((a,b) => {
    return a.localeCompare(b);
  })

  let pagesSorted = {};
  for (let k of keys) {
    pagesSorted[k] = pages[k];
  }

  let tpl = swig.renderFile("./tpl/locationsAndReports.html", {
    pages: pagesSorted,
  });
  res.status(200);
  res.send(tpl);
});

//TEST CODE START
app.get("/blog/author", (req, res) => {
  getData(GETPLACE_URL + "/pages-out")
    .then((data) => {
      if (data && data.status === "ok") {
        let tpl = swig.renderFile("./tpl/blogAuthor.html", {
          items: data.items,
        });
        res.status(200);
        res.send(tpl);
      } else {
        console.log(error);
        res.status(404);
        res.send("Page not found");
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(404);
      res.send("Page not found");
    });
});
//TEST CODE END
app.get("/sitemap.xml", (req, res) => {
  getData(GETPLACE_URL + "/sitemap")
    .then((data) => {
      if (data && data.status === "ok") {
        res.status(200);
        res.set("Content-Type", "text/xml");
        let xmlPagesText = "<url><loc>https://getplace.io/locations_and_reports</loc><changefreq>monthly</changefreq><priority>0.8</priority><lastmod>2023-07-10</lastmod></url>";
        for (let key in pages) {
          xmlPagesText += "<url><loc>https://getplace.io/report/"+key+"</loc><changefreq>monthly</changefreq><priority>0.8</priority><lastmod>2023-07-10</lastmod></url>";
        }

        let pos = data.sitemap.search("</urlset>");

        data.sitemap = data.sitemap.substring(0, pos)+xmlPagesText+"</urlset>"
        res.send(data.sitemap);
      } else {
        console.log("ERROR");
        res.status(404);
        res.send("Page not found");
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(404);
      res.send("Page not found");
    });
});

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});

function BeautyNumber(num) {

  num = ""+num;

  let nums = num.split(".");

  let res = "";
  for (let i =  nums[0].length-1; i >= 0; i--) {
    if ( nums[0].length-1 - i !== 0 && (nums[0].length-1 - i) % 3 === 0) {
      res = ","+res;
    }
    res = nums[0][i] + res;
  }

  return res + (nums.length>1?"."+nums[1]:"");
}

function BeautyPercents(obj, beautify=false) {

  if (!obj || !obj.data || obj.data.length === 0) return {}

  let total = 0;
  for (let itm of obj['data']) {
    total += itm['value']
  }

  if (total > 0) {
    for (let key in obj['data']) {
      let perc = (obj['data'][key]['value'] / total) * 100;

      if (beautify && perc < 10) {
        perc = Math.round(perc * 10) / 10
      } else {
        perc = Math.round(perc)
      }

      obj['data'][key]['value'] = perc
    }
  }

  return obj
}
