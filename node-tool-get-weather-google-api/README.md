# node-tool-get-weather-google-api

This is a Serverless LLM Function Calling example using Yomo and Google Cloud API to get weather information.

First, you need to create Google Cloud API key and enable the [new Weather API](https://developers.google.com/maps/documentation/weather/overview) and [Geocoding API](https://developers.google.com/maps/documentation/geocoding/start).

When LLM calls the function, it will calculate the latitude and longitude of the address using Geocoding API, and then call the Weather API to get realtime weather information.
So when you ask AI: 

```text
I'm going for a hike on the Yarra Bend Park Loop. What should I wear?
```

you'll get a response like:

```markdown
For your hike on the Yarra Bend Park Loop, the current weather is clear with a temperature of approximately 12.3°C (feels like 11.9°C). 

Here are some suggestions on what to wear: 

1. **Layers**: Start with a base layer such as a moisture-wicking t-shirt. Add a light sweater or fleece for warmth since it can be chilly. 
2. **Jacket**: Bring a lightweight jacket or windbreaker to keep warm, especially as it is breezy with a southeast wind at 6 km/h with gusts up to 14 km/h. 
3. **Pants**: Comfortable hiking pants or leggings will be suitable. 
4. **Footwear**: Wear sturdy hiking boots or shoes with good grip. 
5. **Accessories**: Consider a hat or beanie for warmth, and bring gloves if you tend to get cold easily. 
6. **Backpack**: Carry a small backpack with water, snacks, and any additional layers you might need. 

Since there is **no rain** expected, you shouldn't need waterproof gear, but it's always wise to check the latest forecast before heading out. Enjoy your hike!
```

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