import { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import BusinessListing from "../Profile/BusinessListing";
import BusinessModal from "../Profile/BusinessModal";
import EditReviewModal from "../Profile/ReviewModal";
import ReviewListing from "../Profile/ReviewListing";

const BASE_URL = "https://6dayaqt2w1.execute-api.us-east-1.amazonaws.com/api";

export interface ProfileBusiness {
  BusinessId: string;
  title: string;
  summary: string;
  admin: string;
  adminEmail?: string;
}

export interface ProfileReview {
  BusinessId: string;
  ReviewId: string;
  message: string;
  admin: string;
  adminEmail?: string;
}

type Tab = "business" | "reviews";

const Profile = () => {
  const [email, setEmail] = useState("");
  const [businesses, setBusinesses] = useState<ProfileBusiness[]>([]);
  const [reviews, setReviews] = useState<ProfileReview[]>([]);
  const [tab, setTab] = useState<Tab>("reviews");
  const [loading, setLoading] = useState(true);

  const [showAddBiz, setShowAddBiz] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<ProfileBusiness | null>(null);
  const [editingReview, setEditingReview] = useState<ProfileReview | null>(null);

  const nav = useNavigate();

  // FETCHING DATA - ON PAGE LOAD GET THE LOGGED IN ADMIN'S BUSINESS AND REVIEWS
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const user = await getCurrentUser();
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();
        const headers = { Authorization: token };

        const res = await axios.get(`${BASE_URL}/admin`, { headers });

        setEmail(user.signInDetails?.loginId || "");
        setBusinesses(res.data.businesses || []);
        setReviews(res.data.reviews || []);
      } catch {
        nav("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // HANDLING SUBMIT FOR NEW BUSINESS - ADDS TO TOP OF LIST AFTER SUCCESS
  const handleAddBusiness = async (data: { title: string; summary: string }) => {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    const res = await axios.post(`${BASE_URL}/business`, data, {
      headers: { Authorization: token },
    });
    setBusinesses((prev) => [res.data, ...prev]);
  };

  const handleUpdateBusiness = async (data: { title: string; summary: string }) => {
    if (!editingBusiness) return;
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    await axios.put(`${BASE_URL}/business/${editingBusiness.BusinessId}`, data, {
      headers: { Authorization: token },
    });
    setBusinesses((prev) =>
      prev.map((b) =>
        b.BusinessId === editingBusiness.BusinessId ? { ...b, ...data } : b
      )
    );
  };

  // HANDLING DELETE FOR BUSINESS - ASKS FOR CONFIRMATION FIRST
  const handleDeleteBusiness = async (businessId: string) => {
    if (!confirm("Delete this business?")) return;
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    await axios.delete(`${BASE_URL}/business/${businessId}`, {
      headers: { Authorization: token },
    });
    setBusinesses((prev) => prev.filter((b) => b.BusinessId !== businessId));
  };

  const handleEditReview = async (reviewId: string, message: string) => {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    const review = reviews.find((r) => r.ReviewId === reviewId);
    await axios.put(
      `${BASE_URL}/reviews/${review?.BusinessId}/${reviewId}`,
      { message },
      { headers: { Authorization: token } }
    );
    setReviews((prev) =>
      prev.map((r) => (r.ReviewId === reviewId ? { ...r, message } : r))
    );
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Delete this review?")) return;
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    const review = reviews.find((r) => r.ReviewId === reviewId);
    await axios.delete(`${BASE_URL}/reviews/${review?.BusinessId}/${reviewId}`, {
      headers: { Authorization: token },
    });
    setReviews((prev) => prev.filter((r) => r.ReviewId !== reviewId));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 text-gray-400">
        <div className="w-9 h-9 border-4 border-gray-200 border-t-[#B5481F] rounded-full animate-spin" />
        <p className="text-sm">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white mx-auto px-6 py-8 w-full">
      <p className="text-gray-700 font-medium mb-4 text-2xl text-left">{email}</p>

      {/* TAB SWITCHING LOGIC */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTab("reviews")}
            className={`px-1 py-1.5 font-semibold ${
              tab === "reviews" ? "bg-[#B5481F] text-white" : "text-[#B5481F]"
            }`}
          >
            Reviews
          </button>
          <button
            onClick={() => setTab("business")}
            className={`px-1 py-1.5 font-semibold ${
              tab === "business" ? "bg-[#B5481F] text-white" : "text-[#B5481F]"
            }`}
          >
            Business
          </button>
        </div>

        {tab === "business" && (
          <button
            onClick={() => setShowAddBiz(true)}
            className="flex items-center gap-1 bg-[#B5481F] text-white px-1 py-2 text-sm font-semibold"
          >
            Add Business <Plus size={14} />
          </button>
        )}
      </div>

      {tab === "business" && (
        <BusinessListing
          businesses={businesses}
          onEdit={(biz) => setEditingBusiness(biz)}
          onDelete={handleDeleteBusiness}
        />
      )}

      {tab === "reviews" && (
        <ReviewListing
          reviews={reviews}
          onEdit={(review) => setEditingReview(review)}
          onDelete={handleDeleteReview}
        />
      )}

      {/* MODAL RENDERING - CONDITIONALLY SHOWN BASED ON STATE */}
      {showAddBiz && (
        <BusinessModal
          onClose={() => setShowAddBiz(false)}
          onSubmit={handleAddBusiness}
        />
      )}

      {editingBusiness && (
        <BusinessModal
          existing={editingBusiness}
          onClose={() => setEditingBusiness(null)}
          onSubmit={handleUpdateBusiness}
        />
      )}

      {editingReview && (
        <EditReviewModal
          review={editingReview}
          onClose={() => setEditingReview(null)}
          onSubmit={handleEditReview}
        />
      )}
    </div>
  );
};

export default Profile;