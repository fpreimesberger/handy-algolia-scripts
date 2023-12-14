/*
  Description:
    Get analytics data using the REST API.

  Input:
    - appId: Algolia app ID
    - apiKey: API key with analytics ACL
    - indexName: Algolia index name
    - path: path exluding the /2/ from https://www.algolia.com/doc/rest-api/analytics/#search-analytics
        ex. "searches/noResults" for Get top searches with no results
    - fileName: name of file to write to
    - startDate: start date formatted as a string like “2006-01-01”
    - endDate: end datd formatted as a string like “2006-01-02”

  Output:
    A .csv file that contains the analytics data.
*/

const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

var appId = process.env.ALGOLIA_APP_ID;
var apiKey = process.env.ALGOLIA_ANALYTICS_API_KEY;
var indexName = process.env.ALGOLIA_INDEX_NAME;

var path = "clicks/positions";

var currentDate = new Date().toISOString().split("T")[0];
var fileName = `output/Analytics_${appId}_${currentDate}.csv`;

var startDate = "2023-12-01";
var endDate = "2023-12-11";

var data = [];
var url = `https://analytics.algolia.com/2/${path}?index=${indexName}&startDate=${startDate}&endDate=${endDate}`;

function convertToCSV(arr) {
  const array = [Object.keys(arr[0])].concat(arr);

  return array
    .map((it) => {
      return Object.values(it).toString();
    })
    .join("\n");
}

axios
  .get(url, {
    headers: {
      "X-Algolia-API-Key": apiKey,
      "X-Algolia-Application-Id": appId,
    },
  })
  .then((response) => {
    // Needs to be updated depending on the method
    response.data.positions.map((item) => {
      data.push({
        position: item.position,
        clickCount: item.clickCount,
      });
    });

    let convertedData = convertToCSV(data);

    fs.writeFile(fileName, convertedData, "utf8", function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log(`Saved to ${fileName}`);
      }
    });
  })
  .catch((error) => {
    console.log(error);
  });
