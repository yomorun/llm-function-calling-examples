import * as dotenv from 'dotenv'
import { Resend } from 'resend'

dotenv.config()

// Description outlines the functionality for the LLM Function Calling feature
export const description = `Generate and send emails. Please provide the recipient's email address, and you should help generate appropriate subject and content. If no recipient address is provided, You should ask to add one. When you generate the subject and content, you should send it through the email sending function.`

// Define the parameter structure for the LLM Function Calling
interface Argument {
  to: string
  subject: string
  body: string
}

const resend = new Resend(process.env.RESEND_API_KEY)

async function sendEmail(args: Argument): Promise<string> {
  try {
    console.log('Sending email to:', args.to)
    await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: args.to,
      subject: args.subject,
      html: `<p>${args.body}</p>`,
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
