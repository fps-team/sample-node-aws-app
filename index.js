const express = require('express')
const app = express()
const cors = require("cors")
const { v4: uuidv4 } = require('uuid');
const axios = require("axios")

const { BASE_URL, API_VERSION, SIGN_IN_URL } = require("./constants/URL");
const { TABLEAU_LOGIN_CREDENTIALS } = require("./constants/auth");

const PORT = process.env.PORT || 8000;
const LIST_OF_REGIONS = ["AMER", "APAC", "EMEA"];

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

const retrieveDataSources = (token, siteId) => {
  return axios({
    method: 'get',
    url: BASE_URL + API_VERSION + "/sites/" + siteId + "/datasources",
    headers: {
      'X-Tableau-Auth': token
    }
  })
  .then(function (response) {
    return response.data;
  })
  .catch(function (error) {
    console.log(error);
    return null;
  }); 
}

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
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

app.get('/datasource/simple-column-chart', async (req, res) => {
  let login = await loginUser();

  if (login) {
    let credentials = login.credentials;
    let dataSources = await retrieveDataSources(credentials.token, credentials.site.id)
    console.log(dataSources)
    res.format ({
      'text/html': function() {
          res.status(200).send(JSON.stringify(dataSources, null, 2)); 
      },
      'application/json': function() {
          res.status(200).json(dataSources);
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