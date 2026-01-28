import { useState } from "react";

export interface ProverbsCardProps {
  proverbs: string[];
  onUpdateProverbs: (proverbs: string[]) => void;
  updateUserMouseEvent?: (type: "click" | "hover" | "check", value: string | null) => void;
}

export function ProverbsCard({ proverbs, onUpdateProverbs, updateUserMouseEvent }: ProverbsCardProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newProverb, setNewProverb] = useState("");

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(proverbs[index]);
  };

  const handleSave = (index: number) => {
    const newProverbs = [...proverbs];
    newProverbs[index] = editValue;
    onUpdateProverbs(newProverbs);
    setEditingIndex(null);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  const handleAdd = () => {
    if (newProverb.trim()) {
      onUpdateProverbs([...proverbs, newProverb.trim()]);
      setNewProverb("");
    }
  };

  const handleDelete = (index: number) => {
    onUpdateProverbs(proverbs.filter((_, i) => i !== index));
  };

  const parentFieldName = 'proverbs'

  return (
    <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-indigo-900/50 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200 mb-1">Proverbs</h1>
          <p className="text-indigo-200/60 text-sm">Wisdom collection</p>
        </div>
        <div className="bg-indigo-500/20 px-3 py-1 rounded-full text-xs text-indigo-200 border border-indigo-500/30">
          {proverbs?.length || 0} items
        </div>
      </div>
      
      <div className="flex flex-col gap-20  overflow-y-auto pr-2 custom-scrollbar">
        {proverbs?.map((proverb, index) => (
          <div 
            key={index} 
            className="group bg-zinc-700 border border-zinc-600/30 checked:bg-black checked:border-zinc-500 p-4 rounded-xl text-slate-100 relative transition-all duration-200"
            onClick={() => updateUserMouseEvent?.('click', `${parentFieldName}[${index}]`)}
            onMouseEnter={() => updateUserMouseEvent?.('hover', `${parentFieldName}[${index}]`)}
            onMouseLeave={() => updateUserMouseEvent?.('hover', null)}
          >
            {editingIndex === index ? (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 bg-slate-900/50 text-white border border-slate-600 rounded-lg px-3 py-2 outline-none focus:border-blue-500 transition-colors"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave(index);
                    if (e.key === 'Escape') handleCancel();
                  }}
                />
                <button
                  onClick={() => handleSave(index)}
                  className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 rounded-lg p-2 transition-colors"
                  title="Save"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-slate-500/20 hover:bg-slate-500/30 text-slate-400 border border-slate-500/50 rounded-lg p-2 transition-colors"
                  title="Cancel"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#000" stroke="#000000ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-start gap-4">
                <p className="text-lg font-light leading-relaxed">{proverb}</p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 shrink-0">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleEdit(index); }}
                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(index); }}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {proverbs?.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/30">
          <p className="text-slate-500 italic">No proverbs yet.</p>
          <p className="text-slate-600 text-sm mt-1">Ask the assistant to add some!</p>
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <input
          type="text"
          value={newProverb}
          onChange={(e) => setNewProverb(e.target.value)}
          placeholder="Add a new proverb..."
          className="flex-1 bg-blue-500 text-black placeholder-slate-500 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd();
          }}
        />
        <button
          onClick={handleAdd}
          disabled={!newProverb.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-black px-6 py-2 rounded-xl font-medium transition-all shadow-lg shadow-blue-900/20"
        >
          Add
        </button>
      </div>
    </div>
  );
}
