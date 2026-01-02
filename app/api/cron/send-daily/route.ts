import { NextRequest, NextResponse } from 'next/server'
import { turso } from '@/lib/turso'
import { sendFragment } from '@/lib/email/send-fragment'

// This endpoint is called by Vercel Cron twice daily
// Configured in vercel.json to run at 6:00 and 18:00 UTC (= 8:00 and 20:00 Romania time)

interface Subscription {
    id: string
    email: string
    bookSlug: string
    currentFragmentIndex: number
    preferredDays: string // JSON array like "[1,3,5]"
    preferredHour: number // 8 or 20
    status: string
}

export async function GET(request: NextRequest) {
    // Verify cron secret (security)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const now = new Date()
        const dayOfWeek = now.getDay() // 0=Sunday, 1=Monday, etc.
        const currentHour = now.getUTCHours()

        // Determine if this is morning (6 UTC = 8 Romania) or evening (18 UTC = 20 Romania) run
        // The preference stored in DB is in Romania time (8 or 20)
        const targetHour = currentHour < 12 ? 8 : 20

        // Get active subscriptions
        const result = await turso.execute(
            "SELECT id, email, bookSlug, currentFragmentIndex, preferredDays, preferredHour, status FROM Subscription WHERE status = 'ACTIVE'"
        )

        const subscriptions = result.rows as unknown as Subscription[]

        let sent = 0
        let skipped = 0
        let errors = 0

        for (const sub of subscriptions) {
            // Check if user wants emails on this day
            const preferredDays = parsePreferredDays(sub.preferredDays)
            if (!preferredDays.includes(dayOfWeek)) {
                skipped++
                continue
            }

            // Check if user wants emails at this time
            const preferredHour = sub.preferredHour || 8
            if (preferredHour !== targetHour) {
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
            date: now.toISOString(),
            targetHour,
            dayOfWeek,
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

function parsePreferredDays(daysString: string | null): number[] {
    if (!daysString) return [1, 3, 5] // Default: Mon, Wed, Fri
    try {
        const days = JSON.parse(daysString)
        return Array.isArray(days) ? days : [1, 3, 5]
    } catch {
        return [1, 3, 5]
    }
}
