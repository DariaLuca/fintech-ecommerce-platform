import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X, Landmark } from 'lucide-react';
import { useCart } from '../store/useCart';
import ThemeSwitcher from './ThemeSwitcher';

const categories = [
    'Insurance',
    'Loans',
    'Internet Banking',
    'Investments',
    'Business',
    'Promotions',
    'Calculators',
    'Document Center',
];

export default function Navbar() {
    const cartItems = useCart((state) => state.cartItems);
    const activeTab = useCart((state: any) => state.activeTab);
    const setActiveTab = useCart((state: any) => state.setActiveTab);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-background border-b border-card-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('home')}>
                        <span className="flex items-center space-x-2 text-2xl font-bold tracking-tight text-heading group">
                            <span className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                                <Landmark size={24} />
                            </span>
                            <span>FinPlatform</span>
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex space-x-8">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveTab(category);
                                }}
                                className={`text-sm font-medium transition-colors py-2 ${activeTab === category ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-4 lg:space-x-6">
                        <ThemeSwitcher />

                        <button
                            onClick={() => setActiveTab('cart')}
                            className="relative p-2 text-foreground hover:text-blue-600 transition-colors rounded-full hover:bg-card-bg"
                        >
                            <ShoppingCart size={24} />
                            {cartItems.length > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-blue-600 rounded-full">
                                    {cartItems.length}
                                </span>
                            )}
                        </button>

                        {/* Mobile menu button */}
                        <div className="lg:hidden flex items-center">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-gray-600 hover:text-blue-600 p-2"
                            >
                                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="lg:hidden border-t border-gray-100 bg-white">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveTab(category);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`block w-full text-left px-3 py-3 rounded-xl text-base font-medium transition-colors ${activeTab === category ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
