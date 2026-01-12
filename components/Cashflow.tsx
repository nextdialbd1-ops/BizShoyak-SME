
import React, { useState, useRef, useMemo } from 'react';
import { 
  Plus, 
  Camera, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown,
  ChevronRight,
  Loader2,
  X,
  Calendar,
  Tag,
  User,
  DollarSign,
  Briefcase,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  RotateCcw,
  ListFilter,
  ArrowUpDown,
  Repeat,
  Info
} from 'lucide-react';
import { Transaction, TransactionType, RecurringConfig } from '../types';
import { parseReceiptImage } from '../services/gemini';

interface CashflowProps {
  t: any;
  transactions: Transaction[];
  onAdd: (tx: Transaction) => void;
}

const Cashflow: React.FC<CashflowProps> = ({ t, transactions, onAdd }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual Form State
  const [form, setForm] = useState({
    type: TransactionType.EXPENSE,
    amount: '',
    vendor: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    isRecurring: false,
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly',
    endDate: ''
  });

  // Filter State
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    startDate: '',
    endDate: '',
    search: ''
  });

  // Category options
  const incomeCategories = [
    { value: 'Sales', label: 'বিক্রি (Sales)' },
  ];

  const expenseCategories = [
    { value: 'Raw Materials', label: 'কাঁচামাল (Raw Materials)' },
    { value: 'Utilities', label: 'ইউটিলিটি (Utilities)' },
    { value: 'Rent', label: 'ভাড়া (Rent)' },
    { value: 'Salary', label: 'বেতন (Salary)' },
    { value: 'Logistics', label: 'ডেলিভারি/লজিস্টিকস' },
    { value: 'Marketing', label: 'মার্কেটিং (Marketing)' },
    { value: 'Others', label: 'অন্যান্য (Others)' },
  ];

  const filterCategoryOptions = useMemo(() => {
    if (filters.type === TransactionType.INCOME) return incomeCategories;
    if (filters.type === TransactionType.EXPENSE) return expenseCategories;
    const combined = [...incomeCategories, ...expenseCategories];
    return Array.from(new Set(combined.map(c => c.value)))
      .map(val => combined.find(c => c.value === val));
  }, [filters.type]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchType = filters.type === 'all' || tx.type === filters.type;
      const matchCategory = filters.category === 'all' || tx.category === filters.category;
      const matchSearch = tx.vendor.toLowerCase().includes(filters.search.toLowerCase()) || 
                          tx.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchStart = !filters.startDate || tx.date >= filters.startDate;
      const matchEnd = !filters.endDate || tx.date <= filters.endDate;
      return matchType && matchCategory && matchSearch && matchStart && matchEnd;
    });
  }, [transactions, filters]);

  const stats = useMemo(() => {
    const income = transactions
      .filter(tx => tx.type === TransactionType.INCOME)
      .reduce((sum, tx) => sum + tx.amount, 0);
    const expense = transactions
      .filter(tx => tx.type === TransactionType.EXPENSE)
      .reduce((sum, tx) => sum + tx.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      try {
        const result = await parseReceiptImage(base64);
        const newTx: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          type: TransactionType.EXPENSE,
          amount: result.total_amount,
          category: result.category,
          vendor: result.vendor,
          date: result.date || new Date().toISOString().split('T')[0],
          description: result.items?.map((i: any) => i.name).join(', ') || 'Receipt Scan'
        };
        onAdd(newTx);
      } catch (err) {
        alert("রসিদ স্ক্যান করতে সমস্যা হয়েছে। দয়া করে ম্যানুয়ালি এন্ট্রি দিন।");
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.vendor || !form.category) {
      alert("দয়া করে সব প্রয়োজনীয় তথ্য পূরণ করুন।");
      return;
    }

    const recurringConfig: RecurringConfig | undefined = form.isRecurring ? {
      frequency: form.frequency,
      endDate: form.endDate
    } : undefined;

    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: form.type,
      amount: parseFloat(form.amount),
      vendor: form.vendor,
      category: form.category,
      date: form.date,
      description: form.description || 'Manual Entry',
      recurring: recurringConfig
    };

    onAdd(newTx);
    setIsAddingManual(false);
    setForm({
      type: TransactionType.EXPENSE,
      amount: '',
      vendor: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      isRecurring: false,
      frequency: 'monthly',
      endDate: ''
    });
  };

  const resetFilters = () => {
    setFilters({ type: 'all', category: 'all', startDate: '', endDate: '', search: '' });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">{t.cashflow} ট্র্যাকার</h2>
          <p className="text-slate-500 mt-1 font-medium">ব্যবসার আর্থিক লেনদেন ও স্মার্ট ট্র্যাকিং</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            className="group flex items-center justify-center gap-2.5 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50"
          >
            {isScanning ? <Loader2 size={22} className="animate-spin" /> : <Camera size={22} className="group-hover:scale-110 transition-transform" />}
            {t.scanReceipt}
          </button>
          <button 
            onClick={() => setIsAddingManual(true)}
            className="flex items-center justify-center gap-2.5 bg-green-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-green-100 hover:bg-green-700 transition-all active:scale-95"
          >
            <Plus size={22} />
            {t.newEntry}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <SummaryCard label={t.income} value={stats.income} icon={ArrowUpCircle} color="green" />
        <SummaryCard label={t.expense} value={stats.expense} icon={ArrowDownCircle} color="red" />
        <SummaryCard label={t.balance} value={stats.balance} icon={Wallet} color="indigo" />
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 rounded-2xl">
                <ArrowUpDown size={22} className="text-slate-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-xl">{t.recentTransactions}</h3>
                <p className="text-sm text-slate-400 font-bold">{filteredTransactions.length} টি ফলাফল</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 sm:flex-none min-w-[280px]">
                <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="নাম বা বিবরণ দিয়ে খুঁজুন..." 
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none placeholder:text-slate-400"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2.5 px-6 py-3.5 border rounded-2xl text-sm font-black transition-all ${
                  showFilters || (filters.type !== 'all' || filters.category !== 'all' || filters.startDate || filters.endDate)
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Filter size={18} />
                ফিল্টার {(!showFilters && (filters.type !== 'all' || filters.category !== 'all' || filters.startDate || filters.endDate)) && '•'}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="bg-slate-50/80 p-8 rounded-3xl border border-slate-200 animate-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                    <ListFilter size={14} /> লেনদেনের ধরণ
                  </label>
                  <select 
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value, category: 'all'})}
                    className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-black shadow-sm"
                  >
                    <option value="all">সব লেনদেন</option>
                    <option value={TransactionType.INCOME}>আয় (Income)</option>
                    <option value={TransactionType.EXPENSE}>ব্যয় (Expense)</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                    <Tag size={14} /> ক্যাটাগরি
                  </label>
                  <select 
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                    className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-black shadow-sm"
                  >
                    <option value="all">সব ক্যাটাগরি</option>
                    {filterCategoryOptions.map(cat => (
                      <option key={cat?.value} value={cat?.value}>{cat?.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                    <Calendar size={14} /> শুরুর তারিখ
                  </label>
                  <input 
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                    className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-black shadow-sm"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                    <Calendar size={14} /> শেষ তারিখ
                  </label>
                  <input 
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                    className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-black shadow-sm"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button onClick={resetFilters} className="flex items-center gap-2.5 px-6 py-3 text-slate-500 text-sm font-black hover:text-red-600 transition-colors bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-red-100">
                  <RotateCcw size={18} /> রিসেট করুন
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-10 py-6">{t.date}</th>
                <th className="px-10 py-6">{t.vendor}</th>
                <th className="px-10 py-6">{t.category}</th>
                <th className="px-10 py-6 text-right">{t.amount}</th>
                <th className="px-10 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-24 text-center">
                    <div className="flex flex-col items-center gap-6 max-w-sm mx-auto">
                      <div className="p-8 bg-slate-50 rounded-full text-slate-200">
                        <Wallet size={64} />
                      </div>
                      <div className="space-y-2">
                        <p className="font-black text-slate-800 text-lg">কোনো লেনদেন খুঁজে পাওয়া যায়নি</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-10 py-6">
                      <span className="text-sm font-bold text-slate-400 tabular-nums">{tx.date}</span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl shadow-sm ${tx.type === TransactionType.INCOME ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {tx.type === TransactionType.INCOME ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-black text-slate-800">{tx.vendor}</p>
                            {tx.recurring && <Repeat size={14} className="text-indigo-500" title={`Recurring: ${tx.recurring.frequency}`} />}
                          </div>
                          <p className="text-xs text-slate-400 font-bold truncate max-w-[150px]">{tx.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="px-4 py-2 bg-slate-100 rounded-xl text-[11px] font-black text-slate-600 uppercase tracking-widest border border-slate-200/50">
                        {tx.category}
                      </span>
                    </td>
                    <td className={`px-10 py-6 text-right font-black tabular-nums whitespace-nowrap text-xl ${tx.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === TransactionType.INCOME ? '+' : '-'}{tx.amount.toLocaleString()} ৳
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-2xl transition-all shadow-hover">
                        <ChevronRight size={22} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddingManual && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-y-auto max-h-[95vh] animate-in fade-in zoom-in duration-300 scrollbar-hide">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-indigo-100 text-indigo-600 rounded-3xl">
                  <Briefcase size={28} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-800">{t.newEntry}</h3>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Manual Record</p>
                </div>
              </div>
              <button onClick={() => setIsAddingManual(false)} className="p-4 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                <X size={28} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitManual} className="p-10 space-y-8">
              <div className="flex p-2 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setForm({...form, type: TransactionType.INCOME, category: 'Sales'})}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-black transition-all ${form.type === TransactionType.INCOME ? 'bg-white text-green-600 shadow-lg scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <TrendingUp size={22} /> {t.income}
                </button>
                <button
                  type="button"
                  onClick={() => setForm({...form, type: TransactionType.EXPENSE, category: ''})}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-black transition-all ${form.type === TransactionType.EXPENSE ? 'bg-white text-red-600 shadow-lg scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <TrendingDown size={22} /> {t.expense}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Calendar size={16} /> {t.date}
                  </label>
                  <input 
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({...form, date: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-black text-slate-700"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <DollarSign size={16} /> {t.amount} (৳)
                  </label>
                  <input 
                    type="number"
                    required
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => setForm({...form, amount: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-black text-slate-800 text-xl"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <User size={16} /> {t.vendor} / কাস্টমার
                </label>
                <input 
                  type="text"
                  required
                  placeholder="নাম লিখুন..."
                  value={form.vendor}
                  onChange={(e) => setForm({...form, vendor: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Tag size={16} /> {t.category}
                </label>
                <select 
                  required
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none font-black text-slate-700"
                >
                  <option value="">{t.select}</option>
                  {(form.type === TransactionType.INCOME ? incomeCategories : expenseCategories).map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Recurring Transaction Feature */}
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                      <Repeat size={18} />
                    </div>
                    <span className="font-black text-slate-700">পৌনঃপুনিক লেনদেন? (Recurring)</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={form.isRecurring}
                      onChange={(e) => setForm({...form, isRecurring: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {form.isRecurring && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                        কতদিন পর পর? (Frequency)
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {['daily', 'weekly', 'monthly'].map((freq) => (
                          <button
                            key={freq}
                            type="button"
                            onClick={() => setForm({...form, frequency: freq as any})}
                            className={`py-3 rounded-xl text-xs font-black border transition-all ${
                              form.frequency === freq 
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            {freq === 'daily' ? 'দৈনিক' : freq === 'weekly' ? 'সাপ্তাহিক' : 'মাসিক'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                        কবে পর্যন্ত চলবে? (Duration)
                      </label>
                      <input 
                        type="date"
                        required={form.isRecurring}
                        value={form.endDate}
                        onChange={(e) => setForm({...form, endDate: e.target.value})}
                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-black text-slate-700 shadow-sm"
                      />
                    </div>
                    <div className="flex gap-2 p-3 bg-indigo-50 rounded-xl text-indigo-700 text-[10px] font-bold">
                      <Info size={14} className="shrink-0" />
                      <span>এটি একটি শিডিউল তৈরি করবে যা নিয়মিত বিরতিতে আপনার লিস্টে অটোমেটিক যোগ হবে।</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-8 flex gap-6">
                <button type="button" onClick={() => setIsAddingManual(false)} className="flex-1 px-8 py-5 border border-slate-200 text-slate-500 font-black rounded-2xl hover:bg-slate-50 transition-colors">
                  {t.cancel}
                </button>
                <button type="submit" className="flex-1 px-8 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({ label, value, icon: Icon, color }: any) => {
  const colorMap: any = {
    green: 'bg-green-600 shadow-green-100',
    red: 'bg-red-600 shadow-red-100',
    indigo: 'bg-indigo-900 shadow-indigo-100',
  };
  return (
    <div className={`${colorMap[color]} p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300`}>
      <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-500">
        <Icon size={100} />
      </div>
      <div className="relative z-10 flex flex-col justify-between h-full text-white">
        <div className="flex items-center gap-3 mb-6 opacity-70">
          <Icon size={24} />
          <span className="text-xs font-black uppercase tracking-[0.2em]">{label}</span>
        </div>
        <div>
          <span className="text-4xl font-black tabular-nums">{value.toLocaleString()}</span>
          <span className="text-xl font-bold ml-2 opacity-70">৳</span>
        </div>
      </div>
    </div>
  );
};

export default Cashflow;
