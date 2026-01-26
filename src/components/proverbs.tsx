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
    <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-2xl w-full">
      <h1 className="text-4xl font-bold text-white mb-2 text-center">Proverbs</h1>
      <p className="text-gray-200 text-center italic mb-6">This is a demonstrative page, but it could be anything you want! 🪁</p>
      <hr className="border-white/20 my-6" />
      
      <div className="flex flex-col gap-3">
        {proverbs?.map((proverb, index) => (
          <div 
            key={index} 
            className="bg-white/15 p-4 rounded-xl text-white relative group hover:bg-white/20 transition-all"
            onClick={() => updateUserMouseEvent?.('click', `${parentFieldName}[${index}]`)}
            onMouseEnter={() => updateUserMouseEvent?.('hover', `${parentFieldName}[${index}]`)}
            onMouseLeave={() => updateUserMouseEvent?.('hover', null)}
          >
            {editingIndex === index ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full bg-white/10 text-white rounded px-2 py-1 outline-none focus:bg-white/20"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave(index);
                    if (e.key === 'Escape') handleCancel();
                  }}
                />
                <button
                  onClick={() => handleSave(index)}
                  className="bg-green-500 hover:bg-green-600 text-white rounded p-1"
                  title="Save"
                >
                  ✓
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white rounded p-1"
                  title="Cancel"
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <p className="pr-16">{proverb}</p>
                <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button 
                    onClick={() => handleEdit(index)}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full h-6 w-6 flex items-center justify-center"
                    title="Edit"
                  >
                    ✎
                  </button>
                  <button 
                    onClick={() => handleDelete(index)}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {proverbs?.length === 0 && <p className="text-center text-white/80 italic my-8">
        No proverbs yet. Ask the assistant to add some!
      </p>}

      <div className="mt-6 flex gap-2">
        <input
          type="text"
          value={newProverb}
          onChange={(e) => setNewProverb(e.target.value)}
          placeholder="Add a new proverb..."
          className="flex-1 bg-white/10 text-white placeholder-white/50 rounded-xl px-4 py-2 outline-none focus:bg-white/20 transition-all"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd();
          }}
        />
        <button
          onClick={handleAdd}
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-medium transition-all"
        >
          Add
        </button>
      </div>
    </div>
  );
}
