
// check if the environment variable is set
if (!process.env.GOOGLE_CLOUD_API_KEY) {
  throw new Error("GOOGLE_CLOUD_API_KEY is not set");
}

const GOOGLE_CLOUD_API_KEY = process.env.GOOGLE_CLOUD_API_KEY;

// Remove unused variable
// const googleMapsClient = new GoogleMapsService({});

export const description = 'Get the current weather information for `address`'

// For jsonschema in TypeScript, see: https://github.com/YousefED/typescript-json-schema
export type Argument = {
  /**
   * The address to be queried
   */
  address: string;
}

async function getGeocode(address: string) {
  // get the lat and lng of the address by google geocoding api
  return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_CLOUD_API_KEY}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000), // 5000ms timeout
    }).then(async response => {
      if (!response.ok) {
        throw new Error(`Geocode API error: ${response.status} ${response.statusText}`);
      }
      
      const geocode = await response.json();
      
      if (geocode.results.length === 0) {
        throw new Error(`No results found for address [${address}]`);
      }
      
      return {
        ok: true,
        lat: geocode.results[0].geometry.location.lat,
        lng: geocode.results[0].geometry.location.lng,
      };
    }).catch(error => {
      console.error(`Error fetching geocode data for address [${address}]:`, error);
      throw error;
    });
}

export async function handler(args: Argument) {
  try {
    console.log(`> Getting weather info for address [${args.address}]`);
    const geo = await getGeocode(args.address);
    console.log(`> [address=${args.address}] Geocode data:`, geo);
    const weather = await getWeatherByGoogleAPI(geo.lat, geo.lng);
    console.log(`> [address=${args.address}] Weather data:`, weather);
    return {
      ok: true,
      result: weather,
    };
  } catch(error){
    console.error(`Error getting geocode for address [${args.address}] :`, error);
    return {
      ok: false,
      result: "can not get weather info for giving address now, please try again later",
    };
  }
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

// getGeocode('beijing')
//   .then(data => {
//     console.log('Geocode data:', data);
//     getWeatherByGoogleAPI(data.lat, data.lng)
//     .then(data => {
//       console.log('Weather data:', data);
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });
