const express = require('express')
const app = express()
const path = require("path")
const cors = require("cors")
const { v4: uuidv4 } = require('uuid');
const axios = require("axios")

const { BASE_URL, API_VERSION, SIGN_IN_URL } = require("./constants/URL");
const { TABLEAU_LOGIN_CREDENTIALS } = require("./constants/auth");
const { csvJSON } = require("./common/helper");

const PORT = process.env.PORT || 8000;
const LIST_OF_REGIONS = ["AMER", "APAC", "EMEA"];

let prettyHtml = require('json-pretty-html').default;


const loginUser = () => {
  return axios({
    method: 'post',
    url: SIGN_IN_URL,
    data: TABLEAU_LOGIN_CREDENTIALS
  })
  .then(function (response) {
    return response.data;
  })
  .catch(function (error) {
    console.log(error);
    return null;
  });
}

const retrieveData = (token, siteId, region) => {
  let filterRegion = region !== null ? (LIST_OF_REGIONS.some(item => item === region.toUpperCase()) ? `?vf_Region=${region}` : '') : '';

  return axios({
    method: 'get',
    url: BASE_URL + API_VERSION + "/sites/" + siteId + "/views/006b868a-6b47-4726-bf16-320470c9f00e/data" + filterRegion,
    headers: {
      'X-Tableau-Auth': token
    }
  })
  .then(function (response) {
    let properties = {
      "_id": uuidv4().replace(/-/gi, ""),
      "categoryX": "country",
      "valueY": "visits",
      "seriesName": "Visits",
    };
    let parsedData = JSON.parse(csvJSON(response.data))
    .filter(value => value.Country !== '')
    .map(item => ({
      "region": item.Region,
      "country": item.Country,
      "visits": parseInt(item["Number of Visits"])
    }));

    return region !== null ? {
      "properties": properties,
      "data": LIST_OF_REGIONS.some(item => item === region.toUpperCase()) ? parsedData : []
    } : {
      "properties": properties,
      "data": parsedData
    };
  })
  .catch(function (error) {
    console.log(error);
    return null;
  }); 
}

app.use(cors())
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
   res.send("Hello World!");
})

app.get('/amcharts/simple-column-chart', (req, res) => {
  let region = req.query.region !== undefined && req.query.region !== "" ? req.query.region : null;
  let _id = uuidv4().replace(/-/gi, "");
  let properties = {
    "_id": _id,
    "categoryX": "country",
    "valueY": "visits",
    "seriesName": "Visits",
  };
  let data = [{
    "region": "AMER",
    "country": "USA",
    "visits": 2025
  }, {
    "region": "APAC",
    "country": "China",
    "visits": 1882
  }, {
    "region": "APAC",
    "country": "Japan",
    "visits": 1809
  }, {
    "region": "EMEA",
    "country": "Germany",
    "visits": 1322
  }, {
    "region": "EMEA",
    "country": "UK",
    "visits": 1122
  }, {
    "region": "EMEA",
    "country": "France",
    "visits": 1114
  }, {
    "region": "APAC",
    "country": "India",
    "visits": 984
  }, {
    "region": "EMEA",
    "country": "Spain",
    "visits": 711
  }, {
    "region": "EMEA",
    "country": "Netherlands",
    "visits": 665
  }, {
    "region": "APAC",
    "country": "Russia",
    "visits": 580
  }, {
    "region": "APAC",
    "country": "South Korea",
    "visits": 443
  }, {
    "region": "AMER",
    "country": "Canada",
    "visits": 441
  }, {
    "region": "AMER",
    "country": "Brazil",
    "visits": 395
  }];
  let output = region !== null ? {
    "properties": properties,
    "data": LIST_OF_REGIONS.some(item => item === region.toUpperCase()) ? data.filter(value => value.region === region.toUpperCase()) : []
  } : {
    "properties": properties,
    "data": data
  };

  res.json(output);
})

app.get('/amcharts/chord-diagram-chart', (req, res) => {
  const colorCodingScheme = [
      {
        "from": "NWKA",
        "color": "#5e5e5e"
      },
      {
          "from": "NWKB",
          "color": "#5e5e5e"
      },
      {
          "from": "CDMA",
          "color": "#f1d073"
      }, {
          "from": "CDMB",
          "color": "#f1d073"
      },  
      {
          "from": "CITA",
          "color": "#db6041"
      }, {
          "from": "CITB",
          "color": "#db6041"
      }, 
      {
          "from": "ENT & FINA",
          "color": "#28c5f4"
      }, {
          "from": "ENT & FINB",
          "color": "#28c5f4"
      }
  ];

  let data = [
    { from: "CITB", to: "CITB", value: 31824 },
    { from: "CDMB", to: "CDMB", value: 7818 },
    { from: "NWKB", to: "NWKB", value: 210962 },
    { from: "ENT & FINB", to: "ENT & FINB", value: 55440 },
    { from: "CDMB", to: "CITB", value: 2901 },
    { from: "CITB", to: "CDMB", value: 2901 },
    { from: "CITA", to: "CDMA", value: 1919 },
    { from: "CDMA", to: "CITA", value: 1919 },
    { from: "CITB", to: "NWKB", value: 46330 },
    { from: "NWKB", to: "CITB", value: 46330 },
    { from: "NWKA", to: "CITA", value: 22760 },
    { from: "CITA", to: "NWKA", value: 22760 },
    { from: "CITB", to: "ENT & FINB", value: 2936 },
    { from: "ENT & FINB", to: "CITB", value: 2936 },
    { from: "ENT & FINA", to: "CITA", value: 14539 },
    { from: "CITA", to: "ENT & FINA", value: 14539 },
    { from: "CDMB", to: "NWKB", value: 27883 },
    { from: "NWKB", to: "CDMB", value: 27883 },
    { from: "NWKA", to: "CDMA", value: 6095 },
    { from: "CDMA", to: "NWKA", value: 6095 },
    { from: "CDMB", to: "ENT & FINB", value: 1402 },
    { from: "ENT & FINB", to: "CDMB", value: 1402 },
    { from: "ENT & FINA", to: "CDMA", value: 2287 },
    { from: "CDMA", to: "ENT & FINA", value: 2287 },
    { from: "NWKB", to: "ENT & FINB", value: 11987 },
    { from: "ENT & FINB", to: "NWKB", value: 11987 },
    { from: "ENT & FINA", to: "NWKA", value: 49374 },
    { from: "NWKA", to: "ENT & FINA", value: 49374 }
  ].map((item, i) => ({
    _id: i + 1, 
    from: item.from,
    to: item.to,
    value: item.value
  }));

  let output = prettyHtml([...colorCodingScheme, ...data]);

  res.format ({
    'text/html': function() {
        res.render("index", { output }); 
    },
    'application/json': function() {
        res.status(200).json(output);
    },
    'default': function() {
        // log the request and respond with 406
        res.status(200).status(406).send('Not Acceptable');
    }
  });

})

app.get('/data/simple-column-chart', async (req, res) => {
  let login = await loginUser();

  if (login) {
    let credentials = login.credentials;
    let region = req.query.region !== undefined && req.query.region !== "" ? req.query.region : null;
    let data = await retrieveData(credentials.token, credentials.site.id, region)

    res.format ({
      'text/html': function() {
          res.render("index", { output: prettyHtml(data) }); 
      },
      'application/json': function() {
          res.status(200).json(data);
      },
      'default': function() {
          // log the request and respond with 406
          res.status(200).status(406).send('Not Acceptable');
      }
    });
  } else {
    res.format({
      'text/html': function() {
          res.status(500).send(JSON.stringify({"message": "error!"}, null, 2)); 
      },
      'application/json': function() {
        res.status(500).json({"message": "error!"});
      },
      'default': function() {
        // log the request and respond with 406
        res.status(406).send('Not Acceptable');
      }
    });
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})