import React, { useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import LoanCalculator from '../components/LoanCalculator';
import InvestmentVisualizer from '../components/InvestmentVisualizer';
import { products } from '../utils/products';
import { useCart } from '../store/useCart';
import { ShieldCheck, Plus, Check, FileUp, CreditCard, ArrowRight, ShoppingCart } from 'lucide-react';

export default function Home() {
  const { cartItems, addToCart, removeFromCart, cartTotal } = useCart() as any;
  const activeTab = useCart((state: any) => state.activeTab) as string;
  const [checkoutData, setCheckoutData] = useState({ name: '', email: '', idFile: null });
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success
  const [expandedInsurance, setExpandedInsurance] = useState<string | null>(null);
  const [expandedInvestment, setExpandedInvestment] = useState(false);

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('success');
    }, 2000);
  };

  const isProductInCart = (id: string) => cartItems.some((item: any) => item.id === id);

  const filteredProducts = products.filter(p => p.category === activeTab);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-blue-100 selection:text-blue-900">
      <Head>
        <title>FinPlatform - Digital Financial Freedom</title>
        <meta name="description" content="Modern, clean, and fast digital financial services." />
        <link rel="icon" href="/favicon1.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon1.svg" type="image/svg+xml" />
      </Head>

      <Navbar />

      <main className="pb-24">
        {/* HOME SECTION */}
        {activeTab === 'home' && (
          <>
            {/* HERO SECTION */}
            <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-20 pb-24 lg:pt-32 lg:pb-36 flex flex-col items-center text-center">
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 font-medium px-4 py-1.5 rounded-full text-sm mb-8 animate-fade-in-up">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span>Welcome to the future of banking</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-heading mb-6 leading-tight max-w-4xl">
                Digital Financial Freedom, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Reimagined.</span>
              </h1>

              <p className="text-xl text-slate-500 mb-10 max-w-2xl font-light">
                Experience ultra-fast onboarding. Manage insurance, loans, and investments from a single minimalist dashboard. Space to grow, engineered for speed.
              </p>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="bg-foreground hover:bg-heading text-background px-8 py-4 rounded-full font-medium text-lg transition-all shadow-lg flex items-center justify-center group">
                  Explore Products
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="bg-card-bg hover:bg-card-border text-foreground border border-card-border px-8 py-4 rounded-full font-medium text-lg transition-all flex items-center justify-center">
                  Personalize Loan
                </button>
              </div>
            </section>

            {/* LOAN CALCULATOR SECTION */}
            <section className="bg-slate-50 border-y border-slate-100 py-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-1 lg:pr-12">
                  <h2 className="text-3xl font-bold mb-6">Need extra liquidity? Calculate in seconds.</h2>
                  <p className="text-slate-500 text-lg mb-8 font-light">
                    Our innovative interactive calculator lets you simulate rates instantly without any credit checks. Move the sliders to find the perfect balance for your lifestyle.
                  </p>
                  <ul className="space-y-4 mb-8">
                    {['Instant approval simulation', 'No hidden processing fees', 'Flexible repayment terms'].map((feature, i) => (
                      <li key={i} className="flex items-center text-slate-700">
                        <ShieldCheck className="w-5 h-5 text-blue-500 mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 w-full flex justify-center lg:justify-end">
                  <LoanCalculator />
                </div>
              </div>
            </section>
          </>
        )}

        {/* PRODUCT CATALOG SECTION */}
        {activeTab !== 'home' && activeTab !== 'cart' && (
          <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                {activeTab}
              </h2>
              <p className="text-slate-500 text-lg">Build your perfect portfolio in just a few clicks.</p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg">No products available in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`group bg-card-bg border border-card-border rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden ${
                      product.id === '4' && expandedInvestment ? 'md:col-span-2 lg:col-span-3' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {product.category}
                      </span>
                      <div className="text-xl font-bold text-slate-900">
                        {product.price} <span className="text-sm font-medium text-slate-500">{product.name.includes('Account') ? 'RON/mo' : 'RON'}</span>
                      </div>
                    </div>

                    {product.id === '1' || product.id === '9' || product.id === '4' ? (
                      <button
                        onClick={() => {
                          if (product.id === '1' || product.id === '9') setExpandedInsurance(expandedInsurance === product.id ? null : product.id);
                          if (product.id === '4') setExpandedInvestment(!expandedInvestment);
                        }}
                        className="text-2xl font-bold text-heading mb-3 group-hover:text-blue-600 transition-colors text-left focus:outline-none"
                      >
                        {product.name}
                      </button>
                    ) : (
                      <h3 className="text-2xl font-bold text-heading mb-3 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                    )}
                    <p className={`text-slate-500 ${(product.id === '1' || product.id === '9') && expandedInsurance === product.id ? 'mb-4' : 'mb-8'} font-light leading-relaxed min-h-[48px]`}>
                      {product.description}
                    </p>

                    {product.id === '1' && expandedInsurance === '1' && (
                      <div className="mb-6 p-5 bg-blue-50 border border-blue-100 rounded-2xl text-blue-900 animate-fade-in-up">
                        <p className="text-sm mb-4 leading-relaxed font-medium">
                          Traveling exposes you to unforeseen risks, from sudden medical emergencies to costly flight cancellations that can ruin your budget. This insurance is an absolute necessity to ensure you are fully financially protected—do not travel without it. Secure your peace of mind and buy it now.
                        </p>
                        <button
                          onClick={() => isProductInCart(product.id) ? removeFromCart(product.id) : addToCart(product)}
                          className={`w-full py-2.5 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${isProductInCart(product.id)
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200'
                            }`}
                        >
                          {isProductInCart(product.id) ? (
                            <>
                              <Check size={18} />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus size={18} />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                    {product.id === '9' && expandedInsurance === '9' && (
                      <div className="mb-6 p-5 bg-blue-50 border border-blue-100 rounded-2xl text-blue-900 animate-fade-in-up">
                        <p className="text-sm mb-4 leading-relaxed font-medium">
                          Your home is more than just four walls; it’s where your life happens. But a single pipe burst or a storm shouldn't be allowed to wash away your hard-earned dreams. HomeGuard Elite acts as an invisible shield, covering everything from structural damage to your favorite tech. Don't leave your sanctuary vulnerable—secure your legacy today.
                        </p>
                        <button
                          onClick={() => isProductInCart(product.id) ? removeFromCart(product.id) : addToCart(product)}
                          className={`w-full py-2.5 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${isProductInCart(product.id)
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200'
                            }`}
                        >
                          {isProductInCart(product.id) ? (
                            <>
                              <Check size={18} />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus size={18} />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {product.id === '4' && expandedInvestment && (
                      <div className="mb-8 w-full animate-fade-in-up">
                        <InvestmentVisualizer />
                      </div>
                    )}

                    <button
                      onClick={() => isProductInCart(product.id) ? removeFromCart(product.id) : addToCart(product)}
                      className={`w-full py-3.5 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${isProductInCart(product.id)
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-foreground text-background hover:bg-heading'
                        }`}
                    >
                      {isProductInCart(product.id) ? (
                        <>
                          <Check size={18} />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <>
                          <Plus size={18} />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* CHECKOUT & PAYMENT SIMULATOR */}
        {activeTab === 'cart' && (
          <section id="checkout" className="py-24 bg-background border-t border-card-border">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight mb-4">Fast Checkout & eKYC</h2>
                <p className="text-slate-500 text-lg">Complete your purchase securely.</p>
              </div>

              <div className="bg-card-bg rounded-3xl p-8 shadow-[0_4px_40px_rgb(0,0,0,0.06)] border border-card-border mb-8">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-card-border rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <ShoppingCart size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">Your cart is empty</h3>
                    <p className="text-slate-500">Add products from the catalog to proceed.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Cart Summary */}
                    <div>
                      <h3 className="text-lg font-bold border-b border-slate-100 pb-4 mb-4">Order Summary</h3>
                      <ul className="space-y-3 mb-4">
                        {cartItems.map((item: any) => (
                          <li key={item.id} className="flex justify-between text-slate-700">
                            <span>{item.name}</span>
                            <span className="font-semibold">{item.price} RON</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-between items-center py-4 border-t border-slate-100 text-xl font-bold">
                        <span>Total Due</span>
                        <span className="text-blue-600">{cartTotal} RON</span>
                      </div>
                    </div>

                    {/* Checkout Form */}
                    <form onSubmit={handleSimulatePayment} className="space-y-6">
                      <h3 className="text-lg font-bold border-b border-slate-100 pb-4">Personal Details & eKYC</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                          <input
                            type="text"
                            required
                            value={checkoutData.name}
                            onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                          <input
                            type="email"
                            required
                            value={checkoutData.email}
                            onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      {/* eKYC Upload Simulator */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">ID Upload (eKYC simulator)</label>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                          <FileUp className="w-8 h-8 text-slate-400 group-hover:text-blue-500 mb-2 transition-colors" />
                          <span className="text-sm text-slate-600 font-medium">Click to upload your ID (Mock)</span>
                          <span className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</span>
                        </div>
                      </div>

                      {/* Payment Setup Simulator */}
                      <div>
                        <h3 className="text-lg font-bold border-b border-slate-100 pb-4 mt-8 mb-4">Payment Method</h3>
                        <div className="relative">
                          <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input
                            type="text"
                            disabled
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-mono tracking-widest text-lg"
                            value="4242  4242  4242  4242"
                          />
                        </div>
                        <p className="text-xs text-slate-400 mt-2 flex items-center">
                          <ShieldCheck className="w-4 h-4 mr-1 text-emerald-500" />
                          Simulated secure Stripe transaction
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={paymentStatus === 'processing' || paymentStatus === 'success'}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center ${paymentStatus === 'success'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200'
                          }`}
                      >
                        {paymentStatus === 'idle' && `Pay ${cartTotal} RON Now`}
                        {paymentStatus === 'processing' && (
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing...</span>
                          </div>
                        )}
                        {paymentStatus === 'success' && (
                          <div className="flex items-center space-x-2">
                            <Check className="w-6 h-6" />
                            <span>Payment Successful!</span>
                          </div>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
