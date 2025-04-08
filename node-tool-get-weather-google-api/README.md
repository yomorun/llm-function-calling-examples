# node-tool-get-weather-google-api

This is a Serverless LLM Function Calling example using Yomo and Google Cloud API to get weather information.

First, you need to create Google Cloud API key and enable the new Weather API and Geocoding API.

When LLM calls the function, it will calculate the latitude and longitude of the address using Geocoding API, and then call the Weather API to get realtime weather information.
## Unit test

```bash
bun test
```

## Run on local

```bash
GOOGLE_CLOUD_API_KEY=<api_key> yomo run app.ts
```
## Deploy to Vivgrid

```bash
touch yc.yml
## Paste the content from Vivgrid Console to yc.yml

yc deploy .
```