package main

import (
	"fmt"
	"log"
	"log/slog"
	"os"

	"github.com/joho/godotenv"
	"github.com/resend/resend-go/v2"
	"github.com/yomorun/yomo/serverless"
)

// Description outlines the functionality for the LLM Function Calling feature.
func Description() string {
	return `Generate and send emails. Please provide the recipient's email address, and you should help generate appropriate subject and content. If no recipient address is provided, You should ask to add one. When you generate the subject and content, you should send it through the email sending function.`
}

// InputSchema defines the argument structure for LLM Function Calling
func InputSchema() any {
	return &Parameter{}
}

var client *resend.Client

// Init is an optional function invoked during the initialization phase of the
// sfn instance. It's designed for setup tasks like global variable
// initialization, establishing database connections, or loading models into
// GPU memory. If initialization fails, the sfn instance will halt and
// terminate. This function can be omitted if no initialization tasks are
// needed.
func Init() error {
	if _, ok := os.LookupEnv("RESEND_API_KEY"); !ok {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("You have to set RESEND_API_KEY in ENV or .env file")
			os.Exit(-1)
		}
	}

	client = resend.NewClient(os.Getenv("RESEND_API_KEY"))
	return nil
}

// Parameter defines the arguments for the LLM Function Calling
type Parameter struct {
	To      string `json:"to" jsonschema:"description=The recipient's email address"`
	Subject string `json:"subject" jsonschema:"description=The subject of the email"`
	Body    string `json:"body" jsonschema:"description=The content of the email"`
}

// Handler orchestrates the core processing logic of this function
func Handler(ctx serverless.Context) {
	var args Parameter
	ctx.ReadLLMArguments(&args)

	result, err := sendEmail(args)
	if err != nil {
		ctx.WriteLLMResult(fmt.Sprintf("Failed to send email: %v", err))
		return
	}

	ctx.WriteLLMResult(result)
	slog.Info("send-email", "to", args.To, "result", result)
}

func sendEmail(args Parameter) (string, error) {
	if err := godotenv.Load(); err != nil {
		slog.Warn("Error loading .env file", "error", err)
	}

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

// DataTags specifies the data tags to which this serverless function subscribes
func DataTags() []uint32 {
	return []uint32{0x67}
}
