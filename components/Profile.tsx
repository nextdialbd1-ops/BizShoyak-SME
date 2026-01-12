
import React from 'react';
import { 
  Building, 
  Phone, 
  MapPin, 
  Globe, 
  Shield, 
  CreditCard,
  ChevronRight,
  Camera,
  Mail,
  Facebook,
  User as UserIcon
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface ProfileProps {
  t: any;
  profile: BusinessProfile;
  setProfile: (p: BusinessProfile) => void;
  setLang: (l: 'bn' | 'en') => void;
  lang: 'bn' | 'en';
}

const Profile: React.FC<ProfileProps> = ({ t, profile, setProfile, setLang, lang }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Profile */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col items-center md:flex-row md:items-start gap-8">
        <div className="relative">
          <div className="w-32 h-32 bg-green-50 rounded-3xl border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-green-600">
            <Facebook size={64} />
          </div>
          <button className="absolute -bottom-2 -right-2 p-2 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition-transform active:scale-90">
            <Camera size={20} />
          </button>
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-2">
          <h2 className="text-3xl font-black text-slate-800">{profile.pageName || profile.name}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2 text-slate-500">
              <UserIcon size={16} className="text-slate-400" /> <span>{profile.ownerName}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <Phone size={16} className="text-slate-400" /> <span>{profile.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <Mail size={16} className="text-slate-400" /> <span>{profile.email}</span>
            </div>
          </div>
          <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
              প্রো সাবস্ক্রিপশন
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
              {profile.type}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Settings Groups */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 px-2">সাধারণ সেটিংস</h3>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            <SettingItem 
              icon={Building} 
              label={t.fbPageName} 
              value={profile.pageName} 
            />
            <SettingItem 
              icon={Globe} 
              label="অ্যাপের ভাষা (Language)" 
              value={lang === 'bn' ? 'বাংলা' : 'English'}
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            />
            <SettingItem 
              icon={Shield} 
              label="সিকিউরিটি ও পিন" 
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 px-2">বিলিং ও পেমেন্ট</h3>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            <SettingItem 
              icon={CreditCard} 
              label="সাবস্ক্রিপশন প্ল্যান" 
              value="প্রো (মাসিক ২৯৯ ৳)" 
            />
            <SettingItem 
              icon={CreditCard} 
              label="পেমেন্ট হিস্ট্রি" 
            />
            <div className="p-4 bg-slate-50">
              <button className="w-full bg-green-600 text-white py-3 rounded-2xl font-bold shadow-md hover:bg-green-700 active:scale-95 transition-all">
                সাবস্ক্রিপশন রিনিউ করুন
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingItem = ({ icon: Icon, label, value, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group"
  >
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-white transition-colors">
        <Icon size={20} className="text-slate-400 group-hover:text-green-600" />
      </div>
      <div className="text-left">
        <p className="font-bold text-slate-800 text-sm">{label}</p>
        {value && <p className="text-xs text-slate-500 mt-0.5">{value}</p>}
      </div>
    </div>
    <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500" />
  </button>
);

export default Profile;
