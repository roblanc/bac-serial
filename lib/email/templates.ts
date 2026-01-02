/**
 * Email Templates for MicroLecturi
 */

interface FragmentEmailData {
    recipientName?: string
    bookTitle: string
    author: string
    fragmentTitle: string
    fragmentIndex: number
    totalFragments: number
    content: string
    unsubscribeUrl: string
}

export function createFragmentEmail(data: FragmentEmailData): { subject: string; html: string; text: string } {
    const progress = Math.round((data.fragmentIndex / data.totalFragments) * 100)

    const subject = `📚 ${data.bookTitle} - ${data.fragmentTitle}`

    const html = `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.fragmentTitle}</title>
  <style>
    body {
      font-family: 'Georgia', serif;
      line-height: 1.8;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fafafa;
      color: #333;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 2px solid #e5e5e5;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #1a1a1a;
    }
    .progress-bar {
      background-color: #e5e5e5;
      border-radius: 10px;
      height: 8px;
      margin: 15px 0;
    }
    .progress-fill {
      background-color: #ef4444;
      height: 100%;
      border-radius: 10px;
      width: ${progress}%;
    }
    .progress-text {
      font-size: 12px;
      color: #666;
      text-align: center;
    }
    .book-info {
      background-color: #fff;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      border-left: 4px solid #ef4444;
    }
    .book-title {
      font-size: 18px;
      font-weight: bold;
      margin: 0 0 5px 0;
    }
    .book-author {
      color: #666;
      margin: 0;
    }
    .fragment-title {
      font-size: 20px;
      font-weight: bold;
      margin: 30px 0 20px 0;
      color: #1a1a1a;
    }
    .content {
      background-color: #fff;
      padding: 30px;
      border-radius: 8px;
      white-space: pre-wrap;
    }
    .content p {
      margin: 0 0 1.5em 0;
      text-align: justify;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
    .unsubscribe {
      color: #999;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">📚 MicroLecturi</div>
  </div>
  
  <div class="book-info">
    <p class="book-title">${data.bookTitle}</p>
    <p class="book-author">de ${data.author}</p>
  </div>
  
  <div class="progress-bar">
    <div class="progress-fill"></div>
  </div>
  <p class="progress-text">Fragment ${data.fragmentIndex} din ${data.totalFragments} (${progress}% completat)</p>
  
  <h2 class="fragment-title">${data.fragmentTitle}</h2>
  
  <div class="content">
    ${formatContentToHtml(data.content)}
  </div>
  
  <div class="footer">
    <p>Citești pentru BAC direct pe mail 🚀</p>
    <p>Următorul fragment vine mâine!</p>
    <p><a href="${data.unsubscribeUrl}" class="unsubscribe">Dezabonare</a></p>
  </div>
</body>
</html>
`

    const text = `
${data.bookTitle} de ${data.author}
Fragment ${data.fragmentIndex} din ${data.totalFragments}

${data.fragmentTitle}

${data.content}

---
MicroLecturi - Citești pentru BAC direct pe mail
Dezabonare: ${data.unsubscribeUrl}
`

    return { subject, html, text }
}

function formatContentToHtml(content: string): string {
    // Convert markdown-style content to HTML paragraphs
    return content
        .split('\n\n')
        .filter(p => p.trim())
        .map(p => {
            // Handle headers
            if (p.startsWith('# ')) {
                return `<h1>${p.slice(2)}</h1>`
            }
            if (p.startsWith('## ')) {
                return `<h2>${p.slice(3)}</h2>`
            }
            // Handle italic markers
            let processed = p.replace(/\*([^*]+)\*/g, '<em>$1</em>')
            return `<p>${processed}</p>`
        })
        .join('\n')
}
