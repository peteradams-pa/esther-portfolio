// src/app/admin/profile/page.tsx
import { prisma } from '@/lib/prisma'
import ProfileForm from './ProfileForm'

export const dynamic = 'force-dynamic'

export default async function AdminProfilePage() {
  const profile = await prisma.profile.findFirst()

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-sol-ink">My Profile</h1>
        <p className="text-sol-steel text-sm mt-0.5">Update your personal information and site content</p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  )
}
