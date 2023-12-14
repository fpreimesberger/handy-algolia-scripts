# Algolia Scripts

A collection of handy Algolia-related Node.js scripts using the [JavaScript API client](https://www.algolia.com/doc/api-client/getting-started/install/javascript/?client=javascript) and [REST API](https://www.algolia.com/doc/api-reference/rest-api/).

- Analytics exported to .csv
- Search request usage exported to .csv
- Records exported from index to .csv
- Edit index settings
- Edit records
- Copy an index between applications
- Set up cron job to monitor record count
- Delete Personalization user profile

## Installation

After cloning the repo:

```
npm install
```

## Environment Variables

You will need to add some or all of following environment variables to your .env file:

```
ALGOLIA_APP_ID
ALGOLIA_USAGE_API_KEY
ALGOLIA_SEARCH_API_KEY
ALGOLIA_WRITE_API_KEY
ALGOLIA_ANALYTICS_API_KEY
ALGOLIA_RECOMMEND_API_KEY
ALGOLIA_ADMIN_API_KEY
ALGOLIA_INDEX_NAME
<!-- For copying apps between indices -->
ALGOLIA_DESTINATION_APP_ID
ALGOLIA_DESTINATION_ADMIN_API_KEY
ALGOLIA_DESTINATION_WRITE_API_KEY

```

## Usage Example

```
node usage-to-csv
```
