// src/app/api/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { event, page } = await req.json()

    await prisma.analyticsEvent.create({
      data: {
        event: event || 'page_view',
        page:  page  || '/',
        referer: req.headers.get('referer') || undefined,
      },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const event = searchParams.get('event') || 'page_view'
  const days  = parseInt(searchParams.get('days') || '30')

  const since = new Date()
  since.setDate(since.getDate() - days)

  const events = await prisma.analyticsEvent.groupBy({
    by: ['page'],
    _count: { id: true },
    where: { event, createdAt: { gte: since } },
    orderBy: { _count: { id: 'desc' } },
    take: 20,
  })

  return NextResponse.json(events)
}
