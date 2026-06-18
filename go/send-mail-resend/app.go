package main

import (
	"fmt"
	"log/slog"
	"os"

	"github.com/resend/resend-go/v2"
)

// Description outlines the functionality for the LLM Function Calling feature.
const Description = `Generate and send emails. Please provide the recipient's email address, and you should help generate appropriate subject and content. If no recipient address is provided, You should ask to add one. When you generate the subject and content, you should send it through the email sending function.`

var client *resend.Client

// Init is an optional function invoked during the initialization phase of the
// sfn instance. It's designed for setup tasks like global variable
// initialization, establishing database connections, or loading models into
// GPU memory. If initialization fails, the sfn instance will halt and
// terminate. This function can be omitted if no initialization tasks are
// needed.
func Init() error {
	if _, ok := os.LookupEnv("RESEND_API_KEY"); !ok {
		return fmt.Errorf("RESEND_API_KEY is not set")
	}

	client = resend.NewClient(os.Getenv("RESEND_API_KEY"))
	return nil
}

// Arguments defines the arguments for the LLM Function Calling.
type Arguments struct {
	To      string `json:"to" jsonschema:"description=The recipient's email address"`
	Subject string `json:"subject" jsonschema:"description=The subject of the email"`
	Body    string `json:"body" jsonschema:"description=The content of the email"`
}

// Handler orchestrates the core processing logic of this function
func Handler(args Arguments) string {
	result, err := sendEmail(args)
	if err != nil {
		return fmt.Sprintf("Failed to send email: %v", err)
	}

	slog.Info("send-email", "to", args.To, "result", result)
	return result
}

func sendEmail(args Arguments) (string, error) {
	slog.Info("send-email", "args", args)

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
