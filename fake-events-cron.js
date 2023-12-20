/*
  Description:
    Sets up a cron job that sends fake click and conversion (add to cart and purchase) events 
    after search with somewhat randomized user tokens every 2 hours.
    Events include revenue information.
    https://www.algolia.com/doc/rest-api/insights/#added-object-ids-to-cart-after-search
    https://www.algolia.com/doc/rest-api/insights/#purchased-object-ids-after-search

  Input:
    - appId: Algolia app ID
    - apiKey: API key with search ACL
    - indexName: Algolia index name
    - ./input/queries.js: file that exports a template literal of queries to use for fake searches

  Output:
    "Sending events" with timestamp logged to console whenever the cron runs
    Errors logged to console, if any
*/

const algoliasearch = require("algoliasearch");
const axios = require("axios");
const cron = require("node-cron");
const { queries } = require("./input/queries.js");
require("dotenv").config();

var appId = process.env.ALGOLIA_APP_ID;
var apiKey = process.env.ALGOLIA_SEARCH_API_KEY;
var indexName = process.env.ALGOLIA_INDEX_NAME;

const client = algoliasearch(appId, apiKey);
const index = client.initIndex(indexName);

const url = `https://insights.algolia.io/1/events?x-algolia-application-id=${appId}&x-algolia-api-key=${apiKey}`;

const queryCsv = queries;
const queryArr = queryCsv.split("\n");

async function sendEvents() {
  var randomNum = Math.floor(Math.random() * 50 + 1);
  for (i in queryArr) {
    var userToken = `user-${i + randomNum}`;

    await index
      .search(queryArr[i], {
        userToken: userToken,
        clickAnalytics: true,
      })
      .then((response) => {
        var nbHits = response.nbHits;
        if (nbHits == 0) {
          return;
        }

        var queryID = response.queryID;
        var timestamp = Date.now();

        // Choose a random hit
        var max = nbHits < 21 ? nbHits : 20;
        var position = Math.floor(Math.random() * max + 1);
        var objectID = response.hits[position - 1].objectID;
        var price = response.hits[position - 1].price;

        // Send a click, add to cart (conversion), and purchase (conversion) events for the hit
        axios
          .post(url, {
            events: [
              {
                eventType: "click",
                eventName: "Product Clicked",
                index: indexName,
                userToken: userToken,
                timestamp: timestamp,
                objectIDs: [objectID],
                queryID: queryID,
                positions: [position],
              },
              {
                eventType: "conversion",
                eventSubtype: "addToCart",
                eventName: "Product Added To Cart",
                index: indexName,
                userToken: userToken,
                timestamp: timestamp,
                objectIDs: [objectID],
                objectData: [
                  {
                    price: price,
                    quantity: 1,
                  },
                ],
                currency: "USD",
                queryID: queryID,
              },
              {
                eventType: "conversion",
                eventSubtype: "purchase",
                eventName: "Products Purchased",
                index: indexName,
                userToken: userToken,
                timestamp: timestamp,
                objectIDs: [objectID],
                objectData: [
                  {
                    price: price,
                    quantity: 1,
                  },
                ],
                currency: "USD",
                queryID: queryID,
              },
            ],
          })

          .catch((error) => {
            console.log(error);
          });
      });
  }
}

// Every 2 hours, on the hour
cron.schedule("* */2 * * *", () => {
  console.log("Events sending", new Date());
  sendEvents();
});
