import 'dotenv/config'

// Description outlines the functionality for the LLM Function Calling feature.
// It provides a detailed description of the function's purpose, essential for
// integration with LLM Function Calling. The presence of this function and its
// return value make the function discoverable and callable within the LLM
// ecosystem. For more information on Function Calling, refer to the OpenAI
// documentation at: https://platform.openai.com/docs/guides/function-calling
export const description = `if user asks currency exchange rate related questions, you should call this function. Keep in mind that the SourceCurrency should be always USD.`

// Argument defines the arguments for the LLM Function Calling. These
// arguments are combined to form a prompt automatically.
export type Argument = {
  sourceCurrency: string
  targetCurrency: string
}

async function getRate(args: Argument) {
  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.OPENEXCHANGERATES_API_KEY}/latest/USD`)
    const data = await response.json()
    if (!response.ok) {
      return `can not get the exchange rate right now, please try again later`
    }
    const rate = data.conversion_rates[args.targetCurrency]
    if (!rate) {
      return `can not get the exchange rate right now, please try again later`
    }
    console.log(`\t< USD to ${args.targetCurrency} rate: ${rate}`)
    return rate
  } catch (error) {
    console.error(error)
    return 'can not get the exchange rate right now, please try again later'
  }
}

/**
 * 
 * Handler orchestrates the core processing logic of this function.
 * @param args - LLM Function Calling Arguments(optional).
 * @returns The result of the retrieval is returned to the LLM for processing.
 */
export async function handler(args: Argument) {
  console.log('> args', JSON.stringify(args))
  // warning: the free account of openexchangerates.org only supports USD as the base currency, as
  // we told LLM to always use USD as the base currency in the `description` above, but we still 
  // have to check it here to avoid any unexpected llm response.
  if (args.sourceCurrency !== 'USD') {
    return 'can not get the exchange rate, the base currency must be USD'
  }

  const result = await getRate(args)
  return result
}