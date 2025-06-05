// Description outlines the functionality for the LLM Function Calling feature.
// It provides a detailed description of the function's purpose, essential for
// integration with LLM Function Calling. The presence of this function and its
// return value make the function discoverable and callable within the LLM
// ecosystem. For more information on Function Calling, refer to the OpenAI
// documentation at: https://platform.openai.com/docs/guides/function-calling
export const description = `Get current date and time in realtime, returned as UTC time string`;

export type Argument = {};

/**
 * Handler orchestrates the core processing logic of this function.
 * @returns The result of the retrieval is returned to the LLM for processing.
 */
export async function handler(args: Argument) {
  const now = `current UTC time is ${new Date().toUTCString()}`;
  console.log("utc now is: ", now);
  return now;
}