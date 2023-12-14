/*
  Description:
    Copy an index between different applications.
    https://www.algolia.com/doc/guides/sending-and-managing-data/manage-indices-and-apps/manage-indices/how-to/copy-indices/#copy-indices-between-different-applications

  Input:
    - sourceAppId: Algolia app ID for source
    - sourceApiKey: admin API key for source app
    - sourceIndexName: Algolia index to copy from source app
    - destAppId: Algolia app ID for target
    - destApiKey: admin API key for target app
    - destIndexName: name for new index in target app

  Output:
    Error message if any, none otherwise.
*/

const algoliasearch = require("algoliasearch");
const accountCopyIndex = require("@algolia/client-account").accountCopyIndex;
require("dotenv").config();

var sourceAppId = process.env.ALGOLIA_APP_ID;
var sourceApiKey = process.env.ALGOLIA_ADMIN_API_KEY;
var sourceIndexName = process.env.ALGOLIA_INDEX_NAME;

var destAppId = process.env.ALGOLIA_DESTINATION_APP_ID;
var destApiKey = process.env.ALGOLIA_DESTINATION_ADMIN_API_KEY;
var destIndexName = `${sourceIndexName}_copy`;

const sourceIndex = algoliasearch(sourceAppId, sourceApiKey).initIndex(
  sourceIndexName
);
const targetIndex = algoliasearch(destAppId, destApiKey).initIndex(
  destIndexName
);

accountCopyIndex(sourceIndex, targetIndex)
  .then((response) => {
    console.log(response);
  })
  .catch((err) => {
    console.log(err);
  });
