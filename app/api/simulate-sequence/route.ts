
import { NextRequest, NextResponse } from 'next/server'
import { loadFragment } from '@/lib/email/send-fragment'
import { createFragmentEmail } from '@/lib/email/templates'
import path from 'path'
import { promises as fs } from 'fs'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const bookSlug = searchParams.get('book') || 'ion-liviu-rebreanu'
    const indexParam = searchParams.get('index')
    const groupedParam = searchParams.get('group') === 'true' // If true, we show grouped emails

    // Default grouping size (3 fragments per email)
    const GROUP_SIZE = 3

    // Helper to get total fragments
    const getTotalFragments = async () => {
        try {
            const metadataPath = path.join(process.cwd(), 'content/epic', bookSlug.split('-')[0], 'metadata.json')
            const content = await fs.readFile(metadataPath, 'utf-8')
            return JSON.parse(content).totalFragments
        } catch {
            return 112 // Fallback for Ion if file not found in expected path
        }
    }

    // 1. RENDER A SPECIFIC EMAIL (Preview Content)
    if (indexParam) {
        const virtualIndex = parseInt(indexParam, 10)

        // If we are in "grouped" mode, we need to load multiple real fragments
        // E.g. Virtual Email 1 = Real Fragments 1, 2, 3
        const startFragment = (virtualIndex - 1) * GROUP_SIZE + 1
        const endFragment = startFragment + GROUP_SIZE - 1

        const fragments = []
        for (let i = startFragment; i <= endFragment; i++) {
            const f = await loadFragment(bookSlug, i)
            if (f) fragments.push(f)
        }

        if (fragments.length === 0) {
            // Instead of 404ing, generate dummy content for simulation purposes
            const dummyStart = (virtualIndex - 1) * GROUP_SIZE + 1;
            const dummyEnd = dummyStart + GROUP_SIZE - 1;

            // Create fake fragments for visualization
            for (let i = dummyStart; i <= Math.min(dummyEnd, await getTotalFragments()); i++) {
                fragments.push({
                    bookTitle: 'Ion (Simulare)',
                    author: 'Liviu Rebreanu',
                    fragmentTitle: `Capitol Simulat ${i}`,
                    fragmentIndex: i,
                    totalFragments: 112,
                    content: `[Acesta este un conținut simulat pentru Fragmentul ${i}. Fișierul real 'fragment-${String(i).padStart(3, '0')}.md' nu există încă pe disk]\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
                });
            }
        }

        const firstFrag = fragments[0]
        const totalRealFrags = await getTotalFragments()
        const totalVirtualEmails = Math.ceil(totalRealFrags / GROUP_SIZE)

        // Combine content
        let combinedContent = fragments.map((f, i) => {
            if (i === 0) return f.content
            return `\n\n---\n*Continuare (Partea ${i + 1}/${fragments.length})*\n---\n\n${f.content}`
        }).join('')

        // If we don't have enough fragments (e.g. simulation only has 5), add placeholder text
        if (fragments.length < GROUP_SIZE && startFragment + fragments.length <= totalRealFrags) {
            combinedContent += `\n\n--- \n⚠️ *Notă Simulare: Fragmentele ${startFragment + fragments.length} - ${endFragment} nu există local, dar ar fi incluse aici.*`
        }

        const totalWords = combinedContent.split(/\s+/).length
        const estTime = Math.ceil(totalWords / 200)

        const { html } = createFragmentEmail({
            bookTitle: firstFrag.bookTitle,
            author: firstFrag.author,
            fragmentTitle: `Email ${virtualIndex}: Capitolele ${startFragment}-${Math.min(endFragment, totalRealFrags)}`,
            fragmentIndex: virtualIndex,
            totalFragments: totalVirtualEmails,
            content: combinedContent,
            unsubscribeUrl: 'https://example.com/unsubscribe'
        })

        const modifiedHtml = html.replace('<body>', `<body>
            <div style="background: #e6fffa; color: #234e52; padding: 15px; text-align: center; font-family: sans-serif; border-bottom: 1px solid #b2f5ea;">
                <strong>SIMULARE EMAIL ${virtualIndex}/${totalVirtualEmails}</strong><br/>
                Conține fragmentele reale: ${startFragment} - ${Math.min(endFragment, totalRealFrags)}<br/>
                Lungime: ~${totalWords} cuvinte (${estTime} min)
            </div>`)

        return new NextResponse(modifiedHtml, { headers: { 'Content-Type': 'text/html' } })
    }

    // 2. RENDER THE LIST OF ALL EMAILS
    const totalFragments = await getTotalFragments()
    const totalEmails = Math.ceil(totalFragments / GROUP_SIZE)

    const listItems = Array.from({ length: totalEmails }, (_, i) => i + 1).map(i => {
        const start = (i - 1) * GROUP_SIZE + 1
        const end = Math.min(start + GROUP_SIZE - 1, totalFragments)
        return `
            <li>
                <a href="?book=${bookSlug}&index=${i}&group=true" target="_blank" class="email-link">
                    <span class="email-number">✉️ Email ${i}</span>
                    <span class="email-details">(Fragmentele ${start} - ${end})</span>
                </a>
            </li>`
    }).join('')

    const page = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Planificare Emailuri - ${bookSlug}</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; background: #f8f9fa; color: #333; }
            h1 { color: #111; border-bottom: 2px solid #ddd; padding-bottom: 15px; }
            
            .summary-card {
                background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 30px;
                display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;
            }
            .stat { text-align: center; }
            .stat-value { display: block; font-size: 24px; font-weight: bold; color: #2563eb; }
            .stat-label { font-size: 13px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }

            ul { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; }
            li { background: white; border: 1px solid #e5e7eb; border-radius: 6px; transition: all 0.2s; }
            li:hover { transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border-color: #2563eb; }
            
            .email-link { display: block; padding: 15px; text-decoration: none; color: inherit; }
            .email-number { display: block; font-weight: 600; color: #111; margin-bottom: 4px; }
            .email-details { display: block; font-size: 14px; color: #6b7280; }
        </style>
    </head>
    <body>
        <h1>Simulare Planificare: ${bookSlug}</h1>
        
        <div class="summary-card">
            <div class="stat">
                <span class="stat-value">${totalFragments}</span>
                <span class="stat-label">Total Fragmente Originale</span>
            </div>
            <div class="stat">
                <span class="stat-value">3</span>
                <span class="stat-label">Fragmente / Email</span>
            </div>
            <div class="stat">
                <span class="stat-value">${totalEmails}</span>
                <span class="stat-label">Total Emailuri de trimis</span>
            </div>
        </div>

        <p style="margin-bottom: 20px; color: #555;">
            Mai jos este lista completă a emailurilor pe care un abonat le va primi. 
            Click pe un email pentru a vedea cum arată conținutul (combinat).
        </p>

        <ul>
            ${listItems}
        </ul>
    </body>
    </html>
    `

    return new NextResponse(page, { headers: { 'Content-Type': 'text/html' } })
}
