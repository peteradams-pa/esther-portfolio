// src/app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { slugify } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')

  const where: any = { published: true }
  if (category && category !== 'ALL') where.category = category
  if (featured === 'true') where.featured = true

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { completionDate: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.project.count({ where }),
  ])

  return NextResponse.json({ projects, total, page, limit })
}

const createSchema = z.object({
  title:         z.string().min(1),
  category:      z.enum(['COMMERCIAL', 'RESIDENTIAL', 'INDUSTRIAL', 'OFF_GRID', 'HYBRID', 'ENERGY_AUDIT']),
  location:      z.string().min(1),
  capacity:      z.string().min(1),
  clientType:    z.string().min(1),
  role:          z.string().min(1),
  completionDate: z.string(),
  featured:      z.boolean().default(false),
  published:     z.boolean().default(false),
  description:   z.string().min(1),
  challenge:     z.string().optional(),
  solution:      z.string().optional(),
  technologies:  z.array(z.string()).default([]),
  tags:          z.array(z.string()).default([]),
  metrics:       z.array(z.object({ value: z.string(), label: z.string() })).default([]),
  roi:           z.string().optional(),
  paybackPeriod: z.string().optional(),
  annualSavings: z.string().optional(),
  co2Avoided:   z.string().optional(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const data = createSchema.parse(body)
    const slug = slugify(data.title)

    const project = await prisma.project.create({
      data: {
        ...data,
        slug,
        completionDate: new Date(data.completionDate),
        metrics: data.metrics as any,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues }, { status: 400 })
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
