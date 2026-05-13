"use client";

import { useState } from "react";
import { Plus, Edit2, Search, Check, X } from "lucide-react";

interface Config { id: string; key: string; value: string; description: string; lastUpdated: string; isActive: boolean; }

const mockConfigs: Config[] = [
  { id: "1", key: "AI_MODEL_VERSION", value: "v2.3.1", description: "Current AI model version for disease detection", lastUpdated: "2026-04-20 14:30", isActive: true },
  { id: "2", key: "CONFIDENCE_THRESHOLD", value: "0.75", description: "Minimum confidence score to show predictions", lastUpdated: "2026-04-18 09:15", isActive: true },
  { id: "3", key: "MAX_IMAGE_SIZE_MB", value: "10", description: "Maximum upload image size in megabytes", lastUpdated: "2026-04-15 11:45", isActive: true },
  { id: "4", key: "RAG_CONTEXT_WINDOW", value: "5", description: "Number of knowledge base chunks to retrieve", lastUpdated: "2026-04-22 16:20", isActive: false },
];

export default function AdminConfigsPage() {
  const [configs, setConfigs] = useState(mockConfigs);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Config | null>(null);
  const [form, setForm] = useState({ key: "", value: "", description: "" });

  const filtered = configs.filter(c => c.key.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()));

  const handleEdit = (c: Config) => { setEditing(c); setForm({ key: c.key, value: c.value, description: c.description }); setShowModal(true); };
  const handleAdd = () => { setEditing(null); setForm({ key: "", value: "", description: "" }); setShowModal(true); };
  const handleSave = () => {
    if (editing) { setConfigs(prev => prev.map(c => c.id === editing.id ? { ...c, ...form, lastUpdated: new Date().toLocaleString() } : c)); }
    else { setConfigs(prev => [...prev, { id: Date.now().toString(), ...form, lastUpdated: new Date().toLocaleString(), isActive: true }]); }
    setShowModal(false);
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-[28px] font-[700] text-[#1B1B1B]">System Configuration</h1><p className="text-[14px] text-[#5C5C5C] mt-1">Manage system parameters and AI settings</p></div>
        <button onClick={handleAdd} className="h-10 px-4 rounded-lg bg-[#2F9E44] text-white text-[14px] font-[500] hover:bg-[#1F6F2E] flex items-center gap-2 cursor-pointer"><Plus className="w-4 h-4" /> Add Config</button>
      </div>

      <div className="mb-4"><div className="relative max-w-[400px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5C5C]" /><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search configs..." className="w-full h-10 pl-10 pr-4 rounded-lg border border-[#E0E0E0] text-[14px] focus:outline-none focus:border-[#2F9E44]" /></div></div>

      <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-[#F7F7F7] border-b border-[#E0E0E0]">
            <th className="text-left px-6 py-4 text-[13px] font-[600] text-[#1B1B1B]">Status</th>
            <th className="text-left px-6 py-4 text-[13px] font-[600] text-[#1B1B1B]">Key</th>
            <th className="text-left px-6 py-4 text-[13px] font-[600] text-[#1B1B1B]">Value</th>
            <th className="text-left px-6 py-4 text-[13px] font-[600] text-[#1B1B1B] hidden md:table-cell">Description</th>
            <th className="text-left px-6 py-4 text-[13px] font-[600] text-[#1B1B1B] hidden lg:table-cell">Last Updated</th>
            <th className="text-left px-6 py-4 text-[13px] font-[600] text-[#1B1B1B]">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id} className={`border-b border-[#E0E0E0] hover:bg-[#F7F7F7] ${i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}`}>
                <td className="px-6 py-4"><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${c.isActive ? "bg-[#2F9E44]" : "bg-[#E0E0E0]"}`} /><span className="text-[12px] text-[#5C5C5C]">{c.isActive ? "Active" : "Inactive"}</span></div></td>
                <td className="px-6 py-4"><code className="text-[13px] font-[600] text-[#1B1B1B] bg-[#F0F2F5] px-2 py-1 rounded">{c.key}</code></td>
                <td className="px-6 py-4"><span className="text-[14px] text-[#1B1B1B] font-[500]">{c.value}</span></td>
                <td className="px-6 py-4 hidden md:table-cell"><span className="text-[13px] text-[#5C5C5C]">{c.description}</span></td>
                <td className="px-6 py-4 hidden lg:table-cell"><span className="text-[12px] text-[#5C5C5C]">{c.lastUpdated}</span></td>
                <td className="px-6 py-4"><button onClick={() => handleEdit(c)} className="h-8 px-3 rounded-lg border border-[#E0E0E0] text-[13px] text-[#2F9E44] hover:bg-[#E6F4EA] flex items-center gap-1.5 cursor-pointer"><Edit2 className="w-3.5 h-3.5" /> Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl max-w-[500px] w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0]">
              <h3 className="text-[18px] font-[700] text-[#1B1B1B]">{editing ? "Edit Config" : "Add New Config"}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center cursor-pointer"><X className="w-5 h-5 text-[#5C5C5C]" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div><label className="text-[14px] font-[500] text-[#1B1B1B] mb-2 block">Config Key</label><input type="text" value={form.key} onChange={e => setForm({ ...form, key: e.target.value })} disabled={!!editing} className="w-full h-10 px-3 rounded-lg border border-[#E0E0E0] text-[14px] focus:outline-none focus:border-[#2F9E44] disabled:bg-[#F7F7F7]" /></div>
              <div><label className="text-[14px] font-[500] text-[#1B1B1B] mb-2 block">Value</label><input type="text" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-[#E0E0E0] text-[14px] focus:outline-none focus:border-[#2F9E44]" /></div>
              <div><label className="text-[14px] font-[500] text-[#1B1B1B] mb-2 block">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border border-[#E0E0E0] text-[14px] resize-none focus:outline-none focus:border-[#2F9E44]" /></div>
            </div>
            <div className="px-6 py-4 border-t border-[#E0E0E0] flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="h-10 px-4 rounded-lg border border-[#E0E0E0] text-[14px] text-[#5C5C5C] hover:bg-[#F0F2F5] cursor-pointer">Cancel</button>
              <button onClick={handleSave} className="h-10 px-4 rounded-lg bg-[#2F9E44] text-white text-[14px] font-[500] hover:bg-[#1F6F2E] cursor-pointer flex items-center gap-2"><Check className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
