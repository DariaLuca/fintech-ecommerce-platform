import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      router.push('/admin');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <Head>
        <title>Admin Login - FinPlatform</title>
      </Head>

      <div className="w-full max-w-md bg-card-bg border border-card-border rounded-3xl p-8 shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-heading">Admin Access</h1>
          <p className="text-foreground text-sm mt-2 text-center">
            Restricted area. Please enter the master password to continue.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-heading mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className={`w-full px-4 py-3 rounded-xl border bg-background text-heading focus:outline-none focus:ring-2 transition-all ${
                error 
                  ? 'border-red-500 focus:ring-red-500/20' 
                  : 'border-card-border focus:ring-blue-500/20 focus:border-blue-500'
              }`}
              placeholder="••••••••"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm mt-2 font-medium">
                Incorrect password.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-md shadow-blue-200 flex items-center justify-center"
          >
            Authenticate
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-card-border text-center">
          <button 
            onClick={() => router.push('/')}
            className="text-sm font-medium text-foreground hover:text-blue-600 transition-colors"
          >
            &larr; Return to main site
          </button>
        </div>
      </div>
    </div>
  );
}
