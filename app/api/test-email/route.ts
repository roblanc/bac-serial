import { NextRequest, NextResponse } from 'next/server'
import { sendFragment } from '@/lib/email/send-fragment'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, bookSlug, fragmentIndex } = body

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            )
        }

        const result = await sendFragment({
            email,
            bookSlug: bookSlug || 'ion-liviu-rebreanu',
            fragmentIndex: fragmentIndex || 1,
        })

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Failed to send email' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: `Fragment ${fragmentIndex || 1} sent to ${email}`,
        })
    } catch (error) {
        console.error('Send fragment error:', error)
        return NextResponse.json(
            { error: 'Failed to send fragment email' },
            { status: 500 }
        )
    }
}
