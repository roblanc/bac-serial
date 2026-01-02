import { NextRequest, NextResponse } from 'next/server'
import { turso } from '@/lib/turso'
import { sendFragment } from '@/lib/email/send-fragment'

// This endpoint is called by Vercel Cron daily
// Configured in vercel.json to run at 8:00 AM UTC

interface Subscription {
    id: string
    email: string
    bookSlug: string
    currentFragmentIndex: number
    frequency: string
    status: string
}

export async function GET(request: NextRequest) {
    // Verify cron secret (security)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const today = new Date()
        const dayOfWeek = today.getDay() // 0=Sunday, 1=Monday, etc.

        // Get active subscriptions
        const result = await turso.execute(
            "SELECT id, email, bookSlug, currentFragmentIndex, frequency, status FROM Subscription WHERE status = 'ACTIVE'"
        )

        const subscriptions = result.rows as unknown as Subscription[]

        let sent = 0
        let skipped = 0
        let errors = 0

        for (const sub of subscriptions) {
            // Check frequency
            const shouldSend = checkFrequency(sub.frequency, dayOfWeek)
            if (!shouldSend) {
                skipped++
                continue
            }

            // Get current fragment index (start from 1 if not set)
            const fragmentIndex = (sub.currentFragmentIndex || 0) + 1

            try {
                // Send the next fragment
                const sendResult = await sendFragment({
                    email: sub.email,
                    bookSlug: sub.bookSlug,
                    fragmentIndex: fragmentIndex,
                })

                if (sendResult.success) {
                    // Update subscription with new fragment index
                    await turso.execute({
                        sql: 'UPDATE Subscription SET currentFragmentIndex = ?, updatedAt = ? WHERE id = ?',
                        args: [fragmentIndex, new Date().toISOString(), sub.id]
                    })
                    sent++
                    console.log(`✓ Sent fragment ${fragmentIndex} to ${sub.email}`)
                } else {
                    errors++
                    console.error(`✗ Failed to send to ${sub.email}: ${sendResult.error}`)
                }
            } catch (error) {
                errors++
                console.error(`✗ Error sending to ${sub.email}:`, error)
            }
        }

        return NextResponse.json({
            success: true,
            date: today.toISOString(),
            stats: {
                total: subscriptions.length,
                sent,
                skipped,
                errors,
            },
        })
    } catch (error) {
        console.error('Cron job error:', error)
        return NextResponse.json(
            { error: 'Cron job failed' },
            { status: 500 }
        )
    }
}

function checkFrequency(frequency: string, dayOfWeek: number): boolean {
    switch (frequency) {
        case 'DAILY':
            return true

        case 'THREE_PER_WEEK':
            // Monday, Wednesday, Friday
            return [1, 3, 5].includes(dayOfWeek)

        case 'WEEKLY':
            // Monday only
            return dayOfWeek === 1

        default:
            return false
    }
}
