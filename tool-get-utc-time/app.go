package main

import (
	"fmt"
	"time"

	"github.com/yomorun/yomo/serverless"
)

func Init() error {
	fmt.Println("sfn init")
	return nil
}

// Description defines the description of the llm function calling
func Description() string {
	return `Get current date and time in realtime, returned as UTC time string`
}

// InputSchema defines the data schema of the llm function calling
// We do not need any input data for this function calling
func InputSchema() any {
	return nil
}

// Handler will be triggered once data arrived
func Handler(ctx serverless.Context) {
	// get current time
	now := fmt.Sprintf("current UTC time is %s", time.Now().UTC().Format(time.RFC3339))
	// return to llm automatically by yomo
	ctx.WriteLLMResult(now)
}

func DataTags() []uint32 {
	return []uint32{0x62}
}
