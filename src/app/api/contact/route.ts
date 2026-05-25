// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendInquiryNotification } from '@/lib/email'

const schema = z.object({
  firstName:   z.string().min(1),
  lastName:    z.string().min(1),
  email:       z.string().email(),
  phone:       z.string().optional(),
  company:     z.string().optional(),
  inquiryType: z.string().min(1),
  message:     z.string().min(10),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    // Save to database
    const inquiry = await prisma.inquiry.create({
      data: {
        ...data,
        ipAddress: req.headers.get('x-forwarded-for') || req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      },
    })

    // Track analytics
    await prisma.analyticsEvent.create({
      data: { event: 'contact_submit', page: '/contact' },
    }).catch(() => {})

    // Send email notifications (non-blocking)
    sendInquiryNotification(data).catch(console.error)

    return NextResponse.json({ success: true, id: inquiry.id })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid form data', issues: err.issues }, { status: 400 })
    }
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
