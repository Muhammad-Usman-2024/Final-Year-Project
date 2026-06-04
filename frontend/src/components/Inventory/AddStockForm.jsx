import React, { useState, useEffect } from 'react';
import { PlusCircle, Calendar, ShieldCheck, Info, Loader2, Barcode } from 'lucide-react';
import { inventoryService } from '../../api/apiService';
import toast from 'react-hot-toast';

const AddStockForm = () => {
  const [formData, setFormData] = useState({
    group: 'A+',
    component: 'RBC',
    units: 1,
    collectedDate: new Date().toISOString().split('T')[0],
    hospitalId: 'central-bank',
    batchId: '',
    source: 'Walk-in donor'
  });

  const [expiryHint, setExpiryHint] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let days = 42;
    if (formData.component === 'Platelets') days = 5;
    if (formData.component === 'FFP') days = 365;

    const expiryDate = new Date(formData.collectedDate);
    expiryDate.setDate(expiryDate.getDate() + days);
    setExpiryHint(expiryDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));
  }, [formData.component, formData.collectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await inventoryService.addStock(formData);
      toast.success('Stock added successfully!');
      setFormData({...formData, batchId: ''}); // Reset batch ID
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in max-w-4xl mx-auto">
      <div className="bg-card-bg border border-border-color p-8 rounded-[32px] space-y-8 relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-3 bg-accent-blue/10 rounded-2xl text-accent-blue">
            <PlusCircle size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold">Add to Inventory</h3>
            <p className="text-sm text-gray-500">Register new blood units into the system</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Blood Group</label>
            <select 
              className="input-field bg-secondary-bg"
              value={formData.group}
              onChange={(e) => setFormData({...formData, group: e.target.value})}
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Component Type</label>
            <select 
              className="input-field bg-secondary-bg"
              value={formData.component}
              onChange={(e) => setFormData({...formData, component: e.target.value})}
            >
              <option value="RBC">Packed RBCs (Red Blood Cells)</option>
              <option value="Platelets">Platelets</option>
              <option value="FFP">FFP (Fresh Frozen Plasma)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Quantity (Bags)</label>
            <input 
              type="number" 
              className="input-field bg-secondary-bg" 
              value={formData.units}
              onChange={(e) => setFormData({...formData, units: Number(e.target.value)})}
              min="1"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Batch ID / Barcode</label>
            <div className="relative">
              <input 
                placeholder="Scan or type Batch ID..." 
                className="input-field bg-secondary-bg pl-10" 
                value={formData.batchId}
                onChange={(e) => setFormData({...formData, batchId: e.target.value})}
                required
              />
              <Barcode size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Collection Date</label>
            <input 
              type="date" 
              className="input-field bg-secondary-bg" 
              value={formData.collectedDate}
              onChange={(e) => setFormData({...formData, collectedDate: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Source</label>
            <select 
              className="input-field bg-secondary-bg"
              value={formData.source}
              onChange={(e) => setFormData({...formData, source: e.target.value})}
            >
              <option>Walk-in donor</option>
              <option>Camp donation</option>
              <option>Transfer from another bank</option>
            </select>
          </div>

          <div className="md:col-span-2 p-4 bg-accent-blue/5 border border-accent-blue/10 rounded-2xl flex items-start gap-4">
            <Info size={20} className="text-accent-blue shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-gray-300 font-medium">Automatic Expiry Calculation</p>
              <p className="text-gray-500 mt-1">Based on medical standards for <span className="text-white">{formData.component}</span>, this batch will expire on: <span className="text-accent-orange font-bold">{expiryHint}</span>.</p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="md:col-span-2 submit-btn flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <PlusCircle size={18} />}
            Add Units to Inventory
          </button>
        </form>

        {/* Decorative background glow */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent-blue/10 blur-[100px] rounded-full"></div>
      </div>
    </div>
  );
};

export default AddStockForm;
