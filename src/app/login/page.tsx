import { login } from './actions'
import Link from 'next/link'
import AuthLayout from '@/components/layout/AuthLayout'

export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue your research">
      {searchParams?.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium text-center">
          {searchParams.error}
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
          formAction={login}
          className="w-full py-3 mt-1 bg-[var(--primary)] text-white font-semibold rounded-xl hover:bg-[var(--primary-hover)] transition-colors"
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
