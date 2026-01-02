import { NextRequest, NextResponse } from 'next/server'
import { turso } from '@/lib/turso'
import { checkSubscriptionRateLimit, logRateLimitViolation } from '@/lib/rate-limit'

function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, bookSlug, selectedDays, preferredHour } = body

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

    // Validate selectedDays
    const days = Array.isArray(selectedDays) ? selectedDays : [1, 3, 5]
    if (days.length === 0) {
      return NextResponse.json(
        { error: 'Selectează cel puțin o zi' },
        { status: 400 }
      )
    }

    // Validate preferredHour
    const hour = typeof preferredHour === 'number' ? preferredHour : 8

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

    // Create subscription with custom schedule
    const id = generateId()
    const now = new Date().toISOString()

    await turso.execute({
      sql: `INSERT INTO Subscription (id, email, bookSlug, frequency, status, currentFragmentIndex, preferredDays, preferredHour, createdAt, updatedAt) 
            VALUES (?, ?, ?, 'CUSTOM', 'ACTIVE', 0, ?, ?, ?, ?)`,
      args: [id, email, bookSlug, JSON.stringify(days), hour, now, now]
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
