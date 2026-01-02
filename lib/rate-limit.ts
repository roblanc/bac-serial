/**
 * Rate Limiting for BAC Serial
 * 
 * Provides protection against spam and abuse:
 * - Max subscriptions per email per day
 * - Debounce on subscription creation
 * - Email cooldown tracking
 */

import { turso } from '@/lib/turso'

interface RateLimitResult {
    allowed: boolean
    reason?: string
    retryAfter?: number // seconds
}

// Rate limit constants
const MAX_SUBSCRIPTIONS_PER_DAY = 5  // Max new subscriptions per email per day
const MIN_SUBSCRIPTION_INTERVAL = 60 // Minimum seconds between subscriptions
const MAX_EMAILS_PER_DAY = 10        // Max emails sent to one address per day

/**
 * Check if email can create a new subscription
 */
export async function checkSubscriptionRateLimit(email: string): Promise<RateLimitResult> {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

    try {
        // Check subscriptions created today by this email
        const todayResult = await turso.execute({
            sql: `SELECT COUNT(*) as count FROM Subscription WHERE email = ? AND createdAt >= ?`,
            args: [email, todayStart]
        })

        const todayCount = Number(todayResult.rows[0]?.count) || 0

        if (todayCount >= MAX_SUBSCRIPTIONS_PER_DAY) {
            return {
                allowed: false,
                reason: `Ai atins limita de ${MAX_SUBSCRIPTIONS_PER_DAY} abonări pe zi. Încearcă mâine.`,
            }
        }

        // Check last subscription time (debounce)
        const lastResult = await turso.execute({
            sql: `SELECT createdAt FROM Subscription WHERE email = ? ORDER BY createdAt DESC LIMIT 1`,
            args: [email]
        })

        if (lastResult.rows.length > 0) {
            const lastCreated = new Date(lastResult.rows[0].createdAt as string)
            const secondsSinceLast = (now.getTime() - lastCreated.getTime()) / 1000

            if (secondsSinceLast < MIN_SUBSCRIPTION_INTERVAL) {
                const retryAfter = Math.ceil(MIN_SUBSCRIPTION_INTERVAL - secondsSinceLast)
                return {
                    allowed: false,
                    reason: `Te rugăm să aștepți ${retryAfter} secunde înainte de a te abona din nou.`,
                    retryAfter,
                }
            }
        }

        return { allowed: true }
    } catch (error) {
        console.error('Rate limit check error:', error)
        // Allow on error to not block legitimate users
        return { allowed: true }
    }
}

/**
 * Check if we can send email to this address today
 */
export async function checkEmailSendRateLimit(email: string): Promise<RateLimitResult> {
    // This would require an EmailLog table to track sends
    // For now, we return allowed since Resend itself has rate limits
    return { allowed: true }
}

/**
 * Log a rate limit violation for monitoring
 */
export async function logRateLimitViolation(email: string, type: string): Promise<void> {
    console.warn(`Rate limit violation: ${type} for ${email} at ${new Date().toISOString()}`)
    // Could store in database for monitoring/blocking repeat offenders
}
