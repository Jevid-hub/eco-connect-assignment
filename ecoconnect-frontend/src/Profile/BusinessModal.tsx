import { useState } from "react";
import type { ProfileBusiness } from "../pages/Profile";

interface BusinessModalProps {
  existing?: ProfileBusiness;
  onClose: () => void;
  onSubmit: (data: { title: string; summary: string }) => Promise<void>;
}

// USED FOR BOTH ADD AND EDIT - "existing" PRESENT MEANS EDIT MODE
const BusinessModal = ({ existing, onClose, onSubmit }: BusinessModalProps) => {
  const [title, setTitle] = useState(existing?.title || "");
  const [summary, setSummary] = useState(existing?.summary || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit({ title, summary });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4 text-left">
          {existing ? "Edit Business" : "Add Business"}
        </h2>

        <label className="block text-sm font-semibold text-gray-700 text-left">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title..."
          className="w-full border border-gray-200 rounded-md px-3 py-2 mt-1 mb-4 outline-none focus:ring-2 focus:ring-[#B5481F]/30"
        />

        <label className="block text-sm font-semibold text-gray-700 text-left">Summary:</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Summary..."
          rows={4}
          className="w-full border border-gray-200 rounded-md px-3 py-2 mt-1 mb-4 outline-none focus:ring-2 focus:ring-[#B5481F]/30"
        />

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-[#B5481F] text-white rounded-md px-4 py-2 font-semibold disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
          <button onClick={onClose} className="text-gray-500 px-4 py-2 font-semibold">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessModal;