package main

import (
	"time"
)

// Description outlines the functionality for the LLM Function Calling feature.
// It provides a detailed description of the function's purpose, essential for
// integration with LLM Function Calling. The presence of this function and its
// return value make the function discoverable and callable within the LLM
// ecosystem. For more information on Function Calling, refer to the OpenAI
// documentation at: https://platform.openai.com/docs/guides/function-calling
const Description = `Get current date and time in realtime, returned as UTC time string`

type Result struct {
	CurrentUTC string `json:"currentUTC"`
}

// Handler orchestrates the core processing logic of this function.
func Handler() (Result, error) {
	// get current time
	now := time.Now().UTC().Format(time.RFC3339)
	return Result{CurrentUTC: now}, nil
}
