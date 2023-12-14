/*
  Description:
    Delete a user's personalization profile.
    https://www.algolia.com/doc/rest-api/personalization/#delete-a-user-profile
    Does not delete Insights events linked to the user.

  Input:
    - appId: Algolia app ID
    - apiKey: API key with recommendations ACL
    - userToken: user token to remove

  Output:
    Error message if any, none otherwise.
*/

const axios = require("axios");
require("dotenv").config();

var appId = process.env.ALGOLIA_APP_ID;
var apiKey = process.env.ALGOLIA_RECOMMEND_API_KEY;
var userToken = "anonymous-42cd610a-f903-4720-b472-f02540e812d9";

var url = `https://personalization.us.algolia.com/1/profiles/${userToken}`;

axios
  .delete(url, {
    headers: {
      "X-Algolia-API-Key": apiKey,
      "X-Algolia-Application-Id": appId,
    },
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((err) => {
    console.log(err);
  });
