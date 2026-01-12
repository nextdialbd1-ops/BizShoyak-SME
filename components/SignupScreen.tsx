
import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Phone, 
  Mail, 
  Facebook, 
  ShoppingBag, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface SignupScreenProps {
  t: any;
  onSignup: (profile: BusinessProfile) => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ t, onSignup }) => {
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    phone: '',
    email: '',
    pageName: '',
    type: 'Fashion & Boutique',
  });

  const categories = [
    'Grocery & Daily Essentials',
    'Fashion & Boutique',
    'Electronics & Gadgets',
    'Food & Catering',
    'Health & Beauty',
    'Home & Decor',
    'Mobile & Accessories',
    'Jewelry & Ornaments',
    'Stationery & Gifts',
    'Others'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup({
      ...formData,
      address: 'ঢাকা, বাংলাদেশ',
      currency: 'BDT',
      isOnboarded: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl shadow-green-900/10 overflow-hidden">
        
        {/* Visual Side */}
        <div className="hidden md:flex bg-green-600 p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-700 rounded-full -ml-32 -mb-32 opacity-50 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-xl mb-8">
              <ShoppingBag size={32} />
            </div>
            <h1 className="text-4xl font-black mb-4 leading-tight">বিজসহায়ক</h1>
            <p className="text-green-100 text-lg">{t.welcomeMsg}</p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <Sparkles size={20} />
              </div>
              <p className="font-medium text-sm">এআই ভিত্তিক হোয়াটসঅ্যাপ এসিস্ট্যান্ট</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <ShoppingBag size={20} />
              </div>
              <p className="font-medium text-sm">সহজ ইনভেন্টরি এবং ক্যাশফ্লো ট্র্যাকিং</p>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-800 mb-2">{t.signup}</h2>
            <p className="text-slate-500 text-sm">আপনার ফেসবুক পেজের তথ্য দিয়ে শুরু করুন</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <User size={12} /> {t.ownerName}
              </label>
              <input 
                required
                type="text" 
                placeholder="আপনার নাম লিখুন..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                value={formData.ownerName}
                onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Phone size={12} /> {t.contactNumber}
                </label>
                <input 
                  required
                  type="tel" 
                  placeholder="017XXXXXXXX"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Mail size={12} /> {t.email}
                </label>
                <input 
                  required
                  type="email" 
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Facebook size={12} /> {t.fbPageName}
              </label>
              <input 
                required
                type="text" 
                placeholder="আপনার পেজের নাম লিখুন..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all font-bold"
                value={formData.pageName}
                onChange={(e) => {
                  setFormData({
                    ...formData, 
                    pageName: e.target.value,
                    name: e.target.value // Syncing business name with page name
                  });
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Building2 size={12} /> {t.businessCategory}
              </label>
              <select 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all appearance-none"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {t.startJourney}
              <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;
