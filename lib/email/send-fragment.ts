/**
 * Fragment Email Sending Service
 * 
 * Handles sending book fragments to subscribers.
 */

import { createEmailProvider } from './index'
import { createFragmentEmail } from './templates'
import { promises as fs } from 'fs'
import path from 'path'

interface SendFragmentOptions {
    email: string
    bookSlug: string
    fragmentIndex: number
}

interface FragmentData {
    bookSlug: string
    bookTitle: string
    author: string
    fragmentIndex: number
    fragmentTitle: string
    totalFragments: number
    content: string
}

async function loadFragment(bookSlug: string, fragmentIndex: number): Promise<FragmentData | null> {
    const contentDir = path.join(process.cwd(), 'content')
    const genres = ['epic', 'liric', 'drama']

    // Find book directory
    let bookDir: string | null = null
    const bookName = bookSlug.split('-')[0] // e.g., "ion" from "ion-liviu-rebreanu"

    for (const genre of genres) {
        const dir = path.join(contentDir, genre, bookName)
        try {
            await fs.access(dir)
            bookDir = dir
            break
        } catch {
            continue
        }
    }

    if (!bookDir) return null

    try {
        // Load metadata
        const metadataPath = path.join(bookDir, 'metadata.json')
        const metadataContent = await fs.readFile(metadataPath, 'utf-8')
        const metadata = JSON.parse(metadataContent)

        // Load fragment
        const fragmentFile = `fragment-${String(fragmentIndex).padStart(3, '0')}.md`
        const fragmentPath = path.join(bookDir, fragmentFile)
        const fragmentContent = await fs.readFile(fragmentPath, 'utf-8')

        // Parse frontmatter
        const frontmatterMatch = fragmentContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
        let content = fragmentContent
        let fragmentTitle = `Fragment ${fragmentIndex}`

        if (frontmatterMatch) {
            const frontmatter = frontmatterMatch[1]
            content = frontmatterMatch[2].trim()

            const titleMatch = frontmatter.match(/title:\s*"([^"]+)"/)
            if (titleMatch) {
                fragmentTitle = titleMatch[1]
            }
        }

        return {
            bookSlug: metadata.bookSlug,
            bookTitle: metadata.title,
            author: metadata.author,
            fragmentIndex,
            fragmentTitle,
            totalFragments: metadata.totalFragments,
            content,
        }
    } catch (error) {
        console.error('Error loading fragment:', error)
        return null
    }
}

export async function sendFragment(options: SendFragmentOptions): Promise<{ success: boolean; error?: string }> {
    const { email, bookSlug, fragmentIndex } = options

    // Load fragment data
    const fragment = await loadFragment(bookSlug, fragmentIndex)
    if (!fragment) {
        return { success: false, error: 'Fragment not found' }
    }

    // Generate email content
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://microlecturi.ro'}/unsubscribe?email=${encodeURIComponent(email)}&book=${bookSlug}`

    const { subject, html, text } = createFragmentEmail({
        bookTitle: fragment.bookTitle,
        author: fragment.author,
        fragmentTitle: fragment.fragmentTitle,
        fragmentIndex: fragment.fragmentIndex,
        totalFragments: fragment.totalFragments,
        content: fragment.content,
        unsubscribeUrl,
    })

    // Send email
    const provider = createEmailProvider()
    const result = await provider.send({
        to: email,
        subject,
        html,
        text,
    })

    if (!result.success) {
        console.error(`Failed to send fragment to ${email}:`, result.error)
        return { success: false, error: result.error }
    }

    console.log(`✓ Sent fragment ${fragmentIndex} of "${fragment.bookTitle}" to ${email}`)
    return { success: true }
}

// For testing
export async function sendTestEmail(email: string): Promise<{ success: boolean; error?: string }> {
    return sendFragment({
        email,
        bookSlug: 'ion-liviu-rebreanu',
        fragmentIndex: 1,
    })
}
