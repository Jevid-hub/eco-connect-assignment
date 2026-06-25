import { useState } from "react";

interface AddReviewFormProps {
  onSubmit: (message: string) => Promise<void>;
}

const AddReviewForm = ({ onSubmit }: AddReviewFormProps) => {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // HANDLING SUBMIT - CLEARS INPUT AFTER SUCCESS
  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(message);
      setMessage("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-start">
      <h2 className="text-2xl font-bold mb-4 text-left">Add Your Review</h2>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter Your Review...."
        className="w-full border border-gray-200 rounded-md px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-[#B5481F]/30"
      />
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="bg-[#B5481F] text-white font-bold rounded-md px-8 py-3 w-fit disabled:opacity-50"
      >
        {submitting ? "..." : "Add"}
      </button>
    </div>
  );
};

export default AddReviewForm;