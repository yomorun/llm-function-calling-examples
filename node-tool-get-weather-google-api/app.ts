import { Client as GoogleMapsService } from "@googlemaps/google-maps-services-js";

// check if the environment variable is set
if (!process.env.GOOGLE_CLOUD_API_KEY) {
  throw new Error("GOOGLE_CLOUD_API_KEY is not set");
}

const GOOGLE_CLOUD_API_KEY = process.env.GOOGLE_CLOUD_API_KEY;

const googleMapsClient = new GoogleMapsService({});

export const description = 'Get the current weather information for `address`'

// For jsonschema in TypeScript, see: https://github.com/YousefED/typescript-json-schema
export type Argument = {
  /**
   * The address to be queried
   */
  address: string;
}

async function getWeather(address: string) {
  // get the lat and lng of the address by google geocoding api
  try {
    const geocode = await googleMapsClient.geocode({
      params: {
        address: address,
        key: GOOGLE_CLOUD_API_KEY,
      },
      timeout: 1000 // milliseconds
    })
    console.log(`[addr=${address}] geocode result: ${JSON.stringify(geocode.data.results)}`)
    if (geocode.data.results.length === 0) {
      return {
        ok: false,
        result: `address [${address}] not found`,
      }
    }
    // get the weather info by google weather api
    const lat = geocode.data.results[0].geometry.location.lat
    const lng = geocode.data.results[0].geometry.location.lng

  } catch (error) {
    console.error(`Error getting geocode for address [${address}] :`, error);
    return {
      ok: false,
      result: "can not get weather info for giving address now, please try again later",
    }
  }
}

export async function handler(args: Argument) {
  const result = await getWeather(args.address)
  return result
}

export async function getWeatherByGoogleAPI(lat: number, lng: number) {
  // send request to google weather api: https://weather.googleapis.com/v1/currentConditions:lookup?key=YOUR_API_KEY&location.latitude=LATITUDE&location.longitude=LONGITUDE
  const url = `https://weather.googleapis.com/v1/currentConditions:lookup?key=${GOOGLE_CLOUD_API_KEY}&location.latitude=${lat}&location.longitude=${lng}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: AbortSignal.timeout(5000), // 1000ms timeout
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error(`Error fetching weather data for [lat=${lat}, lng=${lng}]:`, error);
      throw error;
    });
}

// execute getWeatherByGoogleAPI function
getWeatherByGoogleAPI(37.7749, -122.4194)
  .then(data => {
    console.log('Weather data:', data);
  }
  )
  .catch(error => {
    console.error('Error:', error);
  }
);
