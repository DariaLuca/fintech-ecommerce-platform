import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';

export default function LoanCalculator() {
    const [amount, setAmount] = useState(10000);
    const [period, setPeriod] = useState(24);
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    // Interest rate 9.9% fixed APR
    const interestRate = 0.099;

    useEffect(() => {
        // Formula: P * (r(1+r)^n) / ((1+r)^n - 1)
        const principal = amount;
        const monthlyRate = interestRate / 12;
        const numberOfPayments = period;

        if (principal > 0 && numberOfPayments > 0) {
            const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
            setMonthlyPayment(payment);
        } else {
            setMonthlyPayment(0);
        }
    }, [amount, period]);

    return (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 max-w-xl w-full border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mx-10 -my-10 z-0"></div>

            <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <Calculator size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Personalize Your Loan</h3>
                        <p className="text-sm text-gray-500 font-medium">Interactive rate simulation</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Amount Slider */}
                    <div>
                        <div className="flex justify-between items-end mb-4">
                            <label className="text-sm font-semibold text-gray-700">Loan Amount</label>
                            <div className="text-2xl font-bold text-blue-600">
                                {new Intl.NumberFormat('ro-RO').format(amount)} <span className="text-lg text-gray-500 font-medium tracking-normal">RON</span>
                            </div>
                        </div>
                        <input
                            type="range"
                            min="1000"
                            max="100000"
                            step="1000"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between mt-2 text-xs font-medium text-gray-400">
                            <span>1k RON</span>
                            <span>100k RON</span>
                        </div>
                    </div>

                    {/* Period Slider */}
                    <div>
                        <div className="flex justify-between items-end mb-4">
                            <label className="text-sm font-semibold text-gray-700">Period</label>
                            <div className="text-2xl font-bold text-blue-600">
                                {period} <span className="text-lg text-gray-500 font-medium tracking-normal">months</span>
                            </div>
                        </div>
                        <input
                            type="range"
                            min="6"
                            max="60"
                            step="6"
                            value={period}
                            onChange={(e) => setPeriod(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between mt-2 text-xs font-medium text-gray-400">
                            <span>6 mos</span>
                            <span>60 mos</span>
                        </div>
                    </div>

                    {/* Result Box */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Monthly Payment</p>
                            <p className="text-3xl font-bold text-gray-900 border-b-2 border-blue-600 inline-block pb-1">
                                {new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(monthlyPayment)}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">Fixed APR 9.9% for simulated simulation.</p>
                        </div>

                        <button className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md mt-4 sm:mt-0">
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
