// src/app/api/testimonials/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const featured = searchParams.get('featured')

  const where: any = { published: true }
  if (featured === 'true') where.featured = true

  const testimonials = await prisma.testimonial.findMany({
    where,
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
  })

  return NextResponse.json(testimonials)
}

const createSchema = z.object({
  name:        z.string().min(1),
  role:        z.string().min(1),
  company:     z.string().optional(),
  text:        z.string().min(10),
  rating:      z.number().min(1).max(5).default(5),
  featured:    z.boolean().default(false),
  published:   z.boolean().default(true),
  linkedinUrl: z.string().optional(),
  projectId:   z.string().optional(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const data = createSchema.parse(body)
    const testimonial = await prisma.testimonial.create({ data })
    return NextResponse.json(testimonial, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
