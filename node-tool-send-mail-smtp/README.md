# LLM Function Calling - Send Email with SMTP

This is a serverless function for sending emails with SMTP.

## Prerequisites

### 1. Environment Variables

```sh
YOMO_SFN_NAME=my_first_llm_function_tool
YOMO_SFN_ZIPPER=zipper.vivgrid.com:9000
YOMO_SFN_CREDENTIAL=<your-yomo-sfn-credential>
```

You can find other environment variables in the serverless page of [vivgrid dashboard](https://dashboard.vivgrid.com/).

## Development

### 1. Install YoMo CLI

```bash
curl -fsSL https://get.yomo.run | sh
```

For detailed CLI usage, check [Doc: YoMo CLI](https://yomo.run/docs/cli).

### 2. Start Mail Development Server

```bash
docker run -p 1080:1080 -p 1025:1025 maildev/maildev
```

### 3. Add Environment Variables

Add the following environment variables to your `.env` file:

```bash
SMTP_HOST=localhost
SMTP_PORT=1025
FROM_EMAIL=hello@example.com
```

### 4. Test the Function

You can test the email sending functionality with the following curl command:

```bash
curl --request POST \
  --url https://api.vivgrid.com/v1/chat/completions \
  --header 'Authorization: Bearer <token>' \
  --header 'content-type: application/json' \
  --data '{
  "messages": [
    {
      "role": "assistant",
      "content": "send an email to mark@example.com, tell him I will attend the meeting"
    }
  ]
}'
```

### 4. Connect this Function to Your LLM Bridge

```bash
yomo run app.ts -n my_first_llm_function_tool
```

## Web Interface

After starting the mail development server, you can access the web interface at `http://localhost:1080` to view sent emails.
