
import React, { useState } from 'react';
import { 
  Megaphone, 
  Sparkles, 
  Copy, 
  Share2, 
  MessageCircle,
  Loader2,
  CheckCircle2,
  Type as FontIcon,
  Tag,
  Target,
  Image as ImageIcon,
  Smartphone,
  Calendar,
  Download,
  RefreshCw,
  Wand2,
  Zap,
  Star,
  Gift,
  FileText,
  Heart,
  Clock,
  Layout,
  Send,
  Phone,
  ExternalLink
} from 'lucide-react';
import { InventoryItem, BusinessProfile } from '../types';
import { generateMarketingPost, generateMarketingImage } from '../services/gemini';

interface MarketingProps {
  t: any;
  inventory: InventoryItem[];
  profile: BusinessProfile;
}

const Marketing: React.FC<MarketingProps> = ({ t, inventory, profile }) => {
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [sendingSms, setSendingSms] = useState(false);
  const [product, setProduct] = useState('');
  const [goal, setGoal] = useState('New Product Launch');
  const [tone, setTone] = useState('Friendly');
  const [platform, setPlatform] = useState('Facebook');
  const [season, setSeason] = useState('None');
  const [contentType, setContentType] = useState('Social Media Post');
  
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsSent, setSmsSent] = useState(false);

  const templates = [
    { 
      id: 'sale', 
      label: t.templateSale, 
      icon: Zap, 
      color: 'text-amber-600 bg-amber-50',
      borderColor: 'border-amber-100',
      activeBorder: 'border-amber-500',
      goal: 'Discount', 
      tone: 'Excited', 
      platform: 'Facebook',
      contentType: 'Ad Copy'
    },
    { 
      id: 'new', 
      label: t.templateNew, 
      icon: Star, 
      color: 'text-blue-600 bg-blue-50',
      borderColor: 'border-blue-100',
      activeBorder: 'border-blue-500',
      goal: 'New Launch', 
      tone: 'Professional', 
      platform: 'Instagram',
      contentType: 'Social Media Post'
    },
    { 
      id: 'festival', 
      label: t.templateFestival, 
      icon: Gift, 
      color: 'text-red-600 bg-red-50',
      borderColor: 'border-red-100',
      activeBorder: 'border-red-500',
      goal: 'Festival', 
      tone: 'Friendly', 
      platform: 'Facebook',
      contentType: 'Ad Copy'
    },
    { 
      id: 'love', 
      label: t.templateLove, 
      icon: Heart, 
      color: 'text-pink-600 bg-pink-50',
      borderColor: 'border-pink-100',
      activeBorder: 'border-pink-500',
      goal: 'Brand', 
      tone: 'Friendly', 
      platform: 'Facebook',
      contentType: 'Social Media Post'
    },
    { 
      id: 'flash', 
      label: t.templateFlash, 
      icon: Clock, 
      color: 'text-purple-600 bg-purple-50',
      borderColor: 'border-purple-100',
      activeBorder: 'border-purple-500',
      goal: 'Discount', 
      tone: 'Excited', 
      platform: 'WhatsApp',
      contentType: 'Social Media Post'
    },
    { 
      id: 'guide', 
      label: t.templateGuide, 
      icon: FileText, 
      color: 'text-indigo-600 bg-indigo-50',
      borderColor: 'border-indigo-100',
      activeBorder: 'border-indigo-500',
      goal: 'Brand', 
      tone: 'Professional', 
      platform: 'Facebook',
      contentType: 'Social Media Post'
    }
  ];

  const handleSelectTemplate = (template: any) => {
    setGoal(template.goal);
    setTone(template.tone);
    setPlatform(template.platform);
    setContentType(template.contentType);
  };

  const isTemplateActive = (tpl: any) => {
    return goal === tpl.goal && tone === tpl.tone && platform === tpl.platform && contentType === tpl.contentType;
  };

  const handleGenerateText = async () => {
    if (!product) {
      alert("দয়া করে পণ্য বা বিষয় লিখুন।");
      return;
    }
    setLoading(true);
    setGeneratedImageUrl('');
    setGeneratedContent('');
    setSmsSent(false);
    
    try {
      const content = await generateMarketingPost(
        product, 
        goal, 
        tone, 
        profile.name, 
        platform, 
        season,
        contentType
      );
      setGeneratedContent(content || '');
    } catch (error) {
      console.error(error);
      alert("পোস্ট তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateOnlyImage = async () => {
    if (!product) {
      alert("পণ্য বা বিষয় ছাড়া ছবি তৈরি করা সম্ভব নয়।");
      return;
    }
    setLoadingImage(true);
    try {
      const imageUrl = await generateMarketingImage(product, profile.type, season);
      if (imageUrl) {
        setGeneratedImageUrl(imageUrl);
      } else {
        alert("দুঃখিত, এই মুহূর্তে ছবি তৈরি করা যাচ্ছে না।");
      }
    } catch (error) {
      console.error(error);
      alert("ছবি তৈরিতে সমস্যা হয়েছে।");
    } finally {
      setLoadingImage(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(generatedContent)}`;
    window.open(url, '_blank');
  };

  const handleSendSMS = async () => {
    if (!phoneNumber) {
      alert("দয়া করে গ্রাহকের ফোন নাম্বার লিখুন।");
      return;
    }
    if (!generatedContent) return;

    setSendingSms(true);
    // Hypothetical SMS Gateway Integration
    // Simulate API call
    setTimeout(() => {
      console.log(`Sending SMS to ${phoneNumber}: ${generatedContent}`);
      setSendingSms(false);
      setSmsSent(true);
      setTimeout(() => setSmsSent(false), 5000);
      alert("এসএমএস সফলভাবে পাঠানো হয়েছে।");
    }, 2000);
  };

  const downloadImage = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = `bizsahayok_ad_${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
            <Megaphone size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">এআই মার্কেটিং অ্যাসিস্ট্যান্ট (Pro)</h2>
            <p className="text-slate-500 text-sm">স্মার্ট কন্টেন্ট এবং ইমেজ দিয়ে সেলস বৃদ্ধি করুন</p>
          </div>
        </div>
        
        {/* Promotional Expert Link */}
        <a 
          href="https://www.nextdialbd.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-black transition-all group"
        >
          <Sparkles size={14} className="text-indigo-400 group-hover:animate-pulse" />
          Expert Telesales - NextDialBD
          <ExternalLink size={12} className="opacity-50" />
        </a>
      </div>

      {/* Templates Section */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Layout size={18} className="text-indigo-600" />
          <h3 className="font-black text-slate-800 uppercase tracking-wider text-sm">{t.quickStart}</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => handleSelectTemplate(tpl)}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all group ${
                isTemplateActive(tpl)
                ? `${tpl.activeBorder} bg-white shadow-md scale-105`
                : `bg-slate-50 ${tpl.borderColor} hover:border-indigo-300 hover:bg-white`
              }`}
            >
              <div className={`p-2 rounded-xl ${tpl.color}`}>
                <tpl.icon size={20} />
              </div>
              <span className={`text-[10px] font-black text-center ${isTemplateActive(tpl) ? 'text-indigo-700' : 'text-slate-600'}`}>
                {tpl.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-5 h-fit">
          <div className="space-y-1.5 pt-2">
            <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
              <Tag size={14} /> {t.productSelect}
            </label>
            <input 
              list="products"
              placeholder="পণ্যের নাম লিখুন..."
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold"
            />
            <datalist id="products">
              {inventory.map(item => (
                <option key={item.id} value={item.name} />
              ))}
            </datalist>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
              <FileText size={14} /> কন্টেন্ট এর ধরণ
            </label>
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
              {['Social Media Post', 'Ad Copy'].map((type) => (
                <button
                  key={type}
                  onClick={() => setContentType(type)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    contentType === type 
                    ? 'bg-white text-indigo-700 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {type === 'Social Media Post' ? 'সোশ্যাল পোস্ট' : 'অ্যাড কপি'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                <Target size={14} /> {t.marketingGoal}
              </label>
              <select 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
              >
                <option value="New Launch">নতুন পণ্য লঞ্চ</option>
                <option value="Discount">বিশেষ ছাড় (Discount)</option>
                <option value="Festival">উৎসবের অফার</option>
                <option value="Brand">ব্র্যান্ডিং (Awareness)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                <Smartphone size={14} /> {t.platformSelect}
              </label>
              <select 
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
              >
                <option value="Facebook">Facebook</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Instagram">Instagram</option>
                <option value="SMS">SMS (সরাসরি এসএমএস)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
              <Calendar size={14} /> {t.seasonSelect}
            </label>
            <select 
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
            >
              <option value="None">স্বাভাবিক সময়</option>
              <option value="Eid-ul-Fitr">ঈদুল ফিতর</option>
              <option value="Eid-ul-Adha">ঈদুল আযহা</option>
              <option value="Pohela Boishakh">পহেলা বৈশাখ</option>
              <option value="Puja">পূজা</option>
              <option value="Winter Season">শীতকালীন অফার</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
              <FontIcon size={14} /> {t.toneSelect}
            </label>
            <div className="flex gap-2">
              {['Friendly', 'Professional', 'Excited'].map((item) => (
                <button
                  key={item}
                  onClick={() => setTone(item)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                    tone === item 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' 
                    : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {item === 'Friendly' ? 'বন্ধুত্বপূর্ণ' : item === 'Professional' ? 'পেশাদার' : 'উত্তেজনাপূর্ণ'}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleGenerateText}
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
            কন্টেন্ট জেনারেট করুন
          </button>
        </div>

        {/* Result Card */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 relative flex flex-col min-h-[550px] shadow-2xl border border-slate-800 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center gap-2">
                <Wand2 size={12} className="text-indigo-400" />
                <span className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase">BizSahayok Creative AI</span>
              </div>
            </div>

            {!generatedContent && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 relative z-10">
                <div className="w-24 h-24 bg-slate-800 rounded-[2rem] flex items-center justify-center text-indigo-400 rotate-12 transition-transform hover:rotate-0 duration-500 shadow-xl border border-slate-700">
                  <Megaphone size={48} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">আপনার স্মার্ট মার্কেটিং কন্টেন্ট</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2 leading-relaxed">
                    উপরে টেমপ্লেট থেকে একটি ডিজাইন সিলেক্ট করুন অথবা পণ্যের নাম লিখে পোস্ট তৈরি করুন।
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 relative z-10">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
                  <Sparkles className="absolute inset-0 m-auto text-indigo-400 animate-pulse" size={36} />
                </div>
                <div className="space-y-1">
                  <p className="text-white font-bold text-lg">আপনার কন্টেন্ট তৈরি হচ্ছে...</p>
                  <p className="text-indigo-400 text-xs animate-pulse tracking-widest uppercase">Crafting the perfect message</p>
                </div>
              </div>
            )}

            {(generatedContent || generatedImageUrl) && !loading && (
              <div className="flex-1 flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full relative z-10">
                
                {/* Visual Preview Section */}
                {generatedImageUrl ? (
                  <div className="relative group overflow-hidden rounded-2xl border border-slate-700 shadow-2xl">
                    <img 
                      src={generatedImageUrl} 
                      alt="Generated Social Media Asset" 
                      className="w-full aspect-square md:aspect-video object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="flex gap-2 w-full">
                        <button 
                          onClick={handleGenerateOnlyImage}
                          disabled={loadingImage}
                          className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                        >
                          <RefreshCw size={14} className={loadingImage ? "animate-spin" : ""} /> অন্য ছবি তৈরি করুন
                        </button>
                        <button 
                          onClick={downloadImage}
                          className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 shadow-lg"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </div>
                    {loadingImage && (
                      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
                        <Loader2 className="text-indigo-500 animate-spin" size={32} />
                        <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest">{t.generatingImage}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  platform !== 'SMS' && (
                    <div className="bg-slate-800/50 border border-indigo-500/20 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 text-center">
                      <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400">
                        <ImageIcon size={32} />
                      </div>
                      <div>
                        <h4 className="text-white font-bold">ছবি যোগ করবেন?</h4>
                        <p className="text-slate-400 text-sm mt-1">এই কন্টেন্টের জন্য একটি আকর্ষণীয় এআই ইমেজ তৈরি করুন</p>
                      </div>
                      <button 
                        onClick={handleGenerateOnlyImage}
                        disabled={loadingImage}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black shadow-lg hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {loadingImage ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                        {t.generateImage}
                      </button>
                    </div>
                  )
                )}

                {/* Text Content Section */}
                {generatedContent && (
                  <div className="flex-1 bg-slate-800/40 border border-slate-700 rounded-2xl p-6 overflow-y-auto font-['Hind_Siliguri'] text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[300px] custom-scrollbar">
                    {generatedContent}
                  </div>
                )}

                {/* Bottom Actions & Sending Tools */}
                <div className="space-y-4 mt-auto">
                  {platform === 'SMS' && (
                    <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl space-y-4 animate-in slide-in-from-bottom-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                          <Phone size={16} />
                        </div>
                        <h4 className="text-sm font-bold text-white">গ্রাহকের ফোন নাম্বার</h4>
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="tel" 
                          placeholder="017XXXXXXXX"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <button 
                          onClick={handleSendSMS}
                          disabled={sendingSms || !phoneNumber}
                          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-indigo-900/40"
                        >
                          {sendingSms ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                          এসএমএস পাঠান
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500 italic">ব্যবহৃত হচ্ছে: BizSahayok SMS Gateway (Hypothetical)</p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button 
                      onClick={handleCopy}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-800 text-slate-300 py-4 rounded-2xl text-sm font-bold hover:bg-slate-700 transition-all active:scale-95 border border-slate-700 shadow-inner"
                    >
                      {copied ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                      {copied ? 'কপি হয়েছে' : t.copyContent}
                    </button>
                    {platform !== 'SMS' ? (
                      <button 
                        onClick={handleWhatsAppShare}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-2xl text-sm font-bold hover:bg-green-700 transition-all active:scale-95 shadow-xl shadow-green-900/20"
                      >
                        <MessageCircle size={18} />
                        {t.shareWhatsApp}
                      </button>
                    ) : (
                      <button 
                        className="flex-1 flex items-center justify-center gap-2 bg-indigo-600/10 text-indigo-400 py-4 rounded-2xl text-sm font-bold border border-indigo-500/20"
                        onClick={() => window.open('https://www.nextdialbd.com', '_blank')}
                      >
                        Expert Telesales Help
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5 flex items-start gap-4 shadow-sm">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
              <Sparkles size={20} />
            </div>
            <p className="text-sm text-amber-900 leading-relaxed font-medium">
              <span className="font-bold block text-amber-950 mb-1">প্রো টিপস:</span>
              আপনি চাইলে সরাসরি একটি টেমপ্লেট ক্লিক করে প্রয়োজনীয় ফিল্ডগুলো অটোমেটিক পূরণ করতে পারেন। এতে কন্টেন্ট তৈরি করা আরও দ্রুত এবং সহজ হয়।
            </p>
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.4);
        }
      `}</style>
    </div>
  );
};

export default Marketing;
