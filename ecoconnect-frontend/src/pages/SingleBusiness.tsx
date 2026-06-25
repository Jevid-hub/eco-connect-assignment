import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";
import ReviewsList from "../SingleBusiness/ReviewList";
import AddReviewForm from "../SingleBusiness/AddReview";

const BASE_URL = "https://6dayaqt2w1.execute-api.us-east-1.amazonaws.com/api";

// TYPE DEFINING
export interface DetailBusiness {
  BusinessId: string;
  title: string;
  summary: string;
}

export interface DetailReview {
  ReviewId: string;
  BusinessId: string;
  message: string;
  adminEmail?: string;
}

const BusinessDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();

  const [business, setBusiness] = useState<DetailBusiness | null>(null);
  const [reviews, setReviews] = useState<DetailReview[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCHING DATA - GETS BUSINESS AND ITS REVIEWS TOGETHER
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/business/${id}`);
        setBusiness(res.data.business);
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  // HANDLING SUBMIT FOR NEW REVIEW - REQUIRES LOGIN, REDIRECTS IF MISSING
  const handleAddReview = async (message: string) => {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    if (!token) {
      nav("/sign-in");
      return;
    }

    const res = await axios.post(
      `${BASE_URL}/reviews/${id}`,
      { message },
      { headers: { Authorization: token } }
    );
    setReviews((prev) => [...prev, res.data]);
  };

  if (loading) {
    return <p className="text-gray-400 text-center py-16">Loading...</p>;
  }

  if (!business) {
    return <p className="text-gray-400 text-center py-16">Business not found.</p>;
  }

  return (
    <div className="mx-auto w-full px-6 py-10">
      {/* BUSINESS INFO - KEPT HERE DIRECTLY, NO SEPARATE COMPONENT */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-left">{business.title}</h1>
        <p className="text-gray-500 mt-3 text-left">{business.summary}</p>
      </div>

      <ReviewsList reviews={reviews} />
      <AddReviewForm onSubmit={handleAddReview} />
    </div>
  );
};

export default BusinessDetail;