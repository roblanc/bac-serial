import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailParams {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'BAC Serial <lecturi@bacserial.ro>',
      to: [to],
      subject,
      html,
      text,
    })

    if (error) {
      console.error('Resend error:', error)
      throw new Error(error.message)
    }

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('Email sending failed:', error)
    throw error
  }
}

interface ChapterEmailParams {
  to: string
  bookTitle: string
  bookAuthor: string
  chapterTitle: string
  chapterNumber: number
  totalChapters: number
  content: string
  notes?: string
  readingTime: number
  settingsUrl: string
  nextChapterUrl: string
}

export function generateChapterEmail({
  bookTitle,
  bookAuthor,
  chapterTitle,
  chapterNumber,
  totalChapters,
  content,
  notes,
  readingTime,
  settingsUrl,
  nextChapterUrl,
}: ChapterEmailParams): string {
  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${bookTitle} - ${chapterTitle}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fdfcfb; font-family: Georgia, 'Times New Roman', serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e9dfd0;">
      <h1 style="margin: 0 0 5px; font-size: 24px; color: #1a1a1a; font-weight: 600;">
        ${bookTitle}
      </h1>
      <p style="margin: 0; color: #6d6d6d; font-size: 14px;">
        de ${bookAuthor} • Email ${chapterNumber} din ${totalChapters}
      </p>
    </div>

    <!-- Reading Time -->
    <div style="text-align: center; margin-bottom: 30px;">
      <span style="display: inline-block; padding: 8px 16px; background-color: #fef7ed; color: #d95a0d; border-radius: 20px; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        ⏱️ ${readingTime} minute de citit
      </span>
    </div>

    <!-- Chapter Title -->
    ${chapterTitle ? `
    <h2 style="margin: 0 0 25px; font-size: 20px; color: #1a1a1a; font-weight: 600; text-align: center;">
      ${chapterTitle}
    </h2>
    ` : ''}

    <!-- Content -->
    <div style="font-size: 17px; line-height: 1.8; color: #454545;">
      ${content}
    </div>

    ${notes ? `
    <!-- Notes -->
    <div style="margin-top: 30px; padding: 20px; background-color: #f9f6f2; border-left: 4px solid #e87516; border-radius: 4px;">
      <p style="margin: 0 0 10px; font-size: 13px; color: #d95a0d; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">
        📝 Note și comentarii
      </p>
      <div style="font-size: 15px; line-height: 1.7; color: #5d5d5d;">
        ${notes}
      </div>
    </div>
    ` : ''}

    <!-- Actions -->
    <div style="margin-top: 40px; text-align: center;">
      <a href="${nextChapterUrl}" style="display: inline-block; padding: 14px 32px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 500;">
        Trimite-mi următorul fragment →
      </a>
    </div>

    <!-- Footer -->
    <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #e9dfd0; text-align: center;">
      <p style="margin: 0 0 10px; font-size: 13px; color: #888888; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <a href="${settingsUrl}" style="color: #d95a0d; text-decoration: none;">Setări</a> •
        <a href="${settingsUrl}?action=pause" style="color: #d95a0d; text-decoration: none;">Pauză</a> •
        <a href="${settingsUrl}?action=unsubscribe" style="color: #d95a0d; text-decoration: none;">Dezabonare</a>
      </p>
      <p style="margin: 0; font-size: 12px; color: #b0b0b0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        BAC Serial • Lecturi pentru Bacalaureat
      </p>
    </div>

  </div>
</body>
</html>
  `
}

export function generateWelcomeEmail(bookTitle: string, bookAuthor: string): string {
  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bine ai venit la BAC Serial!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fdfcfb; font-family: Georgia, 'Times New Roman', serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="margin: 0 0 20px; font-size: 28px; color: #1a1a1a; font-weight: 600;">
        🎉 Te-ai abonat cu succes!
      </h1>
      <p style="margin: 0; font-size: 18px; color: #5d5d5d; line-height: 1.6;">
        Ai început lectura operei <strong>${bookTitle}</strong> de ${bookAuthor}.
      </p>
    </div>

    <div style="padding: 25px; background-color: #f9f6f2; border-radius: 8px; margin-bottom: 30px;">
      <h2 style="margin: 0 0 15px; font-size: 18px; color: #1a1a1a;">Ce urmează?</h2>
      <ul style="margin: 0; padding-left: 20px; color: #5d5d5d; line-height: 1.8;">
        <li>Vei primi primul fragment în câteva minute</li>
        <li>Emailurile vor veni de 3 ori pe săptămână (luni, miercuri, vineri)</li>
        <li>Fiecare email îți va lua aproximativ 10 minute să-l citești</li>
        <li>Poți schimba frecvența sau pune pe pauză oricând</li>
      </ul>
    </div>

    <p style="font-size: 16px; color: #6d6d6d; line-height: 1.7; text-align: center;">
      Mult succes la lectură și la Bacalaureat! 📚
    </p>

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e9dfd0; text-align: center;">
      <p style="margin: 0; font-size: 12px; color: #b0b0b0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        BAC Serial • Lecturi pentru Bacalaureat
      </p>
    </div>

  </div>
</body>
</html>
  `
}
