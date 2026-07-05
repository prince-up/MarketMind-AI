import { signup } from '../login/actions'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import AuthLayout from '@/components/layout/AuthLayout'
import { createClient } from '@/lib/supabase/server'

export default async function SignupPage(props: { searchParams: Promise<{ error?: string, message?: string }> }) {
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
    <AuthLayout title="Create your account" subtitle="Start researching stocks with free AI credits">
      {searchParams?.error && (
        <div className="form-error mb-6">{searchParams.error}</div>
      )}

      {searchParams?.message && (
        <div className="mb-6 p-4 bg-[var(--primary-muted)] border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] rounded-xl text-[var(--primary)] text-sm font-medium text-center">
          {searchParams.message}
        </div>
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
          formAction={signup}
          className="w-full py-3.5 mt-1 bg-[var(--primary)] text-white font-semibold rounded-xl hover:bg-[var(--primary-hover)] transition-colors shadow-sm shadow-[var(--primary)]/20"
        >
          Create account
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-[var(--text-muted)]">
        Already have an account?{' '}
        <Link href="/login" className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-semibold transition-colors">
          Log in
        </Link>
      </div>
    </AuthLayout>
  )
}
