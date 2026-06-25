import type { DetailReview } from "../pages/SingleBusiness";

// TYPE DEFINING
interface ReviewsListProps {
  reviews: DetailReview[];
}

// RECIVING PROPS AND APPLYING LIFTING UP
const ReviewsList = ({ reviews }: ReviewsListProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-left">Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-400">No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.ReviewId} className="mb-5">
            <p className="text-sm text-gray-700 text-left">{review.message}</p>
            <p className="text-sm font-bold mt-1 text-left">{review.adminEmail}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewsList;