const express = require('express')
const app = express()
const port = 8000
const cors = require("cors")

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/amcharts/simple-column-chart', (req, res) => {
  res.json([{
    "country": "USA",
    "visits": 2025
  }, {
    "country": "China",
    "visits": 1882
  }, {
    "country": "Japan",
    "visits": 1809
  }, {
    "country": "Germany",
    "visits": 1322
  }, {
    "country": "UK",
    "visits": 1122
  }, {
    "country": "France",
    "visits": 1114
  }, {
    "country": "India",
    "visits": 984
  }, {
    "country": "Spain",
    "visits": 711
  }, {
    "country": "Netherlands",
    "visits": 665
  }, {
    "country": "Russia",
    "visits": 580
  }, {
    "country": "South Korea",
    "visits": 443
  }, {
    "country": "Canada",
    "visits": 441
  }, {
    "country": "Brazil",
    "visits": 395
  }]);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})