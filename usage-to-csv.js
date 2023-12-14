/*
  Description:
    Returns the number of billed search requests per day for an app with the REST API.
    The number of billed Search Requests is equal to total_search_requests minus querysuggestions_total_search_requests.
    https://www.algolia.com/doc/rest-api/usage/

  Input:
    - appId: Algolia app ID
    - apiKey: API key with usage ACL
    - fileName: name of file to write to
    - startDate: start date formatted as a string like “2006-01-02T00:00:00.000Z”
    - endDate: end datd formatted as a string like “2006-01-02T00:00:00.000Z”

  Output:
    A .csv file that lists the number of billed search requests per day.
*/

const axios = require("axios");
const fs = require("fs");
const moment = require("moment");
require("dotenv").config();

var appId = process.env.ALGOLIA_APP_ID;
var apiKey = process.env.ALGOLIA_USAGE_API_KEY;

var currentDate = new Date().toISOString().split("T")[0];
var fileName = `output/Usage_${appId}_${currentDate}.csv`;

var startDate = "2023-09-03T00:00:00Z";
var endDate = "2023-12-03T00:00:00Z";

var dataQS = [];
var dataTotal = [];

function convertToCSV(arr) {
  const array = [Object.keys(arr[0])].concat(arr);

  return array
    .map((it) => {
      return Object.values(it).toString();
    })
    .join("\n");
}

async function getQSusage() {
  var url = `https://usage.algolia.com/1/usage/querysuggestions_total_search_requests?startDate=${startDate}&endDate=${endDate}`;

  return axios
    .get(url, {
      headers: {
        "X-Algolia-API-Key": apiKey,
        "X-Algolia-Application-Id": appId,
      },
    })
    .then((response) => {
      response.data.querysuggestions_total_search_requests.map((item) => {
        dataQS.push({
          date: moment(item.t).format("MM-DD-YYYY"),
          numRequests: item.v,
        });
      });

      return dataQS;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getTotalSearchRequests() {
  var url = `https://usage.algolia.com/1/usage/total_search_requests?startDate=${startDate}&endDate=${endDate}`;

  return axios
    .get(url, {
      headers: {
        "X-Algolia-API-Key": apiKey,
        "X-Algolia-Application-Id": appId,
      },
    })
    .then((response) => {
      response.data.total_search_requests.map((item) => {
        dataTotal.push({
          date: moment(item.t).format("MM-DD-YYYY"),
          numRequests: item.v,
        });
      });

      return dataTotal;
    })
    .catch((error) => {
      console.log(error);
    });
}

(async () => {
  var qsRequests = await getQSusage();
  var totalRequests = await getTotalSearchRequests();

  var netRequests = [];

  if (Object.keys(qsRequests).length === Object.keys(totalRequests).length) {
    qsRequests.forEach((e, index) => {
      var nbTotalRequests = totalRequests[index].numRequests;
      var nbQSrequests = qsRequests[index].numRequests;

      netRequests.push({
        date: qsRequests[index].date,
        nbRequests: nbTotalRequests - nbQSrequests,
      });
    });

    let convertedData = convertToCSV(netRequests);

    fs.writeFile(fileName, convertedData, "utf8", function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log(`Saved to ${fileName}`);
      }
    });
  }
})();
