// src/app/api/inquiries/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

const patchSchema = z.object({
  status: z.enum(['NEW', 'REPLIED', 'CLOSED', 'SPAM']).optional(),
  notes:  z.string().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const data = patchSchema.parse(body)
    const inquiry = await prisma.inquiry.update({
      where: { id: params.id },
      data,
    })
    return NextResponse.json(inquiry)
  } catch (err) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.inquiry.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
