/*
  Description:
    Edit records in an index.

  Input:
    - appId: Algolia app ID
    - apiKey: API key with addObject ACL
    - indexName: Algolia index name

  Output:
    Updated records logged to console.
*/

const algoliasearch = require("algoliasearch");
require("dotenv").config();

var appId = process.env.ALGOLIA_APP_ID;
var apiKey = process.env.ALGOLIA_WRITE_API_KEY;
var indexName = process.env.ALGOLIA_INDEX_NAME;

const client = algoliasearch(appId, apiKey);
const index = client.initIndex(indexName);

let hits = [];
let updates = [];

index
  .browseObjects({
    attributesToRetrieve: ["objectID", "title"],
    batch: (objects) => (hits = hits.concat(objects)),
  })
  .then(() => {
    // loop over all hits. if the name includes "pink"
    // add attribute color: pink
    for (i in hits) {
      if (hits[i].title && hits[i].title.includes("Pink")) {
        updates.push({
          objectID: hits[i].objectID,
          color: "Pink",
        });
      }
    }

    console.log(updates);

    index.partialUpdateObjects(updates).catch((err) => {
      console.log(err);
    });
  })
  .catch((err) => {
    console.log(err);
  });
