// src/app/api/achievements/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const achievements = await prisma.achievement.findMany({
    where: { published: true },
    orderBy: [{ featured: 'desc' }, { year: 'desc' }],
  })
  return NextResponse.json(achievements)
}

const createSchema = z.object({
  title:          z.string().min(1),
  issuer:         z.string().min(1),
  type:           z.enum(['CERTIFICATION','AWARD','TRAINING','CONFERENCE','SPEAKING','RECOGNITION']),
  year:           z.number().min(2000).max(2035),
  description:    z.string().optional(),
  certificateUrl: z.string().optional(),
  featured:       z.boolean().default(false),
  published:      z.boolean().default(true),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const data = createSchema.parse(body)
    const achievement = await prisma.achievement.create({ data })
    return NextResponse.json(achievement, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
