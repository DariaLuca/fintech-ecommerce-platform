import React, { useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { supabase } from '../utils/supabase';
import { Landmark, Mail, Lock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [view, setView] = useState<'sign-in' | 'sign-up' | 'forgot'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (view === 'sign-up') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccessMsg('Account created! Check your email for verification before logging in.');
      } else if (view === 'sign-in') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/');
      } else if (view === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/reset-password',
        });
        if (error) throw error;
        setSuccessMsg('Password reset instructions sent to your email.');
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  // Render the appropriate heading based on view
  const getHeading = () => {
    if (view === 'sign-up') return 'Create an Account';
    if (view === 'forgot') return 'Reset Password';
    return 'Welcome Back';
  };

  const getSubTitle = () => {
    if (view === 'sign-up') return 'Join FinPlatform and secure your future.';
    if (view === 'forgot') return 'Enter your email and we will send you a reset link.';
    return 'Sign in to access your financial tools and portfolio.';
  };

  const getButtonText = () => {
    if (loading) return <Loader2 className="animate-spin mx-auto" />;
    if (view === 'sign-up') return 'Create Account';
    if (view === 'forgot') return 'Send Reset Link';
    return 'Sign In';
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-blue-600/30 font-sans flex flex-col">
      <Head>
        <title>{getHeading()} | FinPlatform</title>
      </Head>

      <Navbar />

      <main className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-card-bg border border-card-border rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mb-6 shadow-inner">
              <Landmark size={28} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-heading mb-2">{getHeading()}</h1>
            <p className="text-sm font-light text-slate-500">{getSubTitle()}</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium text-center">
              {errorMsg}
            </div>
          )}
          
          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm font-medium text-center">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-card-border rounded-xl bg-background text-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {view !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                  {view === 'sign-in' && (
                    <button type="button" onClick={() => setView('forgot')} className="text-xs font-medium text-blue-600 hover:underline">
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-card-border rounded-xl bg-background text-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {getButtonText()}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-light text-slate-500">
            {view === 'sign-in' ? (
              <p>
                Don&apos;t have an account?{' '}
                <button type="button" onClick={() => setView('sign-up')} className="font-semibold text-blue-600 hover:underline">
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Remembered your password?{' '}
                <button type="button" onClick={() => setView('sign-in')} className="font-semibold text-blue-600 hover:underline">
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
