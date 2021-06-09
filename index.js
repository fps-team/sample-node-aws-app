const express = require('express')
const app = express()
const port = 8000
const cors = require("cors")
const { v4: uuidv4 } = require('uuid');

const LIST_OF_REGIONS = ["AMER", "APAC", "EMEA"];

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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})