import { useState } from "react";
import type { ProfileReview } from "../pages/Profile";

interface EditReviewModalProps {
  review: ProfileReview;
  onClose: () => void;
  onSubmit: (reviewId: string, message: string) => Promise<void>;
}

const EditReviewModal = ({ review, onClose, onSubmit }: EditReviewModalProps) => {
  const [message, setMessage] = useState(review.message);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(review.ReviewId, message);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4 text-left">Edit Message</h2>

        <label className="block text-sm font-semibold text-gray-700 text-left">Message:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="This the message to be edited..."
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

export default EditReviewModal;