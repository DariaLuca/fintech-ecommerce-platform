import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Loader2, XCircle } from 'lucide-react';
import { useCart } from '../store/useCart';
import { useRouter } from 'next/router';

export default function Success() {
  const clearCart = useCart((state: any) => state.clearCart);
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');

  useEffect(() => {
    // Only verify when router is ready
    if (!router.isReady) return;

    const { payment_intent } = router.query;

    if (!payment_intent) {
      setStatus('failed');
      return;
    }

    fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_intent_id: payment_intent }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus('success');
          clearCart();
        } else {
          setStatus('failed');
        }
      })
      .catch(() => setStatus('failed'));
  }, [router.isReady, router.query, clearCart]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Head>
        <title>Payment Status | FinPlatform</title>
      </Head>

      <Navbar />

      <main className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-card-bg border border-card-border rounded-3xl p-8 text-center shadow-xl animate-fade-in-up">
          {status === 'verifying' && (
            <>
              <div className="mx-auto w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner animate-pulse">
                <Loader2 className="animate-spin" size={40} />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight mb-2">Verifying Payment...</h1>
              <p className="text-slate-500 font-light">
                Please wait while we confirm your transaction directly with Stripe.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <CheckCircle2 size={40} />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">Payment Successful!</h1>
              <p className="text-slate-500 mb-8 font-light">
                Thank you for your purchase. Your secure financial toolkit and policies have been activated and your transactions are securely saved in your database.
              </p>
              <Link href="/" className="inline-flex items-center justify-center w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md group">
                Return to Dashboard
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="mx-auto w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <XCircle size={40} />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">Verification Failed</h1>
              <p className="text-slate-500 mb-8 font-light">
                We could not verify your payment. It might have been canceled or processing failed.
              </p>
              <Link href="/" className="inline-flex items-center justify-center w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md">
                Return to Shop
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
