// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const profile = await prisma.profile.findFirst()
  return NextResponse.json(profile)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json()
  const profile = await prisma.profile.upsert({
    where: { id: 'main-profile' },
    update: data,
    create: { id: 'main-profile', ...data },
  })
  return NextResponse.json(profile)
}
