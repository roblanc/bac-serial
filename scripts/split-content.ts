/**
 * Content Splitting Script for BAC Serial
 * 
 * This script splits prose texts into ~10 minute reading fragments (~1500 words).
 * Usage: npx ts-node scripts/split-content.ts <input-file> <output-dir>
 */

import * as fs from 'fs'
import * as path from 'path'

const WORDS_PER_FRAGMENT = 1500 // ~10 minutes reading time

interface Fragment {
    index: number
    title: string
    content: string
    wordCount: number
}

function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length
}

function splitIntoParagraphs(text: string): string[] {
    return text.split(/\n\n+/).filter(p => p.trim().length > 0)
}

function createFragments(text: string, bookTitle: string): Fragment[] {
    const paragraphs = splitIntoParagraphs(text)
    const fragments: Fragment[] = []

    let currentContent = ''
    let currentWordCount = 0
    let fragmentIndex = 1

    for (const paragraph of paragraphs) {
        const paragraphWords = countWords(paragraph)

        // If adding this paragraph exceeds limit, save current fragment
        if (currentWordCount + paragraphWords > WORDS_PER_FRAGMENT && currentContent) {
            fragments.push({
                index: fragmentIndex,
                title: `${bookTitle} - Fragment ${fragmentIndex}`,
                content: currentContent.trim(),
                wordCount: currentWordCount
            })
            fragmentIndex++
            currentContent = ''
            currentWordCount = 0
        }

        currentContent += paragraph + '\n\n'
        currentWordCount += paragraphWords
    }

    // Don't forget the last fragment
    if (currentContent.trim()) {
        fragments.push({
            index: fragmentIndex,
            title: `${bookTitle} - Fragment ${fragmentIndex}`,
            content: currentContent.trim(),
            wordCount: currentWordCount
        })
    }

    return fragments
}

function saveFragments(fragments: Fragment[], outputDir: string): void {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
    }

    // Save metadata
    const metadata = {
        totalFragments: fragments.length,
        totalWords: fragments.reduce((sum, f) => sum + f.wordCount, 0),
        fragments: fragments.map(f => ({
            index: f.index,
            title: f.title,
            wordCount: f.wordCount,
            file: `fragment-${String(f.index).padStart(3, '0')}.md`
        }))
    }

    fs.writeFileSync(
        path.join(outputDir, 'metadata.json'),
        JSON.stringify(metadata, null, 2)
    )

    // Save individual fragments
    for (const fragment of fragments) {
        const filename = `fragment-${String(fragment.index).padStart(3, '0')}.md`
        const content = `---
title: "${fragment.title}"
index: ${fragment.index}
wordCount: ${fragment.wordCount}
---

${fragment.content}
`
        fs.writeFileSync(path.join(outputDir, filename), content)
    }

    console.log(`✓ Created ${fragments.length} fragments in ${outputDir}`)
    console.log(`  Total words: ${metadata.totalWords}`)
    console.log(`  Average words per fragment: ${Math.round(metadata.totalWords / fragments.length)}`)
}

// Main execution
if (require.main === module) {
    const args = process.argv.slice(2)

    if (args.length < 2) {
        console.log('Usage: npx ts-node scripts/split-content.ts <input-file> <output-dir>')
        console.log('Example: npx ts-node scripts/split-content.ts ion-full.txt content/epic/ion')
        process.exit(1)
    }

    const [inputFile, outputDir] = args
    const bookTitle = path.basename(outputDir)

    const text = fs.readFileSync(inputFile, 'utf-8')
    const fragments = createFragments(text, bookTitle)
    saveFragments(fragments, outputDir)
}

export { createFragments, saveFragments, countWords }
