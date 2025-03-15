import 'dotenv/config'

// Description outlines the functionality for the LLM Function Calling feature.
// It provides a detailed description of the function's purpose, essential for
// integration with LLM Function Calling. The presence of this function and its
// return value make the function discoverable and callable within the LLM
// ecosystem. For more information on Function Calling, refer to the OpenAI
// documentation at: https://platform.openai.com/docs/guides/function-calling
export const description = `if user asks currency exchange rate related questions, you should call this function. But if the source currency is other than USD (US Dollar), you should ignore calling tools.`

// Argument defines the arguments for the LLM Function Calling. These
// arguments are combined to form a prompt automatically.
export type Argument = {
  sourceCurrency: string
  targetCurrency: string
  amount: number
}

async function getRate(args: Argument) {
  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.OPENEXCHANGERATES_API_KEY}/latest/USD`)
    if (!response.ok) {
      return `Failed to fetch exchange rate for ${args.targetCurrency}`
    }
    const data = await response.json()
    const rate = data.conversion_rates[args.targetCurrency]
    if (!rate) {
      return `Cannot get the target currency, target currency is ${args.targetCurrency}`
    }
    console.log('rate: ', rate)
    return rate
  } catch (error) {
    console.error(error)
    return 'can not get the target currency right now, please try later'
  }
}

/**
 * 
 * Handler orchestrates the core processing logic of this function.
 * @param args - LLM Function Calling Arguments(optional).
 * @returns The result of the retrieval is returned to the LLM for processing.
 */
export async function handler(args: Argument) {
  console.log('args', JSON.stringify(args))
  if (args.sourceCurrency !== 'USD') {
    return 'Only USD is supported as the base currency.'
  }

  const result = await getRate(args)
  return result
}