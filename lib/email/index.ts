/**
 * Email Provider Abstraction Layer
 * 
 * This allows switching email providers without changing business logic.
 * Currently supports: Resend
 * Can be extended to: SendGrid, Mailgun, AWS SES, etc.
 */

export interface EmailMessage {
    to: string
    subject: string
    html: string
    text?: string
    replyTo?: string
}

export interface EmailResult {
    success: boolean
    messageId?: string
    error?: string
}

export interface EmailProvider {
    name: string
    send(message: EmailMessage): Promise<EmailResult>
}

// Export provider factory
export function createEmailProvider(): EmailProvider {
    const provider = process.env.EMAIL_PROVIDER || 'resend'

    switch (provider) {
        case 'resend':
            // Dynamically import to avoid issues if not configured
            const { ResendProvider } = require('./providers/resend')
            return new ResendProvider()

        // Add more providers here as needed:
        // case 'sendgrid':
        //   const { SendGridProvider } = require('./providers/sendgrid')
        //   return new SendGridProvider()

        default:
            throw new Error(`Unknown email provider: ${provider}`)
    }
}
