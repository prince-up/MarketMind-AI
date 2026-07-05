import { login } from './actions'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import AuthLayout from '@/components/layout/AuthLayout'
import { createClient } from '@/lib/supabase/server'

export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  const cookieStore = await cookies()
  const hasSessionCookie = cookieStore.getAll().some(({ name }) => name.startsWith('sb-'))

  if (hasSessionCookie) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) redirect('/dashboard')
  }

  const searchParams = await props.searchParams

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue your research">
      {searchParams?.error && (
        <div className="form-error mb-6">{searchParams.error}</div>
      )}

      <form className="flex flex-col gap-5">
        <div>
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="form-input rounded-xl"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="form-input rounded-xl"
            placeholder="••••••••"
          />
        </div>

        <button
          formAction={login}
          className="w-full py-3.5 mt-1 bg-[var(--primary)] text-white font-semibold rounded-xl hover:bg-[var(--primary-hover)] transition-colors shadow-sm shadow-[var(--primary)]/20"
        >
          Log in
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-[var(--text-muted)]">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-semibold transition-colors">
          Sign up free
        </Link>
      </div>
    </AuthLayout>
  )
}
