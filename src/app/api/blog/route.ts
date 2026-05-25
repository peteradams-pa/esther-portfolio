// src/app/api/blog/route.ts
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
  const limit    = parseInt(searchParams.get('limit') || '12')
  const page     = parseInt(searchParams.get('page')  || '1')

  const where: any = { published: true }
  if (category && category !== 'ALL') where.category = category
  if (featured === 'true') where.featured = true

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true, slug: true, title: true, excerpt: true,
        category: true, tags: true, readTime: true,
        featured: true, publishedAt: true, viewCount: true,
        coverImage: true,
      },
    }),
    prisma.blogPost.count({ where }),
  ])

  return NextResponse.json({ posts, total, page, limit })
}

const createSchema = z.object({
  title:           z.string().min(1),
  excerpt:         z.string().optional(),
  content:         z.string().min(1),
  category:        z.enum(['COMMERCIAL_SOLAR','BATTERY_STORAGE','ENERGY_FINANCE','OFF_GRID','POLICY_MARKET','INDUSTRIAL_SOLAR','SUSTAINABILITY']),
  tags:            z.array(z.string()).default([]),
  readTime:        z.number().min(1).default(5),
  featured:        z.boolean().default(false),
  published:       z.boolean().default(false),
  publishedAt:     z.string().nullable().optional(),
  metaTitle:       z.string().optional(),
  metaDescription: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const data = createSchema.parse(body)
    const slug = slugify(data.title)

    const post = await prisma.blogPost.create({
      data: {
        ...data,
        slug,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues }, { status: 400 })
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
