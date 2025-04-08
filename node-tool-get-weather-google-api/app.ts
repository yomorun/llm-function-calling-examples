import fetch, { RequestInit } from 'node-fetch';
import { SocksProxyAgent } from 'socks-proxy-agent';

// env GOOGLE_CLOUD_API_KEY must be set
if (!process.env.GOOGLE_CLOUD_API_KEY) {
  throw new Error("GOOGLE_CLOUD_API_KEY is not set");
}

const GOOGLE_CLOUD_API_KEY = process.env.GOOGLE_CLOUD_API_KEY;

export const description = 'Get the current weather information for `address`'

// For jsonschema in TypeScript, see: https://github.com/YousefED/typescript-json-schema
export type Argument = {
  /**
   * The address to be queried
   */
  address: string;
}

export async function handler(args: Argument) {
  try {
    console.log(`> trigger: [${args.address}]`);
    const geo = await getGeocode(args.address);
    console.log(`  [address=${args.address}] Geocode data:`, geo);
    const weather = await getWeather(geo.lat, geo.lng);
    console.log(`  [address=${args.address}] Weather data:`, weather.timeZone);
    return {
      ok: true,
      result: weather,
    };
  } catch(error){
    console.error(`Error getting geocode for address [${args.address}] :`, error);
    return {
      ok: false,
      result: "can not get weather info for given address now, please try again later",
    };
  }
}

type GeocodeResponse = {
  results: Array<{
    geometry: {
      location: {
        lat: number;
        lng: number;
      }
    }
  }>
};

type WeatherResponse = {
  currentTime: string;
  timeZone: {
    id: string;
  };
  weatherCondition: {
    iconBaseUri: string;
    description: {
      text: string;
      languageCode: string;
    };
    type: string;
  };
  temperature: {
    degrees: number;
    unit: string;
  };
  feelsLikeTemperature: {
    degrees: number;
    unit: string;
  };
  windChill: {
    degrees: number;
    unit: string;
  };
  relativeHumidity: number;
  thunderstormProbability?: number;
  cloudCover?: number;
}


// get the lat and lng of the address by google geocoding api
export async function getGeocode(address: string) {
  return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_CLOUD_API_KEY}`, fetchOptions()).then(async response => {
      if (!response.ok) {
        throw new Error(`Geocode API error: ${response.status} ${response.statusText}`);
      }
      
      const geocode = await response.json() as GeocodeResponse;
      
      if (geocode.results.length === 0) {
        throw new Error(`No results found for address [${address}]`);
      }
      
      return {
        lat: geocode.results[0].geometry.location.lat,
        lng: geocode.results[0].geometry.location.lng,
      };
    }).catch(error => {
      console.error(`Error fetching geocode data for address [${address}]:`, error);
      throw error;
    });
}

// get the weather info by google weather api
export async function getWeather(lat: number, lng: number) {
  const url = `https://weather.googleapis.com/v1/currentConditions:lookup?key=${GOOGLE_CLOUD_API_KEY}&location.latitude=${lat}&location.longitude=${lng}`;

  return fetch(url, fetchOptions())
    .then(async response => {
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data as WeatherResponse;
    })
    .catch(error => {
      console.error(`Error fetching weather data for [lat=${lat}, lng=${lng}]:`, error);
      throw error;
    });
}

// Extended RequestInit interface to include agent property
interface ExtendedRequestInit extends RequestInit {
  agent?: SocksProxyAgent;
}

// introduce socks5 proxy if is present for dev/test env
let socksProxyAgent : SocksProxyAgent | undefined = undefined;
if (process.env.NODE_ENV !== 'production') {
  if (process.env.ALL_PROXY || process.env.all_proxy) {
    console.log(`** Using proxy: ${process.env.ALL_PROXY || process.env.all_proxy}`);
    socksProxyAgent = new SocksProxyAgent(process.env.ALL_PROXY || process.env.all_proxy as string);
  } else {
    console.log(`** No proxy being used - 'ALL_PROXY' or 'all_proxy' environment variables not found`);
  }
}

// Function to fetch options with proxy and timeout support
function fetchOptions(): ExtendedRequestInit {
  const options: ExtendedRequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: AbortSignal.timeout(3000),
  };

  if (socksProxyAgent) {
    options.agent = socksProxyAgent;
  }

  return options;
}
