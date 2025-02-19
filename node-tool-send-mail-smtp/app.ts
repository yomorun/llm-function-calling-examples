import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';

dotenv.config();

// Description outlines the functionality for the LLM Function Calling feature
export const description = `This function is called when users need to send emails. You need to determine if the user's input contains complete email information (recipient, subject, content).
If the information is incomplete, you should ask for the missing information.`;

// Define the parameter structure for the LLM Function Calling
interface Argument {
  to: string;
  subject: string;
  body: string;
}

// Tag specifies the data tag that this serverless function
// subscribes to, which is essential for data reception. When data with this
// tag is received, the Handler function will be triggered.
export const tag = 0x65;

async function sendEmail(args: Argument): Promise<string> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '1025'),
      secure: false,
    });

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: args.to,
      subject: args.subject,
      text: args.body,
    });

    return `Email has been successfully sent to ${args.to}`;
  } catch (error) {
    console.error('Failed to send email:', error);
    return 'Failed to send email, please try again later';
  }
}

/**
 * Handler orchestrates the core processing logic of this function.
 * @param args - LLM Function Calling Arguments.
 * @returns The result of the email sending operation.
 */
export async function handler(args: Argument): Promise<string> {
  const result = await sendEmail(args);
  return result;
}