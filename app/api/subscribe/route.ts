import { NextRequest, NextResponse } from 'next/server'
import { turso } from '@/lib/turso'
import { checkSubscriptionRateLimit, logRateLimitViolation } from '@/lib/rate-limit'

function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, bookSlug, frequency } = body

    // Validate input
    if (!email || !bookSlug) {
      return NextResponse.json(
        { error: 'Email și cartea sunt obligatorii' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Adresa de email nu este validă' },
        { status: 400 }
      )
    }

    // Rate limiting check
    const rateLimit = await checkSubscriptionRateLimit(email)
    if (!rateLimit.allowed) {
      await logRateLimitViolation(email, 'subscription')
      return NextResponse.json(
        { error: rateLimit.reason },
        {
          status: 429,
          headers: rateLimit.retryAfter
            ? { 'Retry-After': String(rateLimit.retryAfter) }
            : {}
        }
      )
    }

    // Map frequency to database value
    const frequencyMap: Record<string, string> = {
      'daily': 'DAILY',
      '3x': 'THREE_PER_WEEK',
      'weekly': 'WEEKLY',
    }
    const dbFrequency = frequencyMap[frequency] || 'THREE_PER_WEEK'

    // Check if subscription already exists
    const existing = await turso.execute({
      sql: 'SELECT id FROM Subscription WHERE email = ? AND bookSlug = ?',
      args: [email, bookSlug]
    })

    if (existing.rows.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Ești deja abonat la această lectură!',
      })
    }

    // Create subscription
    const id = generateId()
    const now = new Date().toISOString()

    await turso.execute({
      sql: `INSERT INTO Subscription (id, email, bookSlug, frequency, status, currentFragmentIndex, createdAt, updatedAt) 
            VALUES (?, ?, ?, ?, 'ACTIVE', 0, ?, ?)`,
      args: [id, email, bookSlug, dbFrequency, now, now]
    })

    return NextResponse.json({
      success: true,
      message: 'Te-ai abonat cu succes! Verifică-ți emailul pentru primul fragment.',
    })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'A apărut o eroare. Te rugăm să încerci din nou.' },
      { status: 500 }
    )
  }
}

// GET endpoint to check subscription count
export async function GET() {
  try {
    const result = await turso.execute('SELECT COUNT(*) as count FROM Subscription')
    return NextResponse.json({ count: result.rows[0].count })
  } catch (error) {
    console.error('Error fetching subscription count:', error)
    return NextResponse.json({ count: 0 })
  }
}
