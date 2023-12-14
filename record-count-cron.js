/*
  Description:
    Sets up a cron job that outputs an app's indices and number of records every 5 minutes.

  Input:
    - appId: Algolia app ID
    - apiKey: API key with analytics ACL

  Output:
    Indices with their record count and total record count logged to console every 5 minutes.
*/
const axios = require("axios");
const cron = require("node-cron");
require("dotenv").config();

var appId = process.env.ALGOLIA_APP_ID;
var apiKey = process.env.ALGOLIA_ANALYTICS_API_KEY;

let url = `https://${appId}-dsn.algolia.net/1/indexes`;

function getUsage() {
  axios
    .get(url, {
      headers: {
        "X-Algolia-API-Key": apiKey,
        "X-Algolia-Application-Id": appId,
      },
    })
    .then((response) => {
      var recordCount = 0;

      response.data.items.forEach((i) => {
        if (!i.virtual) {
          recordCount += i.entries;
          console.log(`${i.name}: ${i.entries}`);
        }
      });
      console.log(new Date(), " | Record count: ", recordCount, "\n");
    })
    .catch((err) => {
      console.log(err);
    });
}

cron.schedule("*/1 * * * *", () => {
  getUsage();
});
