
import React, { useState } from 'react';
import { 
  Search, 
  Send, 
  UserCircle, 
  CheckCircle2, 
  ShoppingBag, 
  AlertCircle,
  Sparkles,
  Loader2,
  // Fix: Added missing MessageCircle import from lucide-react
  MessageCircle
} from 'lucide-react';
import { WhatsAppMessage, BusinessProfile } from '../types';
import { classifyWhatsAppMessage } from '../services/gemini';

interface WhatsAppInboxProps {
  t: any;
  messages: WhatsAppMessage[];
  setMessages: (m: WhatsAppMessage[]) => void;
  profile: BusinessProfile;
}

const WhatsAppInbox: React.FC<WhatsAppInboxProps> = ({ t, messages, setMessages, profile }) => {
  const [selectedId, setSelectedId] = useState<string | null>(messages[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isClassifying, setIsClassifying] = useState(false);

  const selectedMessage = messages.find(m => m.id === selectedId);

  const handleClassify = async (msg: WhatsAppMessage) => {
    setIsClassifying(true);
    try {
      const result = await classifyWhatsAppMessage(msg.content, profile.type);
      const updatedMessages = messages.map(m => 
        m.id === msg.id 
          ? { 
              ...m, 
              category: result.category, 
              suggestedReply: result.suggested_reply 
            } 
          : m
      );
      setMessages(updatedMessages);
    } catch (err) {
      console.error(err);
    } finally {
      setIsClassifying(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'order': return <ShoppingBag size={14} className="text-blue-600" />;
      case 'price_inquiry': return <Sparkles size={14} className="text-green-600" />;
      case 'complaint': return <AlertCircle size={14} className="text-red-600" />;
      default: return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'order': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'price_inquiry': return 'bg-green-50 text-green-700 border-green-100';
      case 'complaint': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex">
      {/* Sidebar List */}
      <div className="w-1/3 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="সার্চ করুন..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <MessageCircle size={40} className="mx-auto mb-2 opacity-20" />
              <p>{t.noMessages}</p>
            </div>
          ) : (
            messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelectedId(msg.id)}
                className={`
                  w-full text-left p-4 border-b border-slate-50 transition-colors
                  ${selectedId === msg.id ? 'bg-green-50' : 'hover:bg-slate-50'}
                `}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="font-bold text-slate-800">{msg.sender}</span>
                  <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                </div>
                <p className="text-sm text-slate-600 truncate">{msg.content}</p>
                {msg.category && (
                  <div className={`mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] border ${getCategoryColor(msg.category)}`}>
                    {getCategoryIcon(msg.category)}
                    {msg.category.replace('_', ' ')}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat View */}
      <div className="flex-1 flex flex-col bg-slate-50">
        {selectedMessage ? (
          <>
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCircle size={40} className="text-slate-300" />
                <div>
                  <h4 className="font-bold text-slate-800">{selectedMessage.sender}</h4>
                  <p className="text-xs text-green-600 font-medium">অনলাইন</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleClassify(selectedMessage)}
                  disabled={isClassifying}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  {isClassifying ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  {t.classify}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-200">
                  <p className="text-slate-800">{selectedMessage.content}</p>
                  <p className="text-[10px] text-slate-400 mt-2 text-right">{selectedMessage.timestamp}</p>
                </div>
              </div>

              {selectedMessage.suggestedReply && (
                <div className="flex flex-col items-center py-4">
                  <div className="w-full max-w-md bg-green-100/50 border border-green-200 p-4 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-green-800 font-bold text-sm">
                      <Sparkles size={16} />
                      {t.suggestedReply}
                    </div>
                    <p className="text-slate-700 italic">"{selectedMessage.suggestedReply}"</p>
                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 bg-green-600 text-white py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-green-700">
                        <Send size={14} /> {t.sendReply}
                      </button>
                      {selectedMessage.category === 'order' && (
                        <button className="flex-1 bg-white border border-green-600 text-green-600 py-2 rounded-xl text-sm font-bold hover:bg-green-50">
                          {t.convertOrder}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="মেসেজ লিখুন..."
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button className="p-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-md">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40">
            <MessageCircle size={80} className="mb-4 text-slate-400" />
            <p className="text-xl font-bold text-slate-500">মেসেজ শুরু করতে যেকোনো চ্যাট সিলেক্ট করুন</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppInbox;
