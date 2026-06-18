export const description = 'Send email with sender, recipient, subject and body'

// For jsonschema in TypeScript, see: https://github.com/YousefED/typescript-json-schema
export type Argument = {
  /**
   * Recipient information
   */
  to: { 
    /**
     * Recipient email address
     */
    email: string; 
    /**
     * Recipient name
     */
    name: string 
  };
  /**
   * Email subject
   */
  subject: string;
  /**
   * Format of the email content
   */
  format: "text" | "html" | "template";
  /**
   * Text content of the email if format="text"
   */
  text?: string;
  /**
   * HTML content of the email if format="html"
   */
  html?: string;
  /**
   * Template ID for the email if format="template"
   */
  templateId?: string;
  /**
   * Unsubscribe group ID for compliance
   */
  unsubscribeGroupId?: string;
  /**
   * Dynamic data for template emails
   */
  dynamicData?: {
    /**
     * First name of the recipient
     */
    firstName?: string;
  }
}

export async function handler(args: Argument) {
  // set sender email address and obey the domain configuration on Autosend dashboard
  const fromEmail = process.env.AUTOSEND_FROM_EMAIL || '';
  const fromName = process.env.AUTOSEND_FROM_NAME || '';

  const body: {
    from: { email: string; name: string };
    to: { email: string; name: string };
    replyTo?: { email: string; name: string };
    subject: string;
    text?: string;
    html?: string;
    templateId?: string;
    unsubscribeGroupId?: string;
    dynamicData?: { [key: string]: any };
  } = {
    from: {
      email: fromEmail,
      name: fromName,
    },
    to: {
      email: args.to.email,
      name: args.to.name,
    },
    subject: args.subject,
  };

  if (process.env.AUTOSEND_REPLY_TO_EMAIL) {
    body.replyTo = {
      email: process.env.AUTOSEND_REPLY_TO_EMAIL,
      name: process.env.AUTOSEND_REPLY_TO_NAME || '',
    };
  }

  if (args.format === "text") {
    body.text = args.text;
  }

  if (args.format === "html") {
    body.html = args.html;
  }
  
  if (args.format === "template") {
    body.templateId = args.templateId;
    body.dynamicData = args.dynamicData;
  }

  if (args.unsubscribeGroupId) {
    body.unsubscribeGroupId = args.unsubscribeGroupId;
  }

  console.log(`[${new Date().toISOString()}] Request Body: ${JSON.stringify(body)}`);

  try{
    const data = await autosendRequest(body);
    return { success: true, data };
  } catch (ex) {
    const errorMessage = ex instanceof Error ? ex.message : String(ex);
    console.log(`[${new Date().toISOString()}] Error: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

async function autosendRequest(body: any){
  const response = await fetch("https://api.autosend.com/v1/mails/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.AUTOSEND_API_KEY}`
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  return data;
}
