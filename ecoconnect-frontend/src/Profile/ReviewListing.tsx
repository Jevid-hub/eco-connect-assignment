import { Pencil, Trash2 } from "lucide-react";
import type { ProfileReview } from "../pages/Profile";

interface ReviewListingProps {
  reviews: ProfileReview[];
  onEdit: (review: ProfileReview) => void;
  onDelete: (reviewId: string) => void;
}

// RECEIVES THE ENTIRE REVIEWS ARRAY FROM Profile AND MAPS OVER IT
const ReviewListing = ({ reviews, onEdit, onDelete }: ReviewListingProps) => {
  if (reviews.length === 0) {
    return <p className="text-gray-400">No reviews yet.</p>;
  }

  return (
    <div>
      {reviews.map((review) => (
        <div key={review.ReviewId} className="py-4 border-b border-gray-100">
          <p className="text-sm text-gray-600 text-left">{review.message}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-semibold text-gray-800">
              {review.adminEmail}
            </span>
            <button onClick={() => onEdit(review)} aria-label="Edit review">
              <Pencil size={14} className="text-gray-500" />
            </button>
            <button
              onClick={() => onDelete(review.ReviewId)}
              aria-label="Delete review"
            >
              <Trash2 size={14} className="text-gray-500" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewListing;