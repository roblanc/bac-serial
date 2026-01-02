import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

interface FragmentMetadata {
    bookSlug: string
    title: string
    author: string
    totalFragments: number
    fragments: Array<{
        index: number
        title: string
        wordCount: number
        file: string
    }>
}

const CONTENT_DIR = path.join(process.cwd(), 'content')

async function findBookDir(bookSlug: string): Promise<string | null> {
    const genres = ['epic', 'liric', 'drama']

    for (const genre of genres) {
        const bookDir = path.join(CONTENT_DIR, genre, bookSlug.split('-')[0]) // e.g., "ion" from "ion-liviu-rebreanu"
        try {
            await fs.access(bookDir)
            return bookDir
        } catch {
            continue
        }
    }

    // Try with full slug
    for (const genre of genres) {
        const bookDir = path.join(CONTENT_DIR, genre, bookSlug)
        try {
            await fs.access(bookDir)
            return bookDir
        } catch {
            continue
        }
    }

    return null
}

export async function GET(
    request: NextRequest,
    { params }: { params: { bookSlug: string; index: string } }
) {
    try {
        const { bookSlug, index } = params
        const fragmentIndex = parseInt(index, 10)

        if (isNaN(fragmentIndex) || fragmentIndex < 1) {
            return NextResponse.json(
                { error: 'Invalid fragment index' },
                { status: 400 }
            )
        }

        const bookDir = await findBookDir(bookSlug)

        if (!bookDir) {
            return NextResponse.json(
                { error: 'Book not found' },
                { status: 404 }
            )
        }

        // Read metadata
        const metadataPath = path.join(bookDir, 'metadata.json')
        const metadataContent = await fs.readFile(metadataPath, 'utf-8')
        const metadata: FragmentMetadata = JSON.parse(metadataContent)

        if (fragmentIndex > metadata.totalFragments) {
            return NextResponse.json(
                { error: 'Fragment not found' },
                { status: 404 }
            )
        }

        // Read fragment
        const fragmentFile = `fragment-${String(fragmentIndex).padStart(3, '0')}.md`
        const fragmentPath = path.join(bookDir, fragmentFile)
        const fragmentContent = await fs.readFile(fragmentPath, 'utf-8')

        // Parse frontmatter (simple parser)
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

        return NextResponse.json({
            bookSlug: metadata.bookSlug,
            bookTitle: metadata.title,
            author: metadata.author,
            fragmentIndex,
            fragmentTitle,
            totalFragments: metadata.totalFragments,
            content,
            isLast: fragmentIndex === metadata.totalFragments,
            nextFragment: fragmentIndex < metadata.totalFragments ? fragmentIndex + 1 : null,
            prevFragment: fragmentIndex > 1 ? fragmentIndex - 1 : null
        })
    } catch (error) {
        console.error('Error fetching fragment:', error)
        return NextResponse.json(
            { error: 'Failed to fetch fragment' },
            { status: 500 }
        )
    }
}
