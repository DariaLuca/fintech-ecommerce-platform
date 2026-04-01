import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LogOut, LayoutDashboard, Users, ShoppingBag, Settings, TrendingUp, CreditCard, DollarSign, Lock, PackagePlus } from 'lucide-react';
import ThemeSwitcher from '../../components/ThemeSwitcher';
import { supabase } from '../../utils/supabase';

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuthToken_v2');
    if (auth === 'secure_active') {
      setIsAuthorized(true);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // Fetch orders
    const { data: ordersData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    
    // Fetch products
    const { data: productsData } = await supabase.from('products').select('*').order('name');
    
    if (ordersData) {
      setOrders(ordersData);
      
      // Extract unique customers securely map their value footprint
      const uniqueCustomersMap = new Map();
      ordersData.forEach(o => {
        if (!uniqueCustomersMap.has(o.customer_email)) {
          uniqueCustomersMap.set(o.customer_email, { name: o.customer_name, email: o.customer_email, orders: 1, totalSpent: o.total_amount });
        } else {
          const c = uniqueCustomersMap.get(o.customer_email);
          c.orders += 1;
          c.totalSpent += o.total_amount;
        }
      });
      setCustomers(Array.from(uniqueCustomersMap.values()));
    }
    
    if (productsData) {
      setProducts(productsData);
    }
    
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin123') {
      localStorage.setItem('adminAuthToken_v2', 'secure_active');
      setIsAuthorized(true);
      fetchData();
    } else {
      alert('Incorrect password. Access Denied.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthToken_v2');
    setIsAuthorized(false);
    setPasswordInput('');
  };

  const handleUpdateStock = async (id: string, newStock: number) => {
    const { error } = await supabase.from('products').update({ stock: newStock }).eq('id', id);
    if (!error) {
      setProducts(products.map(p => p.id === id ? { ...p, stock: newStock } : p));
      alert('Stock successfully updated!');
    } else {
       alert('Stock update failed!');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-foreground font-sans">
        <Head>
          <title>Admin Access | FinPlatform</title>
        </Head>
        <div className="w-full max-w-md bg-card-bg p-8 rounded-3xl border border-card-border shadow-xl text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold mb-2">Admin Security Gate</h1>
          <p className="text-slate-500 mb-8">Enter the master password to unlock secure monitoring.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter Password"
              className="w-full px-4 py-3 rounded-xl border border-card-border bg-background focus:ring-2 focus:ring-blue-500 outline-none text-center tracking-widest"
            />
            <button type="submit" className="w-full py-3 bg-[#9E6E45] hover:bg-[#8A5F3B] text-white font-bold rounded-xl transition-colors shadow-lg">
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Calculate live stats
  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((acc, o) => acc + o.total_amount, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-heading font-sans">
      <Head>
        <title>Admin Engine | FinPlatform</title>
      </Head>

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card-bg border-r border-card-border flex flex-col sticky top-0 md:h-screen z-10 shrink-0 shadow-sm relative">
        <div className="p-6 border-b border-card-border justify-between items-center hidden md:flex">
          <span className="text-xl font-bold tracking-tight text-[#9E6E45]">Admin Portal</span>
        </div>
        
        <nav className="flex-1 p-4 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible items-center md:items-stretch gap-2 no-scrollbar">
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-colors whitespace-nowrap md:w-full shrink-0 ${activeTab === 'dashboard' ? 'bg-[#9E6E45]/10 text-[#9E6E45]' : 'text-foreground hover:bg-card-border'}`}>
            <LayoutDashboard size={20} />
            <span className="inline">Live Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('orders')} className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-colors whitespace-nowrap md:w-full shrink-0 ${activeTab === 'orders' ? 'bg-[#9E6E45]/10 text-[#9E6E45]' : 'text-foreground hover:bg-card-border'}`}>
            <ShoppingBag size={20} />
            <span className="inline">All Orders</span>
          </button>
          <button onClick={() => setActiveTab('customers')} className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-colors whitespace-nowrap md:w-full shrink-0 ${activeTab === 'customers' ? 'bg-[#9E6E45]/10 text-[#9E6E45]' : 'text-foreground hover:bg-card-border'}`}>
            <Users size={20} />
            <span className="inline">Customers</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-colors whitespace-nowrap md:w-full shrink-0 ${activeTab === 'settings' ? 'bg-[#9E6E45]/10 text-[#9E6E45]' : 'text-foreground hover:bg-card-border'}`}>
            <Settings size={20} />
            <span className="inline">Inventory Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-card-border mt-auto">
          <button onClick={handleLogout} className="flex items-center w-full justify-center md:justify-start space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors">
            <LogOut size={20} />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
        <div className="flex justify-between items-center mb-8 bg-card-bg p-4 rounded-2xl border border-card-border shadow-sm">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold capitalize text-heading flex items-center">
               <TrendingUp className="mr-3 text-[#9E6E45]" size={36}/> {activeTab} 
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            <Link href="/" className="px-4 py-2 bg-[#9E6E45] hover:bg-[#8A5F3B] text-white rounded-xl text-sm font-bold transition-colors hidden sm:block shadow-md">
              Storefront Return
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12 text-blue-500 font-bold tracking-widest animate-pulse space-x-3">
             <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"/>
             <span>SYNCING DATABASE...</span>
          </div>
        ) : (
          <div className="animate-fade-in space-y-8">
            {activeTab === 'dashboard' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card-bg p-6 rounded-2xl border border-card-border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-emerald-50 rounded-xl"><DollarSign size={24} className="text-emerald-500" /></div>
                    </div>
                    <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">Gross Revenue</h3>
                    <p className="text-3xl font-extrabold mt-1 text-heading">{totalRevenue.toLocaleString()} <span className="text-lg">EUR</span></p>
                  </div>
                  <div className="bg-card-bg p-6 rounded-2xl border border-card-border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-blue-50 rounded-xl"><ShoppingBag size={24} className="text-blue-500" /></div>
                    </div>
                    <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Sales</h3>
                    <p className="text-3xl font-extrabold mt-1 text-heading">{orders.length}</p>
                  </div>
                  <div className="bg-card-bg p-6 rounded-2xl border border-card-border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-violet-50 rounded-xl"><Users size={24} className="text-violet-500" /></div>
                    </div>
                    <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">Client Base</h3>
                    <p className="text-3xl font-extrabold mt-1 text-heading">{customers.length}</p>
                  </div>
                </div>

                <div className="bg-card-bg rounded-2xl border border-card-border overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-card-border bg-slate-50/50">
                    <h2 className="text-lg font-bold text-heading">Latest Transactions</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-card-bg text-slate-500 text-xs uppercase tracking-wider font-bold">
                        <tr>
                          <th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Date processed</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-card-border">
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium">{order.customer_name} <span className="font-light text-slate-500 hidden md:inline ml-2">({order.customer_email})</span></td>
                            <td className="px-6 py-4 text-sm font-extrabold text-[#9E6E45]">{order.total_amount} EUR</td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                {order.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500 font-medium">{new Date(order.created_at).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {orders.length === 0 && <div className="p-8 text-center text-slate-500 font-medium">No sales logged yet.</div>}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'orders' && (
              <div className="bg-card-bg rounded-2xl border border-card-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-card-border">
                      <tr>
                        <th className="px-6 py-4">Order ID / Token</th>
                        <th className="px-6 py-4">Client Detail</th>
                        <th className="px-6 py-4">Assets Acquired</th>
                        <th className="px-6 py-4">Charge</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-xs font-mono text-slate-400 max-w-[150px] truncate">{order.stripe_payment_intent_id || order.id}</td>
                          <td className="px-6 py-4 p-4 text-sm">
                            <p className="font-bold text-heading">{order.customer_name}</p>
                            <p className="text-xs text-blue-500 mt-0.5">{order.customer_email}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 font-medium leading-relaxed max-w-[250px]">{order.items.map((i:any) => i.name).join(' • ')}</td>
                          <td className="px-6 py-4 text-sm font-extrabold text-[#9E6E45]">{order.total_amount} EUR</td>
                          <td className="px-6 py-4 text-sm">
                             <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                {order.status.toUpperCase()}
                              </span>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-500">No orders mapped yet.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'customers' && (
              <div className="bg-card-bg rounded-2xl border border-card-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-card-border">
                      <tr>
                        <th className="px-6 py-4">Identifier Name</th>
                        <th className="px-6 py-4">Contact Gateway</th>
                        <th className="px-6 py-4 text-center">Lifetime Conversions</th>
                        <th className="px-6 py-4 text-right">Lifetime Value (LTV)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border">
                      {customers.map((c, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-extrabold text-heading">{c.name}</td>
                          <td className="px-6 py-4 text-sm text-blue-500 font-medium">{c.email}</td>
                          <td className="px-6 py-4 text-sm text-center font-bold bg-slate-50 rounded-md m-2">{c.orders}</td>
                          <td className="px-6 py-4 text-sm text-right font-extrabold text-emerald-600">{c.totalSpent.toLocaleString()} EUR</td>
                        </tr>
                      ))}
                      {customers.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-slate-500">No customers routed yet.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-card-bg rounded-2xl border border-card-border overflow-hidden p-6 md:p-10 shadow-sm max-w-4xl mx-auto">
                <div className="mb-8 p-6 bg-[#9E6E45]/10 rounded-xl border border-[#9E6E45]/20">
                    <h2 className="text-xl font-extrabold mb-2 flex items-center text-[#9E6E45]"><PackagePlus className="mr-3"/> Global Inventory Matrix</h2>
                    <p className="text-sm font-medium text-slate-600">Ensure values are continuously updated. Automated deduction protocols are live. Type a new base stock amount and click outside the box to push.</p>
                </div>
                
                <div className="space-y-6">
                  {products.map((product) => (
                    <div key={product.id} className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 pb-6 group">
                      <div className="mb-4 sm:mb-0 w-full sm:w-2/3">
                        <p className="font-extrabold text-lg text-heading group-hover:text-blue-600 transition-colors">{product.name}</p>
                        <span className="inline-block mt-1 px-2 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-md uppercase tracking-wider">{product.category}</span>
                      </div>
                      <div className="flex items-center space-x-4 bg-slate-50 p-2 rounded-xl border border-slate-100 w-full sm:w-auto justify-end shadow-inner">
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Units :</span>
                        <input 
                          type="number" 
                          min="0"
                          defaultValue={product.stock ?? 100}
                          onBlur={(e) => handleUpdateStock(product.id, parseInt(e.target.value))}
                          className="w-24 px-4 py-2 border-2 border-slate-200 rounded-lg text-lg font-bold text-center text-heading focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-white"
                        />
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && <div className="text-center text-slate-500 font-medium">No products mapped for inventory tracking.</div>}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
