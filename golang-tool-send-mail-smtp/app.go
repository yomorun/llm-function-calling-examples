package main

import (
	"fmt"
	"log/slog"
	"net/smtp"
	"os"

	"github.com/yomorun/yomo/serverless"
)

// Description describes the functionality of this Function Calling
func Description() string {
	return `Generate and send emails. Please provide the recipient's email address, and you should help generate appropriate subject and content. If no recipient address is provided, You should ask to add one. When you generate the subject and content, you should send it through the email sending function.`
}

// Parameter defines the required parameters for sending emails
type Parameter struct {
	To      string `json:"to" jsonschema:"description=Recipient's email address,example=example@example.com"`
	Subject string `json:"subject" jsonschema:"description=Email subject"`
	Body    string `json:"body" jsonschema:"description=Email content"`
}

func InputSchema() any {
	return &Parameter{}
}

// Handler processes the email sending logic
func Handler(ctx serverless.Context) {
	var msg Parameter
	ctx.ReadLLMArguments(&msg)

	slog.Info("send-mail", "msg", msg)

	// Get email configuration from environment variables
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")
	fromEmail := os.Getenv("FROM_EMAIL")

	// Construct email content
	emailBody := fmt.Sprintf("Subject: %s\r\n\r\n%s", msg.Subject, msg.Body)

	// Send email
	err := smtp.SendMail(
		smtpHost+":"+smtpPort,
		nil,
		fromEmail,
		[]string{msg.To},
		[]byte(emailBody),
	)

	if err != nil {
		slog.Error("Failed to send email", "error", err)
		ctx.WriteLLMResult("Failed to send email, please try again later")
		return
	}

	ctx.WriteLLMResult(fmt.Sprintf("Email has been successfully sent to %s", msg.To))
}
