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
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium text-center">
          {searchParams.error}
        </div>
      )}

      {searchParams?.message && (
        <div className="mb-6 p-4 bg-[var(--primary-muted)] border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] rounded-xl text-[var(--primary)] text-sm font-medium text-center">
          {searchParams.message}
        </div>
      )}

      <form className="flex flex-col gap-5">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-[var(--text-primary)]">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full bg-white border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-muted)] transition-all placeholder:text-[var(--text-muted)]"
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-[var(--text-primary)]">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full bg-white border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-muted)] transition-all placeholder:text-[var(--text-muted)]"
            placeholder="••••••••"
          />
        </div>

        <button
          formAction={signup}
          className="w-full py-3 mt-1 bg-[var(--primary)] text-white font-semibold rounded-xl hover:bg-[var(--primary-hover)] transition-colors"
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
