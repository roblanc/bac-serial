import { Resend } from 'resend'
import { EmailProvider, EmailMessage, EmailResult } from '../index'

export class ResendProvider implements EmailProvider {
    name = 'resend'
    private client: Resend

    constructor() {
        const apiKey = process.env.RESEND_API_KEY
        if (!apiKey) {
            throw new Error('RESEND_API_KEY is not configured')
        }
        this.client = new Resend(apiKey)
    }

    async send(message: EmailMessage): Promise<EmailResult> {
        try {
            const { data, error } = await this.client.emails.send({
                from: process.env.EMAIL_FROM || 'MicroLecturi <noreply@microlecturi.ro>',
                to: message.to,
                subject: message.subject,
                html: message.html,
                text: message.text,
                reply_to: message.replyTo || process.env.EMAIL_REPLY_TO,
            })

            if (error) {
                console.error('Resend error:', error)
                return {
                    success: false,
                    error: error.message,
                }
            }

            return {
                success: true,
                messageId: data?.id,
            }
        } catch (error) {
            console.error('Resend send error:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            }
        }
    }
}
