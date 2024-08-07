package main

import (
	"fmt"
	"time"

	"github.com/yomorun/yomo/serverless"
)

// Description outlines the functionality for the LLM Function Calling feature.
// It provides a detailed description of the function's purpose, essential for
// integration with LLM Function Calling. The presence of this function and its
// return value make the function discoverable and callable within the LLM
// ecosystem. For more information on Function Calling, refer to the OpenAI
// documentation at: https://platform.openai.com/docs/guides/function-calling
func Description() string {
	return `Get current date and time in realtime, returned as UTC time string`
}

// InputSchema defines the argument structure for LLM Function Calling. It
// utilizes jsonschema tags to detail the definition. For jsonschema in Go,
// see https://github.com/invopop/jsonschema.
func InputSchema() any {
	return nil
}

// Handler orchestrates the core processing logic of this function.
// - ctx.ReadLLMArguments() parses LLM Function Calling Arguments (skip if none).
// - ctx.WriteLLMResult() sends the retrieval result back to LLM.
func Handler(ctx serverless.Context) {
	// get current time
	now := fmt.Sprintf("current UTC time is %s", time.Now().UTC().Format(time.RFC3339))
	// return to llm automatically by yomo
	ctx.WriteLLMResult(now)
}

// DataTags specifies the data tags to which this serverless function
// subscribes, essential for data reception. Upon receiving data with these
// tags, the Handler function is triggered.
func DataTags() []uint32 {
	return []uint32{0x60}
}
