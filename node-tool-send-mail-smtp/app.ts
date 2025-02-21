import * as dotenv from 'dotenv'
import * as nodemailer from 'nodemailer'

dotenv.config()

// Description outlines the functionality for the LLM Function Calling feature
export const description = `Generate and send emails. Please provide the recipient's email address, and you should help generate appropriate subject and content. If no recipient address is provided, You should ask to add one. When you generate the subject and content, you should send it through the email sending function.`

// Define the parameter structure for the LLM Function Calling
interface Argument {
  to: string
  subject: string
  body: string
}

// Tag specifies the data tag that this serverless function
// subscribes to, which is essential for data reception. When data with this
// tag is received, the Handler function will be triggered.
export const tag = 0x65

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '1025'),
  secure: false,
})

async function sendEmail(args: Argument): Promise<string> {
  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: args.to,
      subject: args.subject,
      text: args.body,
    })

    return `Email has been successfully sent to ${args.to}`
  } catch (error) {
    console.error('Failed to send email:', error)
    return 'Failed to send email, please try again later'
  }
}

/**
 * Handler orchestrates the core processing logic of this function.
 * @param args - LLM Function Calling Arguments.
 * @returns The result of the email sending operation.
 */
export async function handler(args: Argument): Promise<string> {
  const result = await sendEmail(args)
  return result
}
