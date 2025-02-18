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
	return `This function is called when users need to send emails. You need to determine if the user's input contains complete email information (recipient, subject, content).
	If the information is incomplete, you should ask for the missing information.`
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

// DataTags specifies the data tags to which this serverless function
// subscribes, essential for data reception. Upon receiving data with these
// tags, the Handler function is triggered.
func DataTags() []uint32 {
	return []uint32{0x65}
}
