
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MessageCircle, 
  Wallet, 
  Package, 
  User, 
  Settings, 
  Bell, 
  LogOut,
  Menu,
  X,
  Megaphone
} from 'lucide-react';
import { AppTab, Transaction, InventoryItem, WhatsAppMessage, BusinessProfile, TransactionType } from './types';
import { translations } from './i18n';
import Dashboard from './components/Dashboard';
import WhatsAppInbox from './components/WhatsAppInbox';
import Cashflow from './components/Cashflow';
import Inventory from './components/Inventory';
import Profile from './components/Profile';
import Marketing from './components/Marketing';
import SignupScreen from './components/SignupScreen';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // App State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [profile, setProfile] = useState<BusinessProfile>({
    name: "",
    ownerName: "",
    type: "",
    phone: "",
    email: "",
    pageName: "",
    address: "বাংলাদেশ",
    currency: "BDT",
    isOnboarded: false
  });

  const t = translations[lang];

  useEffect(() => {
    // Initial Seed Data for onboarded users
    const seedTransactions: Transaction[] = [
      { id: '1', type: TransactionType.INCOME, amount: 2500, category: 'Sales', vendor: 'Customer A', date: '2023-11-20', description: 'Daily Sales' },
      { id: '2', type: TransactionType.EXPENSE, amount: 800, category: 'Utilities', vendor: 'DESCO', date: '2023-11-19', description: 'Electricity Bill' },
      { id: '3', type: TransactionType.INCOME, amount: 4500, category: 'Sales', vendor: 'Customer B', date: '2023-11-19', description: 'Bulk Purchase' },
    ];
    const seedInventory: InventoryItem[] = [
      { id: '1', name: 'চিনি (Sugar)', quantity: 5, unit: 'kg', minStock: 10, price: 140 },
      { id: '2', name: 'ডাল (Lentil)', quantity: 20, unit: 'kg', minStock: 15, price: 130 },
      { id: '3', name: 'তেল (Soybean Oil)', quantity: 12, unit: 'Litre', minStock: 5, price: 185 },
    ];
    const seedMessages: WhatsAppMessage[] = [
      { id: '1', sender: '01811223344', content: 'চিনির কেজি কত?', timestamp: '10:30 AM', category: 'price_inquiry', suggestedReply: 'চিনির বর্তমান মূল্য ১৪০ টাকা প্রতি কেজি।', status: 'pending' },
      { id: '2', sender: '01999887766', content: '৫ লিটার তেল লাগবে, বাসায় পাঠাতে পারবেন?', timestamp: '09:15 AM', category: 'order', suggestedReply: 'অবশ্যই! আপনার ঠিকানাটি দিন, আমরা দ্রুত পাঠিয়ে দিচ্ছি।', status: 'pending' },
    ];
    
    setTransactions(seedTransactions);
    setInventory(seedInventory);
    setMessages(seedMessages);
  }, []);

  const handleSignup = (newProfile: BusinessProfile) => {
    setProfile(newProfile);
  };

  if (!profile.isOnboarded) {
    return <SignupScreen t={t} onSignup={handleSignup} />;
  }

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'whatsapp', label: t.whatsapp, icon: MessageCircle },
    { id: 'cashflow', label: t.cashflow, icon: Wallet },
    { id: 'inventory', label: t.inventory, icon: Package },
    { id: 'marketing', label: t.marketing, icon: Megaphone },
    { id: 'profile', label: t.profile, icon: User },
  ];

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions([newTx, ...transactions]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard t={t} transactions={transactions} inventory={inventory} messages={messages} profile={profile} />;
      case 'whatsapp':
        return <WhatsAppInbox t={t} messages={messages} setMessages={setMessages} profile={profile} />;
      case 'cashflow':
        return <Cashflow t={t} transactions={transactions} onAdd={handleAddTransaction} />;
      case 'inventory':
        return <Inventory t={t} inventory={inventory} setInventory={setInventory} />;
      case 'marketing':
        return <Marketing t={t} inventory={inventory} profile={profile} />;
      case 'profile':
        return <Profile t={t} profile={profile} setProfile={setProfile} setLang={setLang} lang={lang} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-['Hind_Siliguri']">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <LayoutDashboard size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-800">বিজসহায়ক</h1>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as AppTab);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${activeTab === item.id 
                    ? 'bg-green-50 text-green-700 font-semibold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
                `}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-100">
          <button 
            onClick={() => setProfile({...profile, isOnboarded: false})}
            className="flex items-center gap-3 text-slate-500 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            <span>লগ আউট</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-bold text-slate-800 hidden md:block">
              {navItems.find(n => n.id === activeTab)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="text-sm font-semibold bg-slate-100 px-3 py-1 rounded-full text-slate-600 hover:bg-slate-200"
            >
              {lang === 'bn' ? 'EN' : 'বাংলা'}
            </button>
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
