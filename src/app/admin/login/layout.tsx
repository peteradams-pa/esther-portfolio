// src/app/admin/login/layout.tsx
// Login page gets its own layout so the sidebar/topbar don't show
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
