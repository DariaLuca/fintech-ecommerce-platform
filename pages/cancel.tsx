import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function Cancel() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Head>
        <title>Payment Cancelled | FinPlatform</title>
      </Head>

      <Navbar />

      <main className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-card-bg border border-card-border rounded-3xl p-8 text-center shadow-xl animate-fade-in-up">
          <div className="mx-auto w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <XCircle size={40} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Payment Cancelled</h1>
          <p className="text-slate-500 mb-8 font-light">
            Your payment sequence was safely canceled. Don't worry, no charges were made and your digital cart has been saved.
          </p>
          <Link href="/" className="inline-flex items-center justify-center w-full py-4 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-all shadow-sm group border border-slate-200">
            <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Return to Checkout
          </Link>
        </div>
      </main>
    </div>
  );
}
