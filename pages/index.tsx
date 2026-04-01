import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import LoanCalculator from '../components/LoanCalculator';
import InvestmentVisualizer from '../components/InvestmentVisualizer';
import { supabase } from '../utils/supabase';
import { useCart } from '../store/useCart';
import { ArrowRight, FileUp, CheckCircle, Smartphone, Plus, ShieldCheck, X, ShoppingCart, PieChart } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = ({ cartTotal, cartItems, paymentStatus, setPaymentStatus, checkoutData, intentId }: any) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!checkoutData.name || !checkoutData.email) {
      setErrorMessage("Please fill in your Full Name and Email Address first.");
      return;
    }

    setPaymentStatus('processing');
    setErrorMessage(null);

    try {
      const response = await fetch('/api/save-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intentId,
          customerName: checkoutData.name,
          customerEmail: checkoutData.email,
          items: cartItems,
          totalAmount: cartTotal
        })
      });
      if (!response.ok) throw new Error("Order synchronization failed");
    } catch (err: any) {
      setErrorMessage("Failed to prepare order: " + err.message);
      setPaymentStatus('idle');
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error) {
      setErrorMessage(error.message as string);
      setPaymentStatus('idle');
    }
  };

  return (
    <>
      <div className="mt-8 mb-4">
        <h3 className="text-lg font-bold border-b border-slate-100 pb-4">Payment Method</h3>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 font-sans">
        <PaymentElement />
      </div>
      {errorMessage && <div className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg border border-red-100">{errorMessage}</div>}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!stripe || paymentStatus === 'processing'}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center ${paymentStatus === 'success'
          ? 'bg-emerald-500 text-white'
          : 'bg-[#9E6E45] hover:bg-[#8A5F3B] text-white shadow-lg'
          }`}
      >
        {paymentStatus === 'processing' ? 'Processing...' : `Pay ${cartTotal} EUR Now`}
      </button>
    </>
  );
};

export default function Home() {
  const { cartItems, addToCart, removeFromCart, cartTotal } = useCart() as any;
  const activeTab = useCart((state: any) => state.activeTab) as string;
  const [checkoutData, setCheckoutData] = useState({ name: '', email: '', idFile: null });
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success
  const [expandedInsurance, setExpandedInsurance] = useState<string | null>(null);
  const [expandedInvestment, setExpandedInvestment] = useState<string | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (data) {
        setProducts(data);
      }
      setLoadingProducts(false);
    };
    fetchProducts();
  }, []);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [intentId, setIntentId] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'cart' && cartItems.length > 0) {
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems }),
      })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setIntentId(data.intentId);
      });
    }
  }, [activeTab, cartItems]);

  const isProductInCart = (id: string) => cartItems.some((item: any) => item.id === id);

  const filteredProducts = products.filter(p => p.category === activeTab);

  const getExtendedDescription = (id: string) => {
    switch (id) {
      case '1': return "Traveling exposes you to unforeseen risks, from sudden medical emergencies to costly flight cancellations that can ruin your budget. This insurance is an absolute necessity to ensure you are fully financially protected—do not travel without it. Secure your peace of mind and buy it now.";
      case '9': return "Your home is more than just four walls; it’s where your life happens. But a single pipe burst or a storm shouldn't be allowed to wash away your hard-earned dreams. HomeGuard Elite acts as an invisible shield, covering everything from structural damage to your favorite tech. Don't leave your sanctuary vulnerable—secure your legacy today.";
      case '10': return "Your furry companions are family, and they deserve the best care without compromise. This full-coverage plan ensures your pet receives top-tier veterinary attention for accidents, unexpected illnesses, surgical procedures, and essential medications. Don't let veterinary costs dictate your pet's well-being—secure their happy, healthy future and get the peace of mind you both deserve.";
      case '11': return "Tailored specifically for the university lifestyle, this all-in-one plan provides essential student-focused protection. It covers dental and vision emergencies, counseling and mental health services, and protects your personal property—like laptops and specialized gear—from theft in dorms. Navigate your academic journey with confidence and financial stability, knowing you have a dedicated safety net.";
      case '12': return "The open road is calling, but traffic and weather don't always play fair. Whether it's a stray shopping cart in a parking lot or a sudden hail storm, Casco Plus ensures you never skip a beat. We handle the repairs and provide a replacement car instantly, so your journey never has to stop. Drive with the confidence of a pro.";
      case '13': return "Shield your digital life with a simplified, instant-activation safety net designed for the modern user. This \"Lite\" coverage focuses on personal risks such as phishing, fraudulent online shopping, and identity theft, ensuring you aren't left vulnerable to common cyber threats. With a 100% digital onboarding process you can secure your accounts in a single click. Our service provides 24/7 Dark Web monitoring of your credentials and expert technical assistance for recovering compromised IDs. Most importantly, if your money cannot be recovered from the bank after a fraudulent incident, this insurance covers your financial loss up to a specific limit, such as 5,000 EUR, turning complex digital security into affordable peace of mind.";
      case '2': return "Need a significant capital injection instantly? The Flash Loan 10,000 package delivers up to 10,000 EUR directly to your account with zero hassle and minimum documentation. Designed for urgent liquidity requirements or unexpected scaling opportunities, this tier bypasses traditional underwriting delays to give you immediate financial firepower.";
      case '5': return "The definitive toolkit for launching your business into the fast lane. Designed specifically for visionary founders and lean teams, our Startup PRO Account provides zero-fee domestic transfers, automated expense tracking, and seamless API integrations with your favorite accounting software. Spend less time managing admin and more time building your empire.";
      case '7': return "Don't leave your hard-earned profits on the table. The Tax Optimizer Tool acts as your personal digital CPA, scanning your income streams and deductible expenses against the latest regulatory frameworks. It instantly visualizes your potential tax savings, uncovers hidden deductions you might have missed, and models scenarios to keep your liability as low as legally possible. Maximize your take-home pay with intelligent, automated compliance.";
      case '18': return "You’ve conquered the local market; now the world is waiting. ScaleUp Enterprise provides the multi-currency infrastructure and cross-border payment tracking you need to operate globally without the logistical headache. From automated tax compliance to international payroll, we handle the complexity so you can focus on your vision. Don’t just grow—evolve.";
      case '19': return "In business, cash flow is oxygen. Flux uses advanced predictive analytics to help you visualize future expenses and optimize your daily liquidity. Stop guessing when your next big invoice will land and start making data-driven decisions that protect your bottom line. Keep your capital moving and your business thriving—never miss an opportunity again.";
      case '20': return "High growth comes with high stakes. Venture Shield protects your company from professional errors, data breaches, and legal disputes that can derail a promising startup overnight. It’s more than just insurance; it’s a safety net that gives you the confidence to take bold risks and sign bigger contracts. Build with total security—protect what you’ve spent years creating.";
      case '21': return "Life doesn't always wait for the first of the month. Whether it’s an unexpected bill or a limited-time offer you can’t miss, Salary Advance gives you instant access to 20% of your paycheck up to 5 days early. It’s your money, exactly when you need it most—no debt traps, no long waits. Stay in control of your timing.";
      case '22': return "Why pay for everything at once when you can spread the cost? FlexiPay transforms the way you buy, allowing you to split any future purchase into 3 easy, interest-free installments. It’s the ultimate financial hack for managing your monthly budget while still getting the things you love today. Shop with confidence and pay with ease.";
      case '23': return "Why wait years for the \"perfect time\" to buy when your future is ready now? DreamKey strips away the traditional red tape, offering a streamlined path to owning your space. We provide the capital with transparent terms that grow with you. Stop dreaming about a home and start inviting people over.";
      case '24': return "Retirement shouldn't be a guessing game. FirePath takes your current assets, spending habits, and inflation data to map out your financial independence date with surgical accuracy. Explore \"what-if\" scenarios, adjust your risk levels, and see a year-by-year visualization of your wealth. Stop wondering if you have enough and start planning your victory lap.";
      case '25': return "Before you risk a single cent on a new project or investment, run it through the Architect. This tool calculates break-even points, customer acquisition costs, and long-term ROI projections in seconds. Whether you're launching a side hustle or buying rental property, get the hard data you need to separate great opportunities from expensive mistakes. Turn your intuition into an ironclad strategy.";
      default: return "";
    }
  };

  const getCategoryDescription = (tab: string) => {
    switch (tab.toLowerCase()) {
      case 'insurance': return "Secure your future and protect what matters most with our custom coverage plans.";
      case 'investments': return "Build your perfect portfolio in just a few clicks with intelligent asset allocation.";
      case 'loans': return "Access flexible capital instantly to fund your next big milestone or bridge the gap.";
      case 'business': return "Empower your enterprise with scaling tools, payment infrastructure, and tailored B2B protections.";
      case 'calculators': return "Make data-driven financial decisions using our advanced predictive modeling tools.";
      default: return "Discover the right financial products tailored just for you.";
    }
  };

  const expandedProductObj = expandedInsurance ? products.find(p => p.id === expandedInsurance) : null;

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
                <button 
                  onClick={() => document.getElementById('loan-calculator')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-foreground hover:bg-heading text-background px-8 py-4 rounded-full font-medium text-lg transition-all shadow-lg flex items-center justify-center group"
                >
                  Personalize Loan
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </section>

            {/* LOAN CALCULATOR SECTION */}
            <section id="loan-calculator" className="bg-slate-50 border-y border-slate-100 py-24">
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
              <p className="text-slate-500 text-lg">{getCategoryDescription(activeTab)}</p>
            </div>

            {loadingProducts ? (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg animate-pulse">Loading products database...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg">No products available in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`group bg-card-bg border border-card-border rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col h-full ${
                      ['4', '14', '15', '16', '17'].includes(product.id) && expandedInvestment === product.id ? 'md:col-span-2 lg:col-span-3' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {product.category}
                      </span>
                      <div className="text-xl font-bold text-slate-900">
                        {product.price} <span className="text-sm font-medium text-slate-500">{product.name.includes('Account') ? 'EUR/mo' : 'EUR'}</span>
                      </div>
                    </div>

                    {['1', '2', '5', '7', '9', '10', '11', '12', '13', '18', '19', '20', '21', '22', '23', '24', '25', '4', '14', '15', '16', '17'].includes(product.id) ? (
                      <button
                        onClick={() => {
                          if (['1', '2', '5', '7', '9', '10', '11', '12', '13', '18', '19', '20', '21', '22', '23', '24', '25'].includes(product.id)) setExpandedInsurance(expandedInsurance === product.id ? null : product.id);
                          if (['4', '14', '15', '16', '17'].includes(product.id)) setExpandedInvestment(expandedInvestment === product.id ? null : product.id);
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
                    <p className="text-slate-500 mb-8 font-light leading-relaxed min-h-[48px] flex-grow">
                      {product.description}
                    </p>

                    {['4', '14', '15', '16', '17'].includes(product.id) && expandedInvestment === product.id && (
                      <div className="mb-8 w-full animate-fade-in-up">
                        <InvestmentVisualizer portfolioId={product.id} />
                      </div>
                    )}

                    <button
                      onClick={() => addToCart(product)}
                      className={`mt-auto w-full py-3.5 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${isProductInCart(product.id)
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-foreground text-background hover:bg-heading'
                        }`}
                    >
                      {isProductInCart(product.id) ? (
                        <>
                          <Plus size={18} />
                          <span>Add Another</span>
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
                    {/* Cart Insights Widget */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
                      <div className="flex items-center space-x-3 mb-4">
                        <PieChart className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-bold text-slate-900">Portfolio Composition</h3>
                      </div>
                      
                      {(() => {
                        const categories = cartItems.reduce((acc: any, item: any) => {
                          acc[item.category] = (acc[item.category] || 0) + item.price;
                          return acc;
                        }, {});
                        
                        const colors: any = {
                          Investments: 'bg-emerald-500',
                          Insurance: 'bg-blue-600',
                          Business: 'bg-amber-500',
                          Loans: 'bg-violet-500',
                          Calculators: 'bg-pink-500',
                        };
                        
                        return (
                          <div>
                            <div className="flex w-full h-3 rounded-full overflow-hidden mb-4 bg-slate-200 shadow-inner">
                              {Object.entries(categories).map(([cat, val]: [string, any]) => (
                                <div 
                                  key={cat} 
                                  style={{ width: `${(val / cartTotal) * 100}%` }} 
                                  className={`${colors[cat] || 'bg-slate-400'} h-full transition-all duration-700 ease-out`} 
                                  title={`${cat}: ${Math.round((val / cartTotal) * 100)}%`}
                                />
                              ))}
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-sm font-medium mb-4">
                              {Object.entries(categories).map(([cat, val]: [string, any]) => (
                                <div key={cat} className="flex items-center space-x-2">
                                  <div className={`w-3 h-3 rounded-full ${colors[cat] || 'bg-slate-400'}`} />
                                  <span className="text-slate-700">{cat} <span className="text-slate-400 ml-1">({Math.round((val / cartTotal) * 100)}%)</span></span>
                                </div>
                              ))}
                            </div>

                            <div className="text-sm font-medium text-slate-600 bg-white p-4 rounded-xl border border-slate-100 italic">
                              {cartItems.length >= 3 && Object.keys(categories).length > 1 
                                ? "💡 Great strategy! You're building a highly diversified setup. Balancing different financial pillars is the key to minimizing risk." 
                                : "💡 Smart tip: The strongest profiles blend tools. Combining insurance protection with growth investments creates a lasting safety net."}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Cart Summary */}
                    <div>
                      <h3 className="text-lg font-bold border-b border-slate-100 pb-4 mb-4">Order Summary</h3>
                      <ul className="space-y-3 mb-4">
                        {cartItems.map((item: any, i: number) => (
                          <li key={item.cartId || item.id || i} className="flex justify-between items-center text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <span className="font-medium">{item.name}</span>
                            <div className="flex items-center space-x-4">
                              <span className="font-bold text-slate-900">{item.price} EUR</span>
                              <button onClick={() => removeFromCart(item.cartId || item.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Remove Item">
                                <X size={18} />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-between items-center py-4 border-t border-slate-100 text-xl font-bold">
                        <span>Total Due</span>
                        <span className="text-blue-600">{cartTotal} EUR</span>
                      </div>
                    </div>

                    {/* Checkout Form */}
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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
                        <label className="block text-sm font-medium text-slate-700 mb-2">ID Upload</label>
                        <label className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group relative">
                          <input 
                            type="file" 
                            accept=".jpg,.jpeg,.png"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              setCheckoutData({ ...checkoutData, idFile: file as any });
                            }}
                          />
                          <FileUp className="w-8 h-8 text-slate-400 group-hover:text-blue-500 mb-2 transition-colors" />
                          <span className="text-sm text-slate-600 font-medium">
                            {checkoutData.idFile ? (checkoutData.idFile as any).name : 'Click to upload your ID'}
                          </span>
                          <span className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</span>
                        </label>
                      </div>

                      {/* Embedded Stripe Elements */}
                      {clientSecret ? (
                        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                          <CheckoutForm 
                            cartTotal={cartTotal} 
                            cartItems={cartItems}
                            paymentStatus={paymentStatus} 
                            setPaymentStatus={setPaymentStatus} 
                            checkoutData={checkoutData} 
                            intentId={intentId}
                          />
                        </Elements>
                      ) : (
                        <div className="py-8 text-center text-slate-500 animate-pulse">Initializing secure payment...</div>
                      )}
                    </form>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
        {/* INSURANCE DETAILS MODAL */}
        {expandedProductObj && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-left">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative animate-fade-in-up font-sans">
              <button 
                onClick={() => setExpandedInsurance(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 hover:bg-slate-200 p-2 rounded-full"
              >
                <X size={20} />
              </button>
              
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4 inline-block">
                  {expandedProductObj.category}
                </span>
                <h3 className="text-3xl font-bold text-heading mt-2 mb-2">
                  {expandedProductObj.name}
                </h3>
                <div className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  {expandedProductObj.price} <span className="text-base font-medium text-slate-500 ml-1">EUR</span>
                </div>
              </div>

              <div className="p-6 bg-blue-50/50 border border-blue-100/50 rounded-2xl text-blue-900 mb-8 shadow-sm">
                <p className="text-base leading-relaxed font-medium">
                  {getExtendedDescription(expandedProductObj.id)}
                </p>
              </div>

              <button
                onClick={() => addToCart(expandedProductObj)}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center space-x-2 ${isProductInCart(expandedProductObj.id)
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                  }`}
              >
                {isProductInCart(expandedProductObj.id) ? (
                  <>
                    <Plus size={22} />
                    <span>Add Another</span>
                  </>
                ) : (
                  <>
                    <Plus size={22} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
