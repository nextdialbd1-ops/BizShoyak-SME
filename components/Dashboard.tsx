
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  ShoppingBag, 
  HeartPulse,
  ChevronRight,
  Bell
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Transaction, InventoryItem, WhatsAppMessage, BusinessProfile, TransactionType } from '../types';
import { getBusinessHealthAdvice } from '../services/gemini';

interface DashboardProps {
  t: any;
  transactions: Transaction[];
  inventory: InventoryItem[];
  messages: WhatsAppMessage[];
  profile: BusinessProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ t, transactions, inventory, messages, profile }) => {
  const [health, setHealth] = useState({ score: 85, advice: 'সবকিছু ঠিকঠাক চলছে!' });
  const [loadingHealth, setLoadingHealth] = useState(false);

  useEffect(() => {
    const fetchHealth = async () => {
      // Skip analysis if no data is available to avoid wasted API calls during initialization
      if (transactions.length === 0 && inventory.length === 0 && messages.length === 0) return;

      setLoadingHealth(true);
      try {
        // Prepare optimized data payload for AI
        const analysisData = {
          transactions: transactions.slice(0, 20).map(t => ({
            type: t.type,
            amount: t.amount,
            category: t.category,
            date: t.date
          })),
          inventory: inventory.map(i => ({
            name: i.name,
            quantity: i.quantity,
            minStock: i.minStock
          })),
          messages: messages.slice(0, 10).map(m => ({
            category: m.category,
            status: m.status
          })),
          businessType: profile.type
        };

        const advice = await getBusinessHealthAdvice(analysisData);
        setHealth(advice);
      } catch (err) {
        console.error("Health analysis failed", err);
      } finally {
        setLoadingHealth(false);
      }
    };

    // Debounce slightly or just run when data lengths change to capture initial seed data load
    const timeoutId = setTimeout(fetchHealth, 500);
    return () => clearTimeout(timeoutId);
  }, [transactions.length, inventory.length, messages.length, profile.type]);

  const totalIncome = transactions
    .filter(tx => tx.type === TransactionType.INCOME)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = transactions
    .filter(tx => tx.type === TransactionType.EXPENSE)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const lowStockItems = inventory.filter(item => item.quantity <= item.minStock);

  // Chart Data preparation
  const chartData = transactions.slice(0, 7).reverse().map(tx => ({
    name: tx.date.split('-').slice(1).join('/'),
    amount: tx.type === TransactionType.INCOME ? tx.amount : -tx.amount
  }));

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title={t.income} 
          value={`${totalIncome.toLocaleString()} ৳`} 
          color="green" 
          icon={TrendingUp} 
        />
        <StatCard 
          title={t.expense} 
          value={`${totalExpense.toLocaleString()} ৳`} 
          color="red" 
          icon={TrendingDown} 
        />
        <StatCard 
          title={t.lowStock} 
          value={`${lowStockItems.length} টি`} 
          color="orange" 
          icon={Package} 
        />
        <StatCard 
          title={t.newOrders} 
          value={`${messages.filter(m => m.category === 'order').length} টি`} 
          color="blue" 
          icon={ShoppingBag} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 text-lg">{t.cashflow} ট্র্যাকার</h3>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>শেষ ৭ দিন</option>
              <option>শেষ ৩০ দিন</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#16a34a" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Business Health Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <HeartPulse className="text-red-500" />
            <h3 className="font-bold text-slate-800 text-lg">{t.businessHealth}</h3>
          </div>
          
          {loadingHealth ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-3">
              <div className="w-16 h-16 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 text-sm">{t.analyzing}</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="relative flex items-center justify-center py-6">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364}
                    strokeDashoffset={364 - (364 * health.score) / 100}
                    className="text-green-500 transition-all duration-1000 ease-out"
                  />
                </svg>
                <span className="absolute text-3xl font-bold text-slate-800">{health.score}</span>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4 flex-1">
                <p className="text-sm text-green-800 leading-relaxed font-medium">
                  "{health.advice}"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-orange-800 flex items-center gap-2">
              <Bell size={20} />
              {t.stockAlert}
            </h3>
            <button className="text-orange-700 text-sm font-semibold flex items-center gap-1 hover:underline">
              স্টক আপডেট করুন <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {lowStockItems.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-orange-200">
                <p className="font-bold text-slate-800">{item.name}</p>
                <p className="text-orange-600 text-sm font-semibold">{item.quantity} {item.unit} {t.itemsRemaining}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, color, icon: Icon }: any) => {
  const colorMap: any = {
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600',
    blue: 'bg-blue-50 text-blue-600',
  };
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colorMap[color]}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;
