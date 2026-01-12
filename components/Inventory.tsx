
import React from 'react';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { InventoryItem } from '../types';

interface InventoryProps {
  t: any;
  inventory: InventoryItem[];
  setInventory: (i: InventoryItem[]) => void;
}

const Inventory: React.FC<InventoryProps> = ({ t, inventory, setInventory }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.inventory} ম্যানেজমেন্ট</h2>
          <p className="text-slate-500">আপনার স্টকের পরিমাণের উপর নজর রাখুন</p>
        </div>
        <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:bg-green-700">
          <Plus size={20} />
          নতুন আইটেম
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {inventory.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
            {item.quantity <= item.minStock && (
              <div className="absolute top-0 right-0 bg-orange-500 text-white p-1.5 rounded-bl-xl shadow-md">
                <AlertTriangle size={18} />
              </div>
            )}
            
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-green-50 transition-colors">
                <Package className="text-slate-400 group-hover:text-green-600" size={24} />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Edit size={16} />
                </button>
                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-1">{item.name}</h3>
            <p className="text-slate-500 text-sm mb-4">প্রতি {item.unit} মূল্য: {item.price} ৳</p>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-slate-500">বর্তমান স্টক</span>
                <span className={`text-xl font-black ${item.quantity <= item.minStock ? 'text-orange-600' : 'text-green-600'}`}>
                  {item.quantity} {item.unit}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${item.quantity <= item.minStock ? 'bg-orange-500' : 'bg-green-500'}`} 
                  style={{ width: `${Math.min((item.quantity / (item.minStock * 2)) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>ন্যূনতম স্টক: {item.minStock}</span>
                <span>সেফটি লেভেল</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 text-slate-600 py-2 rounded-xl text-sm font-bold hover:bg-slate-100">
                <ArrowDownLeft size={16} /> কমান
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 text-green-700 py-2 rounded-xl text-sm font-bold hover:bg-green-100">
                <ArrowUpRight size={16} /> যোগ করুন
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
