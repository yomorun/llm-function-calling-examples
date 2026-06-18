package main

import (
	"fmt"
	"log/slog"
	"net/smtp"
	"os"
)

// Description describes the functionality of this Function Calling
const Description = `Generate and send emails. Please provide the recipient's email address, and you should help generate appropriate subject and content. If no recipient address is provided, You should ask to add one. When you generate the subject and content, you should send it through the email sending function.`

// Arguments defines the required parameters for sending emails.
type Arguments struct {
	To      string `json:"to" jsonschema:"description=Recipient's email address,example=example@example.com"`
	Subject string `json:"subject" jsonschema:"description=Email subject"`
	Body    string `json:"body" jsonschema:"description=Email content"`
}

// Handler processes the email sending logic
func Handler(args Arguments) string {
	slog.Info("send-mail", "args", args)

	// Get email configuration from environment variables
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")
	fromEmail := os.Getenv("FROM_EMAIL")

	// Construct email content
	emailBody := fmt.Sprintf("Subject: %s\r\n\r\n%s", args.Subject, args.Body)

	// Send email
	err := smtp.SendMail(
		smtpHost+":"+smtpPort,
		nil,
		fromEmail,
		[]string{args.To},
		[]byte(emailBody),
	)

	if err != nil {
		slog.Error("Failed to send email", "error", err)
		return "Failed to send email, please try again later"
	}

	return fmt.Sprintf("Email has been successfully sent to %s", args.To)
}
