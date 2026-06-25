import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Hero from "../Home/Hero";
import BusinessListing from "../Home/HomeBusinessListing";

const BASE_URL = "https://6dayaqt2w1.execute-api.us-east-1.amazonaws.com/api";
// TYPE DEFINING
export interface HomeBusiness {
  BusinessId: string;
  title: string;
  summary: string;
}

interface HomeProps {
  search: string;
}

const Home = ({ search }: HomeProps) => {
  const [businesses, setBusinesses] = useState<HomeBusiness[]>([]);
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();

  // FETCHING DATA - LOADS ALL BUSINESSES ON PAGE MOUNT
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/business`);
        setBusinesses(res.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  // FILTERING ON THE FRONTEND BASED ON TITLE AND SUMMARY
  const filteredBusinesses = businesses.filter((b) => {
    const term = search.toLowerCase();
    return (
      b.title.toLowerCase().includes(term) ||
      b.summary.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <Hero onEnrollClick={() => nav("/sign-in")} />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6 text-left">View Our Businesses</h2>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <BusinessListing
            businesses={filteredBusinesses}
            onSelect={(id) => nav(`/business/${id}`)}
          />
        )}
      </div>
    </div>
  );
};

export default Home;