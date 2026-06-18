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

type Result struct {
	To      string `json:"to"`
	From    string `json:"from"`
	Subject string `json:"subject"`
	ID      string `json:"id"`
	Sent    bool   `json:"sent"`
}

// Handler orchestrates the core processing logic of this function
func Handler(args Arguments) (Result, error) {
	result, err := sendEmail(args)
	if err != nil {
		return Result{}, err
	}

	slog.Info("send-email", "to", args.To, "result", result)
	return result, nil
}

func sendEmail(args Arguments) (Result, error) {
	slog.Info("send-email", "args", args)

	fromEmail := os.Getenv("FROM_EMAIL")
	params := &resend.SendEmailRequest{
		From:    fromEmail,
		To:      []string{args.To},
		Subject: args.Subject,
		Html:    fmt.Sprintf("<p>%s</p>", args.Body),
	}

	resp, err := client.Emails.Send(params)
	if err != nil {
		return Result{}, fmt.Errorf("failed to send email: %w", err)
	}

	return Result{
		To:      args.To,
		From:    fromEmail,
		Subject: args.Subject,
		ID:      resp.Id,
		Sent:    true,
	}, nil
}
