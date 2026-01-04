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

    // 1. Get Book ID
    const bookResult = await turso.execute({
      sql: 'SELECT id FROM Book WHERE slug = ?',
      args: [bookSlug]
    })

    if (bookResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Această carte nu există.' },
        { status: 404 }
      )
    }
    const bookId = bookResult.rows[0].id as string

    // 2. Get or Create User
    let userId: string
    const userResult = await turso.execute({
      sql: 'SELECT id FROM User WHERE email = ?',
      args: [email]
    })

    const now = new Date().toISOString()

    if (userResult.rows.length > 0) {
      userId = userResult.rows[0].id as string
    } else {
      userId = generateId()
      // Try to create user
      try {
        await turso.execute({
          sql: 'INSERT INTO User (id, email, createdAt, updatedAt) VALUES (?, ?, ?, ?)',
          args: [userId, email, now, now]
        })
      } catch (e) {
        // Fallback if user was created concurrently
        const retryUser = await turso.execute({
          sql: 'SELECT id FROM User WHERE email = ?',
          args: [email]
        })
        if (retryUser.rows.length > 0) {
          userId = retryUser.rows[0].id as string
        } else {
          throw e
        }
      }
    }

    // 3. Check if subscription already exists
    const existing = await turso.execute({
      sql: 'SELECT id FROM Subscription WHERE userId = ? AND bookId = ?',
      args: [userId, bookId]
    })

    if (existing.rows.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Ești deja abonat la această lectură!',
      })
    }

    // 4. Create subscription with custom schedule
    const subId = generateId()

    await turso.execute({
      sql: `INSERT INTO Subscription (id, userId, bookId, frequency, status, currentChapterIdx, preferredDays, preferredHour, createdAt, updatedAt) 
            VALUES (?, ?, ?, 'CUSTOM', 'ACTIVE', 0, ?, ?, ?, ?)`,
      args: [subId, userId, bookId, JSON.stringify(days), hour, now, now]
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
