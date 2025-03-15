import 'dotenv/config'

// Description outlines the functionality for the LLM Function Calling feature.
// It provides a detailed description of the function's purpose, essential for
// integration with LLM Function Calling. The presence of this function and its
// return value make the function discoverable and callable within the LLM
// ecosystem. For more information on Function Calling, refer to the OpenAI
// documentation at: https://platform.openai.com/docs/guides/function-calling
export const description = `Get current weather for a given city. If no city is provided, you 
	should ask to clarify the city. If the city name is given, you should 
	convert the city name to Latitude and Longitude geo coordinates, keeping 
	Latitude and Longitude in decimal format.`

// Argument defines the arguments for the LLM Function Calling. These
// arguments are combined to form a prompt automatically.
export type Argument = {
  city: string
  latitude: number
  longitude: number
}

async function getWeather(args: Argument) {
  console.log('city: ', args.city, 'latitude: ', args.latitude, 'longitude: ', args.longitude)
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${args.latitude}&lon=${args.longitude}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`)
    if (!response.ok) {
      return 'can not get the weather information at the moment'
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    return 'can not get the weather information at the moment'
  }
}

/**
 * 
 * Handler orchestrates the core processing logic of this function.
 * @param args - LLM Function Calling Arguments(optional).
 * @returns The result of the retrieval is returned to the LLM for processing.
 */
export async function handler(args: Argument) {
  const result = await getWeather(args)
  return result
}