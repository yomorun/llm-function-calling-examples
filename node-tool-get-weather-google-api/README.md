# node-tool-get-weather-google-api

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