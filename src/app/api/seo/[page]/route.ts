// src/app/api/seo/[page]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: { page: string } }) {
  const seo = await prisma.pageSeo.findUnique({ where: { page: params.page } })
  return NextResponse.json(seo || {})
}

export async function PUT(req: NextRequest, { params }: { params: { page: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, description, keywords } = await req.json()

  const seo = await prisma.pageSeo.upsert({
    where:  { page: params.page },
    update: { title, description, keywords },
    create: { page: params.page, title, description, keywords },
  })

  return NextResponse.json(seo)
}
