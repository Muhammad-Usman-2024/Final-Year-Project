import React, { useState, useEffect } from 'react';
import { ShieldCheck, Calendar, Clock, User, Fingerprint, Search } from 'lucide-react';
import { adminService } from '../../api/apiService';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await adminService.getAuditLogs();
                setLogs(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-card-bg border border-border-color rounded-[40px] overflow-hidden space-y-0">
            {/* Search Header */}
            <div className="p-8 border-b border-white/5 bg-white/[0.01]">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search logs by action, resource or user..." 
                        className="input-field pl-12 bg-secondary-bg/50 border-white/5"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Logs List */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] bg-white/[0.01]">
                            <th className="px-8 py-6">Timestamp</th>
                            <th className="px-8 py-6">Action</th>
                            <th className="px-8 py-6">Resource</th>
                            <th className="px-8 py-6">Actor</th>
                            <th className="px-8 py-6 text-right">Result</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-8 py-20 text-center text-gray-500 italic">
                                    Decoding system trail...
                                </td>
                            </tr>
                        ) : filteredLogs.length > 0 ? (
                            filteredLogs.map((log) => (
                                <tr key={log._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <Calendar size={12} />
                                            <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                                            <span className="text-gray-600">•</span>
                                            <Clock size={12} />
                                            <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-lg ${
                                                log.action.includes('ROLE') ? 'bg-accent-purple/20 text-accent-purple' :
                                                log.action.includes('STATUS') ? 'bg-accent-orange/20 text-accent-orange' :
                                                'bg-accent-blue/20 text-accent-blue'
                                            }`}>
                                                <ShieldCheck size={14} />
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-widest text-white">{log.action}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs text-gray-400 font-medium truncate max-w-[200px]" title={log.resource}>{log.resource}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <User size={12} className="text-gray-500" />
                                            <div>
                                                <p className="text-xs font-bold text-white leading-none">{log.userId?.fullName || 'System'}</p>
                                                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">IP: {log.ip || '127.0.0.1'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                                            log.result === 'Success' ? 'text-accent-green bg-accent-green/10' : 'text-accent-red bg-accent-red/10'
                                        }`}>
                                            {log.result}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-8 py-20 text-center text-gray-500 italic">No logs found matching your criteria.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogs;
