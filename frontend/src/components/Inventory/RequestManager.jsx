import React, { useEffect, useState } from 'react';
import { Send, Clock, CheckCircle2, Truck, Package, AlertCircle, X, Droplets, Loader2 } from 'lucide-react';
import { inventoryService } from '../../api/apiService';
import toast from 'react-hot-toast';

const CreateRequestModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    bloodGroup: '',
    component: '',
    units: '',
    priority: 'Routine',
    requiredBy: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await inventoryService.requestBlood({
        bloodGroup: form.bloodGroup,
        component: form.component,
        units: Number(form.units),
        priority: form.priority,
        requiredBy: form.requiredBy,
      });
      toast.success('Blood request created');
      onCreated();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center">
              <Droplets size={18} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Create Blood Request</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Request blood from network</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Blood Group</label>
              <select required value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all">
                <option value="" disabled className="bg-[#0f0f0f]">Select</option>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((group) => (
                  <option key={group} value={group} className="bg-[#0f0f0f]">{group}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Component</label>
              <select required value={form.component} onChange={(e) => setForm({ ...form, component: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all">
                <option value="" disabled className="bg-[#0f0f0f]">Select</option>
                {['RBC', 'Platelets', 'FFP'].map((component) => (
                  <option key={component} value={component} className="bg-[#0f0f0f]">{component}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Units Required</label>
              <input type="number" min="1" max="50" required value={form.units} onChange={(e) => setForm({ ...form, units: e.target.value })} placeholder="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Required By</label>
              <input type="date" required value={form.requiredBy} onChange={(e) => setForm({ ...form, requiredBy: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Priority Level</label>
            <div className="grid grid-cols-3 gap-2">
              {['Routine', 'Urgent', 'Emergency'].map((priority) => (
                <button key={priority} type="button" onClick={() => setForm({ ...form, priority })} className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  form.priority === priority
                    ? priority === 'Emergency'
                      ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                      : priority === 'Urgent'
                        ? 'bg-orange-500 border-orange-400 text-white'
                        : 'bg-white/15 border-white/20 text-white'
                    : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'
                }`}>
                  {priority}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-widest hover:bg-red-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" size={14} /> : <><Send size={14} /> Submit Request</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RequestManager = () => {
  const [showModal, setShowModal] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await inventoryService.getRequests();
      setRequests(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const approveRequest = async (id) => {
    setActionLoading(id);
    try {
      await inventoryService.approveRequest(id);
      toast.success('Request approved');
      await loadRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve request');
    } finally {
      setActionLoading('');
    }
  };

  const fulfillRequest = async (id) => {
    setActionLoading(id);
    try {
      await inventoryService.fulfillRequest(id);
      toast.success('Request fulfilled');
      await loadRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fulfill request');
    } finally {
      setActionLoading('');
    }
  };

  const getPriorityColor = (priority) => {
    if (priority === 'Emergency') return 'bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]';
    if (priority === 'Urgent') return 'bg-orange-500 text-white';
    return 'bg-white/10 text-gray-400';
  };

  const timeLabel = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'No data';
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const renderActionButton = (request) => {
    if (request.status === 'Pending') {
      return (
        <button
          disabled={actionLoading === request._id}
          onClick={() => approveRequest(request._id)}
          className="px-6 py-2 bg-accent-green text-white text-xs font-bold rounded-xl hover:bg-accent-green/90 transition-colors disabled:opacity-50"
        >
          {actionLoading === request._id ? 'Working...' : 'Approve Request'}
        </button>
      );
    }

    if (request.status === 'Approved') {
      return (
        <button
          disabled={actionLoading === request._id}
          onClick={() => fulfillRequest(request._id)}
          className="px-6 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-500 transition-colors disabled:opacity-50"
        >
          {actionLoading === request._id ? 'Working...' : 'Dispatch Request'}
        </button>
      );
    }

    return (
      <button disabled className="px-6 py-2 bg-white/5 text-gray-500 text-xs font-bold rounded-xl border border-white/5 cursor-not-allowed">
        {request.status || 'No data'}
      </button>
    );
  };

  return (
    <>
      {showModal && <CreateRequestModal onClose={() => setShowModal(false)} onCreated={loadRequests} />}

      <div className="fade-in space-y-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Incoming Blood Requests</h2>
            <p className="text-sm text-gray-500">Manage and fulfill hospital requirements</p>
          </div>
          <button onClick={() => setShowModal(true)} className="submit-btn !w-auto px-6 py-2 text-sm flex items-center gap-2">
            <Send size={16} /> Create New Request
          </button>
        </div>

        {loading ? (
          <div className="min-h-[220px] flex items-center justify-center gap-3 text-gray-500">
            <Loader2 className="animate-spin text-accent-red" /> Loading requests...
          </div>
        ) : requests.length ? (
          <div className="grid grid-cols-1 gap-4">
            {requests.map((request) => (
              <div key={request._id} className="bg-card-bg border border-border-color rounded-2xl overflow-hidden group hover:border-white/20 transition-all">
                <div className="flex flex-col md:flex-row">
                  <div className={`w-2 md:w-3 ${request.priority === 'Emergency' ? 'bg-red-600' : request.priority === 'Urgent' ? 'bg-orange-500' : 'bg-white/10'}`} />
                  <div className="flex-1 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold text-red-500">{request.bloodGroup || 'No data'}</span>
                        <span className="text-[8px] font-bold uppercase text-gray-500">{request.component || 'No data'}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-bold text-lg">{request.requestingHospital || 'No data'}</h4>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${getPriorityColor(request.priority)}`}>
                            {request.priority || 'No data'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 flex items-center gap-2">
                          <Package size={14} /> {request.units || 0} Units Required - <Clock size={14} /> Required by {timeLabel(request.requiredBy)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 px-8 border-x border-white/5">
                      {[
                        { label: 'Pending', icon: <Clock size={14} />, activeColor: 'border-orange-500 bg-orange-500/20' },
                        { label: 'Approved', icon: <CheckCircle2 size={14} />, activeColor: 'border-green-500 bg-green-500/20' },
                        { label: 'Dispatched', icon: <Truck size={14} />, activeColor: 'border-blue-500 bg-blue-500/20' },
                      ].map((step, index) => (
                        <React.Fragment key={step.label}>
                          {index > 0 && <div className="w-8 h-0.5 bg-white/5" />}
                          <div className="flex flex-col items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${request.status === step.label ? step.activeColor : 'border-white/5 bg-white/5 text-gray-600'}`}>
                              {step.icon}
                            </div>
                            <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">{step.label}</span>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2 w-full md:w-auto">
                      {renderActionButton(request)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="min-h-[260px] rounded-2xl border border-dashed border-white/10 bg-card-bg flex flex-col items-center justify-center text-gray-500">
            <AlertCircle size={28} className="mb-3 opacity-50" />
            <p className="text-sm font-bold">No data</p>
          </div>
        )}
      </div>
    </>
  );
};

export default RequestManager;
