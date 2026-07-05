import { signup } from '../login/actions'
import Link from 'next/link'
import { UserPlus } from 'lucide-react'

export default async function SignupPage(props: { searchParams: Promise<{ error?: string, message?: string }> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-neutral-200">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 blur-3xl opacity-10 bg-emerald-500 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 mb-4">
            <UserPlus className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create an account</h1>
          <p className="text-sm text-neutral-500 mt-1">Join MarketMind AI today</p>
        </div>

        {searchParams?.error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/50 rounded-xl text-rose-400 text-sm font-semibold text-center">
            {searchParams.error}
          </div>
        )}

        {searchParams?.message && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-xl text-emerald-400 text-sm font-semibold text-center">
            {searchParams.message}
          </div>
        )}

        <form className="flex flex-col gap-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            formAction={signup}
            className="w-full py-3.5 mt-2 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 transition-colors"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-neutral-500">
          Already have an account?{' '}
          <Link href="/login" className="text-white hover:text-neutral-300 font-semibold transition-colors">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
