/*
  Description:
    Exports records matching given criteria from an index using the browse method.
    https://www.algolia.com/doc/api-reference/api-methods/browse/

  Input:
    - appId: Algolia app ID
    - apiKey: API key with browse ACL
    - fileName: name of file to write to
    - Any browse parameters you wish to add

  Output:
    A .csv file that contains records matching the criteria.
*/

const algoliasearch = require("algoliasearch");
const fs = require("fs");
require("dotenv").config();

var appId = process.env.ALGOLIA_APP_ID;
var apiKey = process.env.ALGOLIA_WRITE_API_KEY;
var indexName = process.env.ALGOLIA_INDEX_NAME;

var currentDate = new Date().toISOString().split("T")[0];
var fileName = `output/Browse_Export_${currentDate}.csv`;

// Additional browse parameters
// https://www.algolia.com/doc/api-reference/api-methods/browse/#method-param-browseparameters
var attributesToRetrieve = ["objectID", "name"];

const client = algoliasearch(appId, apiKey);
const index = client.initIndex(indexName);

var hits = [];

index
  .browseObjects({
    query: "",
    attributesToRetrieve: attributesToRetrieve,
    batch: (batch) => {
      hits = hits.concat(batch);
    },
  })
  .then(() => {
    let convertedData = convertToCSV(hits);

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

function convertToCSV(arr) {
  const array = [Object.keys(arr[0])].concat(arr);

  return array
    .map((it) => {
      // Remove quotes ('"') if present from title
      if (it.title && it.title.includes('"')) {
        it.title = it.title.replace(/['"]+/g, "");
      }
      //   Wraps title in quotes if comma is present for csv formatting
      if (it.title && it.title.includes(",")) {
        it.title = `"${it.title}"`;
      }
      return Object.values(it).toString();
    })
    .join("\n");
}
