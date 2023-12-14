// Edit index settings

const algoliasearch = require("algoliasearch");
require("dotenv").config();

// Input: app ID, API key with editSettings ACL, index
//  +++++++++++++++++++++++++++ INPUT +++++++++++++++++++++++++++

var appId = process.env.ALGOLIA_APP_ID;
var apiKey = process.env.ALGOLIA_WRITE_API_KEY;
var indexName = process.env.ALGOLIA_INDEX_NAME;

// ++++++++++++++++++++++++++ END INPUT ++++++++++++++++++++++++++

const client = algoliasearch(appId, apiKey);
const index = client.initIndex(indexName);

index
  .setSettings({
    ignorePlurals: ["en"],
  })
  .catch((error) => {
    console.log(error);
  });

// index.getSettings().then((settings) => {
//   console.log(settings);
// });
