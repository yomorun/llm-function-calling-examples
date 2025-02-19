package main

import (
	"fmt"
	"log/slog"
	"os"

	"github.com/joho/godotenv"
	"github.com/resend/resend-go/v2"
	"github.com/yomorun/yomo/serverless"
)

// Description outlines the functionality for the LLM Function Calling feature.
func Description() string {
	return `This function is called when users need to send emails using Resend. You need to determine if the user's input contains complete email information (recipient, subject, content).
If the information is incomplete, you should ask for the missing information.`
}

// InputSchema defines the argument structure for LLM Function Calling
func InputSchema() any {
	return &LLMArguments{}
}

// LLMArguments defines the arguments for the LLM Function Calling
type LLMArguments struct {
	To      string `json:"to" jsonschema:"description=The recipient's email address"`
	Subject string `json:"subject" jsonschema:"description=The subject of the email"`
	Body    string `json:"body" jsonschema:"description=The content of the email"`
}

// Handler orchestrates the core processing logic of this function
func Handler(ctx serverless.Context) {
	var args LLMArguments
	ctx.ReadLLMArguments(&args)

	result, err := sendEmail(args)
	if err != nil {
		ctx.WriteLLMResult(fmt.Sprintf("Failed to send email: %v", err))
		return
	}

	ctx.WriteLLMResult(result)
	slog.Info("send-email", "to", args.To, "result", result)
}

func sendEmail(args LLMArguments) (string, error) {
	if err := godotenv.Load(); err != nil {
		slog.Warn("Error loading .env file", "error", err)
	}

	client := resend.NewClient(os.Getenv("RESEND_API_KEY"))

	params := &resend.SendEmailRequest{
		From:    os.Getenv("FROM_EMAIL"),
		To:      []string{args.To},
		Subject: args.Subject,
		Html:    fmt.Sprintf("<p>%s</p>", args.Body),
	}

	resp, err := client.Emails.Send(params)
	if err != nil {
		return "", fmt.Errorf("failed to send email: %w", err)
	}

	return fmt.Sprintf("Email has been successfully sent to %s with ID: %s", args.To, resp.Id), nil
}

// DataTags specifies the data tags to which this serverless function subscribes
func DataTags() []uint32 {
	return []uint32{0x67}
}
