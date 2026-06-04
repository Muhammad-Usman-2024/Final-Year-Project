import React, { useState } from 'react';
import { LayoutDashboard, PlusCircle, Repeat, BarChart3, Bell } from 'lucide-react';
import StockDashboard from './StockDashboard';
import AddStockForm from './AddStockForm';
import RequestManager from './RequestManager';
import InventoryAnalytics from './InventoryAnalytics';

const InventoryDashboard = () => {
  const [activeTab, setActiveTab] = useState('stock');

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10">
      {/* Inventory Module Navigation */}
      <div className="flex flex-wrap gap-2 justify-center bg-secondary-bg/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-sm sticky top-4 z-50">
        <button 
          className={`tab-btn px-6 py-2.5 ${activeTab === 'stock' ? 'active' : ''}`}
          onClick={() => setActiveTab('stock')}
        >
          <LayoutDashboard size={18} /> Stock status
        </button>
        <button 
          className={`tab-btn px-6 py-2.5 ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          <PlusCircle size={18} /> Add inventory
        </button>
        <button 
          className={`tab-btn px-6 py-2.5 ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          <Repeat size={18} /> Requests
        </button>
        <button 
          className={`tab-btn px-6 py-2.5 ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={18} /> Analytics
        </button>
      </div>

      {/* Dynamic Tab Content */}
      <div className="min-h-[700px]">
        {activeTab === 'stock' && <StockDashboard />}
        {activeTab === 'add' && <AddStockForm />}
        {activeTab === 'requests' && <RequestManager />}
        {activeTab === 'analytics' && <InventoryAnalytics />}
      </div>
    </div>
  );
};

export default InventoryDashboard;
